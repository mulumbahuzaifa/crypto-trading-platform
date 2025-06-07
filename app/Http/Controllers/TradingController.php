<?php

namespace App\Http\Controllers;

use App\Models\Cryptocurrency;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TradingController extends Controller
{
    public function index()
    {
        $cryptocurrencies = Cryptocurrency::where('is_active', true)
            ->orderBy('market_cap', 'desc')
            ->get();

        return Inertia::render('Trading/Index', [
            'cryptocurrencies' => $cryptocurrencies
        ]);
    }

    public function show(string $symbol)
    {
        $cryptocurrency = Cryptocurrency::where('symbol', $symbol)
            ->where('is_active', true)
            ->firstOrFail();

        $user = auth()->user();

        $data = [
            'cryptocurrency' => $cryptocurrency,
            'userWallets' => $user->wallets()
                ->whereIn('currency', [$cryptocurrency->symbol, 'USD'])
                ->get(),
            'recentTrades' => Order::where('cryptocurrency_id', $cryptocurrency->id)
                ->where('status', 'completed')
                ->with(['user', 'trades'])
                ->latest()
                ->take(20)
                ->get(),
            'orderBook' => [
                'bids' => Order::where('cryptocurrency_id', $cryptocurrency->id)
                    ->where('type', 'buy')
                    ->where('status', 'pending')
                    ->orderBy('price', 'desc')
                    ->take(20)
                    ->get(),
                'asks' => Order::where('cryptocurrency_id', $cryptocurrency->id)
                    ->where('type', 'sell')
                    ->where('status', 'pending')
                    ->orderBy('price', 'asc')
                    ->take(20)
                    ->get(),
            ],
        ];

        return Inertia::render('Trading/Show', $data);
    }

    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'cryptocurrency_id' => 'required|exists:cryptocurrencies,id',
            'type' => 'required|in:buy,sell',
            'order_type' => 'required|in:market,limit,stop_loss,take_profit',
            'amount' => 'required|numeric|min:0',
            'price' => 'required_if:order_type,limit,stop_loss,take_profit|numeric|min:0',
        ]);

        $order = Order::create([
            'user_id' => auth()->id(),
            'cryptocurrency_id' => $validated['cryptocurrency_id'],
            'type' => $validated['type'],
            'order_type' => $validated['order_type'],
            'amount' => $validated['amount'],
            'price' => $validated['price'] ?? null,
            'total' => $validated['amount'] * ($validated['price'] ?? 0),
            'remaining_amount' => $validated['amount'],
            'status' => 'pending',
        ]);

        return response()->json($order);
    }
}