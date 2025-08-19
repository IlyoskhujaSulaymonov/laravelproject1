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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Free, Premium, Star
            $table->string('slug')->unique(); // free, premium, star
            $table->decimal('price', 10, 2)->default(0); // monthly price
            $table->integer('duration')->nullable(); // in days
            $table->text('description')->nullable();
            $table->json('features')->nullable(); // store feature list in JSON
            $table->timestamps();
            $table->softDeletes(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
