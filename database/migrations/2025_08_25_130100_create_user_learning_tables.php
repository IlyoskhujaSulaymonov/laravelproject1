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
        // User skill levels per subject
        Schema::create('user_skill_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->enum('skill_level', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->integer('assessment_score')->nullable(); // Last assessment score
            $table->timestamp('last_assessed_at')->nullable();
            $table->boolean('needs_reassessment')->default(false);
            $table->timestamps();
            
            $table->unique(['user_id', 'subject_id']);
        });

        // User progress per topic
        Schema::create('user_topic_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('topic_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['not_started', 'in_progress', 'completed', 'mastered'])->default('not_started');
            $table->integer('best_score')->default(0); // Best score percentage achieved
            $table->integer('attempts')->default(0); // Number of test attempts
            $table->integer('correct_answers')->default(0); // Total correct answers across all attempts
            $table->integer('total_questions_attempted')->default(0);
            $table->json('weak_areas')->nullable(); // Array of question types user struggles with
            $table->timestamp('last_attempted_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('mastered_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'topic_id']);
        });

        // User learning recommendations
        Schema::create('user_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('topic_id')->constrained()->onDelete('cascade');
            $table->enum('reason', ['weak_area', 'prerequisite', 'next_level', 'review'])->default('weak_area');
            $table->integer('priority')->default(1); // 1 = highest priority
            $table->text('explanation')->nullable(); // Why this topic is recommended
            $table->boolean('is_active')->default(true);
            $table->timestamp('recommended_at');
            $table->timestamp('dismissed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_recommendations');
        Schema::dropIfExists('user_topic_progress');
        Schema::dropIfExists('user_skill_levels');
    }
};