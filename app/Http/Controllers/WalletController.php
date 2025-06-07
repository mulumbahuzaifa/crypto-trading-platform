<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $data = [
            'wallets' => $user->wallets()
                ->with(['transactions' => function ($query) {
                    $query->latest()->take(10);
                }])
                ->get(),
            'recentTransactions' => Transaction::whereIn('wallet_id', $user->wallets->pluck('id'))
                ->with('wallet')
                ->latest()
                ->take(20)
                ->get(),
        ];

        return Inertia::render('Wallet/Index', $data);
    }

    public function deposit()
    {
        $user = auth()->user();
        $wallets = $user->wallets()->get();

        return Inertia::render('Wallet/Deposit', [
            'wallets' => $wallets,
        ]);
    }

    public function withdraw()
    {
        $user = auth()->user();
        $wallets = $user->wallets()->get();

        return Inertia::render('Wallet/Withdraw', [
            'wallets' => $wallets,
        ]);
    }

    public function show(Wallet $wallet)
    {
        $this->authorize('view', $wallet);

        $data = [
            'wallet' => $wallet->load('transactions'),
            'transactions' => $wallet->transactions()
                ->latest()
                ->paginate(20),
        ];

        return Inertia::render('Wallet/Show', $data);
    }

    public function createDeposit(Request $request, Wallet $wallet)
    {
        $this->authorize('update', $wallet);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'reference_id' => 'required|string|unique:transactions,reference_id',
        ]);

        $transaction = $wallet->transactions()->create([
            'type' => 'deposit',
            'amount' => $validated['amount'],
            'currency' => $wallet->currency,
            'status' => 'pending',
            'reference_id' => $validated['reference_id'],
            'description' => 'Deposit transaction',
        ]);

        return back()->with('success', 'Deposit request created successfully.');
    }

    public function createWithdrawal(Request $request, Wallet $wallet)
    {
        $this->authorize('update', $wallet);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'address' => 'required|string',
        ]);

        if ($wallet->balance < $validated['amount']) {
            return back()->with('error', 'Insufficient balance.');
        }

        $transaction = $wallet->transactions()->create([
            'type' => 'withdrawal',
            'amount' => $validated['amount'],
            'currency' => $wallet->currency,
            'status' => 'pending',
            'description' => 'Withdrawal to ' . $validated['address'],
            'metadata' => ['address' => $validated['address']],
        ]);

        return back()->with('success', 'Withdrawal request created successfully.');
    }
}