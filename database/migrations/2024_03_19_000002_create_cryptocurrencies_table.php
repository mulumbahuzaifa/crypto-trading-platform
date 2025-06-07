<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cryptocurrencies', function (Blueprint $table) {
            $table->id();
            $table->string('symbol', 10)->unique();
            $table->string('name');
            $table->decimal('current_price', 20, 8);
            $table->decimal('market_cap', 30, 2)->nullable();
            $table->decimal('volume_24h', 30, 2)->nullable();
            $table->decimal('price_change_24h', 20, 8)->nullable();
            $table->decimal('price_change_percentage_24h', 10, 2)->nullable();
            $table->decimal('circulating_supply', 30, 8)->nullable();
            $table->decimal('total_supply', 30, 8)->nullable();
            $table->decimal('max_supply', 30, 8)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cryptocurrencies');
    }
};