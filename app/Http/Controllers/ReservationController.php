<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Table;
use App\Models\Promo;
use App\Models\Payment;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function create()
    {
        $tables = Table::with('tableType')
            ->where('status', 'available')
            ->get();

        $promos = Promo::where('valid_from', '<=', now())
            ->where('valid_until', '>=', now())
            ->get();

        return view('customer.create_reservation', compact('tables', 'promos'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'table_id' => ['required', 'exists:tables,id'],
            'reservation_time' => ['required', 'date', 'after:now'],
            'duration_hours' => ['required', 'integer', 'min:1', 'max:8'],
            'promo_code' => ['nullable', 'exists:promos,code'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $table = Table::findOrFail($request->table_id);
        $reservationTime = Carbon::parse($request->reservation_time);
        $durationHours = $request->duration_hours;

        // Check for overlapping reservations
        $this->checkTableAvailability($table->id, $reservationTime, $durationHours);

        // Handle promo
        $promo = null;
        if ($request->promo_code) {
            $promo = Promo::where('code', $request->promo_code)
                ->where('valid_from', '<=', now())
                ->where('valid_until', '>=', now())
                ->first();

            if (!$promo) {
                return back()->withErrors(['promo_code' => 'Invalid or expired promo code'])->withInput();
            }
        }

        // Create reservation
        $reservation = Reservation::create([
            'id' => (string) Str::uuid(),
            'customer_id' => Auth::guard('web')->id(),
            'table_id' => $table->id,
            'reservation_time' => $reservationTime,
            'duration_hours' => $durationHours,
            'status' => 'pending',
            'promo_id' => $promo?->id,
        ]);

        // Log activity
        Auth::guard('web')->user()->activityLogs()->create([
            'id' => (string) Str::uuid(),
            'action' => 'reservation_created',
            'details' => "Created reservation for table {$table->table_number} on {$reservationTime}",
        ]);

        return redirect()->route('customer.reservations.show', $reservation->id)
            ->with('success', 'Reservation created successfully!');
    }

    public function show($id)
    {
        $reservation = Reservation::with(['customer', 'table.tableType', 'promo', 'payment'])
            ->where('customer_id', Auth::guard('web')->id())
            ->findOrFail($id);

        return view('customer.show_reservation', compact('reservation'));
    }

    public function myReservations()
    {
        $reservations = Reservation::with(['table.tableType', 'promo', 'payment'])
            ->where('customer_id', Auth::guard('web')->id())
            ->orderBy('reservation_time', 'desc')
            ->paginate(10);

        return view('customer.my_reservations', compact('reservations'));
    }

    public function cancel($id)
    {
        $reservation = Reservation::where('customer_id', Auth::guard('web')->id())
            ->where('status', 'pending')
            ->findOrFail($id);

        // Only allow cancellation if reservation is at least 2 hours away
        if ($reservation->reservation_time->diffInHours(now()) < 2) {
            return back()->with('error', 'Cannot cancel reservation less than 2 hours before start time');
        }

        $reservation->update(['status' => 'cancelled']);

        // Log activity
        Auth::guard('web')->user()->activityLogs()->create([
            'id' => (string) Str::uuid(),
            'action' => 'reservation_cancelled',
            'details' => "Cancelled reservation for table {$reservation->table->table_number}",
        ]);

        return back()->with('success', 'Reservation cancelled successfully');
    }

    public function processPayment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => ['required', 'string', 'in:cash,credit_card,transfer,ewallet'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $reservation = Reservation::with(['table.tableType', 'promo'])
            ->where('customer_id', Auth::guard('web')->id())
            ->where('status', 'pending')
            ->findOrFail($id);

        $amount = $reservation->calculateCost();

        // Create payment
        $payment = Payment::create([
            'id' => (string) Str::uuid(),
            'reservation_id' => $reservation->id,
            'payment_method' => $request->payment_method,
            'amount' => $amount,
            'payment_date' => now(),
            'status' => 'paid',
        ]);

        // Update reservation status
        $reservation->update(['status' => 'confirmed']);

        // Log activity
        Auth::guard('web')->user()->activityLogs()->create([
            'id' => (string) Str::uuid(),
            'action' => 'payment_completed',
            'details' => "Payment completed for reservation ID: {$reservation->id}",
        ]);

        return redirect()->route('customer.reservations.show', $reservation->id)
            ->with('success', 'Payment completed successfully!');
    }

    private function checkTableAvailability($tableId, $startTime, $durationHours)
    {
        $endTime = $startTime->copy()->addHours($durationHours);

        $conflictingReservations = Reservation::where('table_id', $tableId)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('reservation_time', [$startTime, $endTime])
                    ->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('reservation_time', '<', $startTime)
                            ->whereRaw('DATE_ADD(reservation_time, INTERVAL duration_hours HOUR) > ?', [$startTime]);
                    });
            })
            ->exists();

        if ($conflictingReservations) {
            throw new \Exception('Table is already booked for the selected time slot');
        }
    }

    // Admin methods
    public function adminIndex()
    {
        $reservations = VReservationFull::orderBy('reservation_time', 'desc')->paginate(15);
        return view('admin.reservations', compact('reservations'));
    }

    public function adminShow($id)
    {
        $reservation = VReservationFull::where('reservation_id', $id)->firstOrFail();
        return view('admin.show_reservation', compact('reservation'));
    }

    public function adminUpdateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', 'string', 'in:pending,confirmed,cancelled,completed'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => $request->status]);

        return back()->with('success', 'Reservation status updated successfully');
    }
}