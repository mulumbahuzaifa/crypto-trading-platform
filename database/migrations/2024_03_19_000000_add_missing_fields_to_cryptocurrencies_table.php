<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('cryptocurrencies', function (Blueprint $table) {
            $table->decimal('high_24h', 20, 8)->nullable()->after('price_change_percentage_24h');
            $table->decimal('low_24h', 20, 8)->nullable()->after('high_24h');
            $table->string('image')->nullable()->after('low_24h');
        });
    }

    public function down()
    {
        Schema::table('cryptocurrencies', function (Blueprint $table) {
            $table->dropColumn(['high_24h', 'low_24h', 'image']);
        });
    }
};