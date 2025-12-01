<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VReservationFull;
use App\Models\Table;
use App\Models\Customer;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Today's statistics
        $todayIncome = Payment::whereDate('payment_date', today())
            ->where('status', 'paid')
            ->sum('amount');

        $todayReservations = VReservationFull::whereDate('reservation_time', today())->count();

        $activeReservations = VReservationFull::whereIn('reservation_status', ['pending', 'confirmed'])
            ->whereDate('reservation_time', '>=', today())
            ->count();

        $totalTables = Table::count();
        $availableTables = Table::where('status', 'available')->count();
        $totalCustomers = Customer::count();

        // Weekly income (last 7 days)
        $weeklyIncome = VReservationFull::join('payments', 'reservations.reservation_id', '=', 'payments.reservation_id')
            ->where('payments.status', 'paid')
            ->where('payments.payment_date', '>=', now()->subDays(7))
            ->sum('payments.amount');

        // Recent reservations
        $recentReservations = VReservationFull::orderBy('reservation_time', 'desc')
            ->limit(10)
            ->get();

        // Income by day for the last 30 days
        $dailyIncome = Payment::where('status', 'paid')
            ->where('payment_date', '>=', now()->subDays(30))
            ->groupBy(DB::raw('DATE(payment_date)'))
            ->selectRaw('DATE(payment_date) as date, SUM(amount) as total')
            ->get();

        // Most popular table types
        $popularTableTypes = DB::table('reservations')
            ->join('tables', 'reservations.table_id', '=', 'tables.id')
            ->join('table_types', 'tables.table_type_id', '=', 'table_types.id')
            ->groupBy('table_types.name')
            ->selectRaw('table_types.name, COUNT(*) as booking_count')
            ->orderBy('booking_count', 'desc')
            ->limit(5)
            ->get();

        return view('admin.dashboard', compact(
            'todayIncome',
            'todayReservations',
            'activeReservations',
            'totalTables',
            'availableTables',
            'totalCustomers',
            'weeklyIncome',
            'recentReservations',
            'dailyIncome',
            'popularTableTypes'
        ));
    }

    public function reports()
    {
        // Monthly income for the last 12 months
        $monthlyIncome = Payment::where('status', 'paid')
            ->where('payment_date', '>=', now()->subMonths(12))
            ->groupBy(DB::raw('YEAR(payment_date), MONTH(payment_date)'))
            ->selectRaw('YEAR(payment_date) as year, MONTH(payment_date) as month, SUM(amount) as total')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Reservations by status
        $reservationsByStatus = VReservationFull::selectRaw('reservation_status, COUNT(*) as count')
            ->groupBy('reservation_status')
            ->get();

        // Top customers by reservation count
        $topCustomers = DB::table('reservations')
            ->join('customers', 'reservations.customer_id', '=', 'customers.id')
            ->groupBy('customers.id', 'customers.name', 'customers.email')
            ->selectRaw('customers.name, customers.email, COUNT(*) as reservation_count')
            ->orderBy('reservation_count', 'desc')
            ->limit(10)
            ->get();

        return view('admin.reports', compact(
            'monthlyIncome',
            'reservationsByStatus',
            'topCustomers'
        ));
    }
}