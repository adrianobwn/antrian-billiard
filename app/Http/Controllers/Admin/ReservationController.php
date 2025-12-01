<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\VReservationFull;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = VReservationFull::orderBy('reservation_time', 'desc')->paginate(15);
        return view('admin.reservations', compact('reservations'));
    }

    public function show($id)
    {
        $reservation = VReservationFull::where('reservation_id', $id)->firstOrFail();
        return view('admin.show_reservation', compact('reservation'));
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', 'string', 'in:pending,confirmed,cancelled,completed,active'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => $request->status]);

        return back()->with('success', 'Reservation status updated successfully');
    }
}
