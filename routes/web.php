<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Customer\ReservationController as CustomerReservationController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\Admin\TableController;
use App\Http\Controllers\Admin\TableTypeController;
use App\Http\Controllers\Admin\PromoController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Customer Authentication Routes
Route::prefix('customer')->name('customer.')->group(function () {
    Route::get('/login', [AuthController::class, 'showCustomerLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'customerLogin']);
    Route::get('/register', [AuthController::class, 'showCustomerRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'customerRegister']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::middleware('auth:web')->group(function () {
        Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');

        // Reservation Routes
        Route::get('/reservations/create', [CustomerReservationController::class, 'create'])->name('reservations.create');
        Route::post('/reservations', [CustomerReservationController::class, 'store'])->name('reservations.store');
        Route::get('/reservations/my', [CustomerReservationController::class, 'myReservations'])->name('reservations.my');
        Route::get('/reservations/{id}', [CustomerReservationController::class, 'show'])->name('reservations.show');
        Route::post('/reservations/{id}/cancel', [CustomerReservationController::class, 'cancel'])->name('reservations.cancel');
        Route::post('/reservations/{id}/pay', [CustomerReservationController::class, 'processPayment'])->name('reservations.pay');
    });
});

// Admin Authentication Routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showAdminLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'adminLogin']);
    Route::post('/logout', function (Request $request) {
        return app(AuthController::class)->logout($request, 'admin');
    })->name('logout');

    Route::middleware('auth:admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/reports', [AdminDashboardController::class, 'reports'])->name('reports');

        // Table Type Management
        Route::prefix('table-types')->name('table-types.')->group(function () {
            Route::get('/', [TableTypeController::class, 'index'])->name('index');
            Route::get('/create', [TableTypeController::class, 'create'])->name('create');
            Route::post('/', [TableTypeController::class, 'store'])->name('store');
            Route::get('/{id}/edit', [TableTypeController::class, 'edit'])->name('edit');
            Route::put('/{id}', [TableTypeController::class, 'update'])->name('update');
            Route::delete('/{id}', [TableTypeController::class, 'destroy'])->name('destroy');
        });

        // Table Management
        Route::prefix('tables')->name('tables.')->group(function () {
            Route::get('/', [TableController::class, 'index'])->name('index');
            Route::get('/create', [TableController::class, 'create'])->name('create');
            Route::post('/', [TableController::class, 'store'])->name('store');
            Route::get('/{id}/edit', [TableController::class, 'edit'])->name('edit');
            Route::put('/{id}', [TableController::class, 'update'])->name('update');
            Route::delete('/{id}', [TableController::class, 'destroy'])->name('destroy');
        });

        // Promo Management
        Route::prefix('promos')->name('promos.')->group(function () {
            Route::get('/', [PromoController::class, 'index'])->name('index');
            Route::get('/create', [PromoController::class, 'create'])->name('create');
            Route::post('/', [PromoController::class, 'store'])->name('store');
            Route::get('/{id}/edit', [PromoController::class, 'edit'])->name('edit');
            Route::put('/{id}', [PromoController::class, 'update'])->name('update');
            Route::delete('/{id}', [PromoController::class, 'destroy'])->name('destroy');
        });

        // Reservation Management
        Route::prefix('reservations')->name('reservations.')->group(function () {
            Route::get('/', [AdminReservationController::class, 'index'])->name('index');
            Route::get('/{id}', [AdminReservationController::class, 'show'])->name('show');
            Route::put('/{id}/status', [AdminReservationController::class, 'updateStatus'])->name('update-status');
        });
    });
});

// Redirect root to customer dashboard
Route::get('/', function () {
    return redirect()->route('customer.login');
});

// Fallback for unauthorized access
Route::get('/unauthorized', function () {
    return view('errors.unauthorized');
})->name('unauthorized');