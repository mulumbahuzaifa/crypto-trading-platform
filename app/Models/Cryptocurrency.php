<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cryptocurrency extends Model
{
    use HasFactory;

    protected $fillable = [
        'symbol',
        'name',
        'current_price',
        'market_cap',
        'volume_24h',
        'total_volume',
        'price_change_24h',
        'price_change_percentage_24h',
        'high_24h',
        'low_24h',
        'image',
        'circulating_supply',
        'total_supply',
        'max_supply',
        'is_active',
        'last_updated_at',
    ];

    protected $casts = [
        'current_price' => 'decimal:8',
        'market_cap' => 'decimal:2',
        'volume_24h' => 'decimal:2',
        'total_volume' => 'decimal:2',
        'price_change_24h' => 'decimal:8',
        'price_change_percentage_24h' => 'decimal:2',
        'high_24h' => 'decimal:8',
        'low_24h' => 'decimal:8',
        'circulating_supply' => 'decimal:8',
        'total_supply' => 'decimal:8',
        'max_supply' => 'decimal:8',
        'is_active' => 'boolean',
        'last_updated_at' => 'datetime',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function trades(): HasMany
    {
        return $this->hasMany(Trade::class);
    }
}