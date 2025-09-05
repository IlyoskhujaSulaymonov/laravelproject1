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
        Schema::table('questions', function (Blueprint $table) {
            // Make topic_id nullable to support subject-based questions
            $table->foreignId('topic_id')->nullable()->change();
            
            // Add subject_id for Na'munaviy savollar (Sample Questions)
            $table->foreignId('subject_id')->nullable()->constrained()->onDelete('cascade')->after('topic_id');
            
            // Add type field to distinguish between regular and sample questions
            $table->enum('type', ['regular', 'sample'])->default('regular')->after('subject_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['subject_id']);
            $table->dropColumn(['subject_id', 'type']);
            $table->foreignId('topic_id')->nullable(false)->change();
        });
    }
};