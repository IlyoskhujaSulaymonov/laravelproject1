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
        Schema::table('plan_purchase_requests', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('message');
            $table->string('telegram_username')->nullable()->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plan_purchase_requests', function (Blueprint $table) {
            $table->dropColumn(['phone', 'telegram_username']);
        });
    }
};