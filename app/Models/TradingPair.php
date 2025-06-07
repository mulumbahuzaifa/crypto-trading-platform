<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TradingPair extends Model
{
    use HasFactory;

    protected $fillable = [
        'symbol',
        'base_currency_id',
        'quote_currency_id',
        'min_trade_amount',
        'max_trade_amount',
        'taker_fee',
        'maker_fee',
        'is_active',
    ];

    protected $casts = [
        'min_trade_amount' => 'decimal:8',
        'max_trade_amount' => 'decimal:8',
        'taker_fee' => 'decimal:8',
        'maker_fee' => 'decimal:8',
        'is_active' => 'boolean',
    ];

    public function baseCurrency(): BelongsTo
    {
        return $this->belongsTo(Cryptocurrency::class, 'base_currency_id');
    }

    public function quoteCurrency(): BelongsTo
    {
        return $this->belongsTo(Cryptocurrency::class, 'quote_currency_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function trades(): HasMany
    {
        return $this->hasMany(Trade::class);
    }
}