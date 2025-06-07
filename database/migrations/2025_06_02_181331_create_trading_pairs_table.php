<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trading_pairs', function (Blueprint $table) {
            $table->id();
            $table->string('symbol')->unique(); // BTC/USDT, ETH/BTC, etc.
            $table->foreignId('base_currency_id')->constrained('cryptocurrencies');
            $table->foreignId('quote_currency_id')->constrained('cryptocurrencies');
            $table->decimal('min_trade_amount', 24, 8)->default(0.0001);
            $table->decimal('max_trade_amount', 24, 8)->default(100);
            $table->decimal('taker_fee', 10, 8)->default(0.002); // 0.2%
            $table->decimal('maker_fee', 10, 8)->default(0.001); // 0.1%
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trading_pairs');
    }
};