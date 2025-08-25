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
        Schema::table('topics', function (Blueprint $table) {
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->json('prerequisites')->nullable(); // Array of topic IDs that must be completed first
            $table->text('description')->nullable();
            $table->text('learning_objectives')->nullable();
            $table->json('materials')->nullable(); // Learning materials (text, videos, links)
            $table->integer('estimated_time')->nullable(); // Time in minutes to complete topic
            $table->boolean('is_assessment')->default(false); // Whether this topic is for skill assessment
            $table->integer('min_score_to_pass')->default(70); // Minimum score percentage to consider topic mastered
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('topics', function (Blueprint $table) {
            $table->dropColumn([
                'difficulty_level',
                'prerequisites', 
                'description',
                'learning_objectives',
                'materials',
                'estimated_time',
                'is_assessment',
                'min_score_to_pass'
            ]);
        });
    }
};