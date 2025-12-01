<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $recentReservations = Auth::guard('web')->user()->reservations()
            ->with(['table.tableType', 'payment', 'promo'])
            ->orderBy('reservation_time', 'desc')
            ->limit(5)
            ->get();
        
        return view('customer.dashboard', compact('recentReservations'));
    }
}
