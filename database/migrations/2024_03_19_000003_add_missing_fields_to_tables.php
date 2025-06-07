<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('phone')->nullable()->after('email');
            $table->string('address')->nullable()->after('phone');
            $table->string('city')->nullable()->after('address');
            $table->string('country')->nullable()->after('city');
            $table->string('postal_code')->nullable()->after('country');
            $table->boolean('is_verified')->default(false)->after('password');
            $table->boolean('two_factor_enabled')->default(false)->after('is_verified');
            $table->json('security_questions')->nullable()->after('two_factor_enabled');
            $table->string('verification_document_path')->nullable()->after('security_questions');
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->decimal('available_balance', 20, 8)->default(0)->after('balance');
        });

        Schema::table('cryptocurrencies', function (Blueprint $table) {
            $table->decimal('total_volume', 20, 8)->default(0)->after('volume_24h');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'phone',
                'address',
                'city',
                'country',
                'postal_code',
                'is_verified',
                'two_factor_enabled',
                'security_questions',
                'verification_document_path'
            ]);
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->dropColumn('available_balance');
        });

        Schema::table('cryptocurrencies', function (Blueprint $table) {
            $table->dropColumn('total_volume');
        });
    }
};