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
       Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('provider')->nullable();   // Payme, Click, PayPal...
            $table->string('transaction_id')->nullable(); // gatewaydan keladigan ID
            $table->decimal('amount', 12, 2);  // so‘m
            $table->string('currency', 10)->default('UZS');
            $table->string('status')->default('pending'); // pending, paid, failed
            $table->timestamps();
            $table->softDeletes(); // o'chirish uchun
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
