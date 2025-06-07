<?php

namespace App\Http\Controllers;

use App\Models\Cryptocurrency;
use App\Models\Order;
use App\Models\TradingPair;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $data = [
            'wallets' => $user->wallets()
                ->with('transactions')
                ->get(),
            'recentOrders' => $user->orders()
                ->with(['cryptocurrency', 'tradingPair'])
                ->latest()
                ->take(5)
                ->get(),
            'recentTrades' => $user->buyTrades()
                ->with(['cryptocurrency', 'seller', 'tradingPair'])
                ->orWhereHas('seller', function ($query) use ($user) {
                    $query->where('id', $user->id);
                })
                ->latest()
                ->take(5)
                ->get(),
            'topCryptocurrencies' => Cryptocurrency::where('is_active', true)
                ->orderBy('market_cap', 'desc')
                ->take(10)
                ->get(),
            'activeTradingPairs' => TradingPair::where('is_active', true)
                ->with(['baseCurrency', 'quoteCurrency'])
                ->get(),
            'marketStats' => [
                'totalVolume24h' => Cryptocurrency::sum('volume_24h'),
                'totalMarketCap' => Cryptocurrency::sum('market_cap'),
                'activePairs' => TradingPair::where('is_active', true)->count(),
                'totalTrades24h' => Order::where('created_at', '>=', now()->subDay())->count(),
            ],
            'portfolioStats' => [
                'totalBalance' => $user->wallets()->sum('balance'),
                'availableBalance' => $user->wallets()->sum('available_balance'),
                'totalOrders' => $user->orders()->count(),
                'totalTrades' => $user->buyTrades()->count() + $user->sellTrades()->count(),
            ],
        ];

        return Inertia::render('dashboard', $data);
    }

    public function portfolio()
    {
        $user = Auth::user();

        $data = [
            'wallets' => $user->wallets()
                ->with(['transactions' => function ($query) {
                    $query->latest()->take(10);
                }])
                ->get(),
            'portfolioValue' => $user->wallets()->sum('balance'),
            'availableBalance' => $user->wallets()->sum('available_balance'),
            'recentTransactions' => $user->wallets()
                ->with(['transactions' => function ($query) {
                    $query->latest()->take(20);
                }])
                ->get()
                ->pluck('transactions')
                ->flatten()
                ->sortByDesc('created_at')
                ->take(20),
        ];

        return Inertia::render('Dashboard/portfolio', $data);
    }

    public function history()
    {
        $user = Auth::user();

        $data = [
            'orders' => $user->orders()
                ->with(['cryptocurrency', 'tradingPair'])
                ->latest()
                ->paginate(20),
            'trades' => $user->buyTrades()
                ->with(['cryptocurrency', 'seller', 'tradingPair'])
                ->orWhereHas('seller', function ($query) use ($user) {
                    $query->where('id', $user->id);
                })
                ->latest()
                ->paginate(20),
            'statistics' => [
                'totalOrders' => $user->orders()->count(),
                'totalTrades' => $user->buyTrades()->count() + $user->sellTrades()->count(),
                'successfulTrades' => $user->buyTrades()
                    ->where('status', 'completed')
                    ->count() + $user->sellTrades()
                    ->where('status', 'completed')
                    ->count(),
                'totalVolume' => $user->buyTrades()
                    ->where('status', 'completed')
                    ->sum('total') + $user->sellTrades()
                    ->where('status', 'completed')
                    ->sum('total'),
            ],
        ];

        return Inertia::render('Dashboard/history', $data);
    }
}