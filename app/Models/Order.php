<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cryptocurrency_id',
        'type', // 'buy' or 'sell'
        'order_type', // 'market', 'limit', 'stop_loss', 'take_profit'
        'price',
        'amount',
        'total',
        'status', // 'pending', 'completed', 'cancelled', 'failed'
        'filled_amount',
        'remaining_amount',
        'execution_price',
        'expires_at',
    ];

    protected $casts = [
        'price' => 'decimal:8',
        'amount' => 'decimal:8',
        'total' => 'decimal:8',
        'filled_amount' => 'decimal:8',
        'remaining_amount' => 'decimal:8',
        'execution_price' => 'decimal:8',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cryptocurrency(): BelongsTo
    {
        return $this->belongsTo(Cryptocurrency::class);
    }

    public function trades(): HasMany
    {
        return $this->hasMany(Trade::class);
    }
}