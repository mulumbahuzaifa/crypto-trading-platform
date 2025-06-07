<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MarketController;
use App\Http\Controllers\TradingController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware([
        'auth:sanctum',
        // config('jetstream.auth_middleware'),
        'verified'
    ])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/portfolio', [DashboardController::class, 'portfolio'])->name('dashboard.portfolio');
    Route::get('/dashboard/history', [DashboardController::class, 'history'])->name('dashboard.history');

    // User Management
    Route::prefix('dashboard/users')->name('users.')->group(function () {
        // User Roles Management
        Route::get('/roles', [UserRoleController::class, 'index'])->name('roles.index');
        Route::get('/roles/create', [UserRoleController::class, 'create'])->name('roles.create');
        Route::post('/roles', [UserRoleController::class, 'store'])->name('roles.store');
        Route::get('/roles/{role}/edit', [UserRoleController::class, 'edit'])->name('roles.edit');
        Route::put('/roles/{role}', [UserRoleController::class, 'update'])->name('roles.update');
        Route::delete('/roles/{role}', [UserRoleController::class, 'destroy'])->name('roles.destroy');

        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}', [UserController::class, 'show'])->name('show');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');


        // Assign/Remove Roles
        Route::post('/{user}/roles/{role}', [UserRoleController::class, 'assignRole'])->name('roles.assign');
        Route::delete('/{user}/roles/{role}', [UserRoleController::class, 'removeRole'])->name('roles.remove');
    });

    // Trading
    Route::get('/trading', [TradingController::class, 'index'])->name('trading.index');
    Route::get('/trading/live-prices', [TradingController::class, 'livePrices'])->name('trading.live-prices');
    Route::get('/trading/order-book', [TradingController::class, 'orderBook'])->name('trading.order-book');
    Route::post('/trading/orders', [TradingController::class, 'createOrder'])->name('trading.orders.create');

    // Markets
    Route::get('/markets', [MarketController::class, 'index'])->name('markets.index');
    Route::get('/markets/cap', [MarketController::class, 'cap'])->name('markets.cap');
    Route::get('/markets/trends', [MarketController::class, 'trends'])->name('markets.trends');

    // Wallets
    Route::get('/wallets', [WalletController::class, 'index'])->name('wallets.index');
    Route::get('/wallets/deposit', [WalletController::class, 'deposit'])->name('wallets.deposit');
    Route::get('/wallets/withdraw', [WalletController::class, 'withdraw'])->name('wallets.withdraw');
    Route::post('/wallets/{wallet}/deposit', [WalletController::class, 'createDeposit'])->name('wallets.deposit.create');
    Route::post('/wallets/{wallet}/withdraw', [WalletController::class, 'createWithdrawal'])->name('wallets.withdraw.create');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/profile', [SettingsController::class, 'updateProfile'])->name('settings.profile.update');
    Route::post('/settings/security', [SettingsController::class, 'updateSecurity'])->name('settings.security.update');
    Route::post('/settings/notifications', [SettingsController::class, 'updateNotifications'])->name('settings.notifications.update');
    Route::post('/settings/api-keys', [SettingsController::class, 'createApiKey'])->name('settings.api-keys.create');
    Route::post('/settings/api-keys/{id}/toggle', [SettingsController::class, 'toggleApiKey'])->name('settings.api-keys.toggle');
    Route::delete('/settings/api-keys/{id}', [SettingsController::class, 'deleteApiKey'])->name('settings.api-keys.delete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';