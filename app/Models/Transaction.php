<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'type', // 'deposit', 'withdrawal', 'transfer', 'trade'
        'amount',
        'currency',
        'status', // 'pending', 'completed', 'failed', 'cancelled'
        'reference_id', // External reference (e.g., blockchain transaction hash)
        'description',
        'metadata', // Additional transaction data in JSON format
        'completed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:8',
        'metadata' => 'array',
        'completed_at' => 'datetime',
    ];

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }
}