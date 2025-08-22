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
         Schema::create('user_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->integer('region_id')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('occupation')->nullable();
            $table->string('education_level')->default('university');
            $table->string('current_grade')->nullable();

            // Arrays → JSON
            $table->json('subjects')->nullable();
            $table->json('goals')->nullable();

            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_data');
    }
};
