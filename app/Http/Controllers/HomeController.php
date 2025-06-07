<?php

namespace App\Http\Controllers;

use App\Models\Cryptocurrency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $data = [
            'topCryptocurrencies' => Cryptocurrency::where('is_active', true)
                ->orderBy('market_cap', 'desc')
                ->take(6)
                ->get(),
            'features' => [
                [
                    'title' => 'Live Technical Analysis',
                    'description' => 'Advanced charting tools and technical indicators for professional trading.',
                    'icon' => 'chart-line',
                ],
                [
                    'title' => 'Live Market Data',
                    'description' => 'Real-time market data and price updates for informed trading decisions.',
                    'icon' => 'pulse',
                ],
                [
                    'title' => 'Secure Storage',
                    'description' => 'Your assets are protected with industry-leading security measures.',
                    'icon' => 'shield-check',
                ],
                [
                    'title' => 'Multiple Order Types',
                    'description' => 'Support for market, limit, stop-loss, and take-profit orders.',
                    'icon' => 'list',
                ],
                [
                    'title' => '24/7 Support',
                    'description' => 'Our dedicated support team is available around the clock.',
                    'icon' => 'headset',
                ],
                [
                    'title' => 'Mobile Trading',
                    'description' => 'Trade on the go with our mobile-optimized platform.',
                    'icon' => 'phone-portrait',
                ],
                [
                    'title' => 'Advanced Charts',
                    'description' => 'Professional-grade trading charts with multiple timeframes.',
                    'icon' => 'bar-chart',
                ],
                [
                    'title' => 'Market Depth',
                    'description' => 'View order book depth and liquidity for better trading decisions.',
                    'icon' => 'layers',
                ],
            ],
        ];

        return Inertia::render('Home/Index', $data);
    }
}