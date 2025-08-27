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
        Schema::table('user_plans', function (Blueprint $table) {
            $table->integer('assessments_used')->default(0)->after('is_active');
            $table->integer('lessons_used')->default(0)->after('assessments_used');
            $table->integer('ai_hints_used')->default(0)->after('lessons_used');
            $table->date('last_reset_date')->nullable()->after('ai_hints_used');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_plans', function (Blueprint $table) {
            $table->dropColumn(['assessments_used', 'lessons_used', 'ai_hints_used', 'last_reset_date']);
        });
    }
};