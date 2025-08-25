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
        Schema::create('user_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('topic_id')->constrained()->onDelete('cascade');
            $table->string('test_name');
            $table->integer('total_questions');
            $table->integer('correct_answers');
            $table->integer('score_percentage');
            $table->integer('time_spent')->nullable(); // in seconds
            $table->json('questions_data')->nullable(); // store question IDs and user answers
            $table->enum('status', ['completed', 'in_progress', 'abandoned'])->default('completed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_tests');
    }
};
