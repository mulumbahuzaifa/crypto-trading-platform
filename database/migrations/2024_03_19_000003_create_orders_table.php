<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('cryptocurrency_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['buy', 'sell']);
            $table->enum('order_type', ['market', 'limit', 'stop_loss', 'take_profit']);
            $table->decimal('price', 20, 8)->nullable();
            $table->decimal('amount', 20, 8);
            $table->decimal('total', 20, 8);
            $table->enum('status', ['pending', 'completed', 'cancelled', 'failed'])->default('pending');
            $table->decimal('filled_amount', 20, 8)->default(0);
            $table->decimal('remaining_amount', 20, 8);
            $table->decimal('execution_price', 20, 8)->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['cryptocurrency_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};