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
       Schema::table('plans', function (Blueprint $table) {
            $table->integer('assessments_limit')->default(1);
            $table->integer('lessons_limit')->default(0);
            $table->integer('ai_hints_limit')->default(0);
            $table->integer('subjects_limit')->default(0);
        });

        Schema::table('user_plans', function (Blueprint $table) {
             $table->string('payment_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
