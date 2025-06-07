<?php

namespace App\Http\Controllers;

use App\Models\Cryptocurrency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketController extends Controller
{
    public function index()
    {
        $cryptocurrencies = Cryptocurrency::select([
            'id',
            'name',
            'symbol',
            'current_price',
            'price_change_percentage_24h',
            'market_cap',
            'volume_24h',
            'high_24h',
            'low_24h',
            'image'
        ])->get();

        $marketIndices = [
            'BTC' => [
                'price' => 7340.65,
                'change' => 0.45,
                'isPositive' => true
            ],
            'ETH' => [
                'price' => 146.58,
                'change' => -5.09,
                'isPositive' => false
            ],
            'LTC' => [
                'price' => 44.49,
                'change' => 2.14,
                'isPositive' => true
            ]
        ];

        return Inertia::render('Markets/Index', [
            'cryptocurrencies' => $cryptocurrencies,
            'marketIndices' => $marketIndices
        ]);
    }

    public function cap()
    {
        $cryptocurrencies = Cryptocurrency::select([
            'id',
            'name',
            'symbol',
            'current_price',
            'price_change_percentage_24h',
            'market_cap',
            'volume_24h',
            'high_24h',
            'low_24h',
            'image'
        ])->orderBy('market_cap', 'desc')->get();

        return Inertia::render('Markets/Cap', [
            'cryptocurrencies' => $cryptocurrencies
        ]);
    }

    public function trends()
    {
        $cryptocurrencies = Cryptocurrency::select([
            'id',
            'name',
            'symbol',
            'current_price',
            'price_change_percentage_24h',
            'market_cap',
            'volume_24h',
            'high_24h',
            'low_24h',
            'image'
        ])->orderBy('price_change_percentage_24h', 'desc')->get();

        return Inertia::render('Markets/Trends', [
            'cryptocurrencies' => $cryptocurrencies
        ]);
    }
}