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
        // Add new columns to the existing 'questions' table
        Schema::table('questions', function (Blueprint $table) {
            $table->longText('question');
            $table->json('formulas')->nullable()->after('question');
            $table->json('images')->nullable()->after('formulas');
            // Delete columns
            $table->dropColumn(['content', 'image_path','audio_path','format']); // Replace with actual column names to delete
        });

        Schema::table('variants', function (Blueprint $table) {
            $table->string('option_letter', 1); // A, B, C, D
            $table->json('formulas')->nullable();
            $table->dropColumn(['format', 'image_path']);
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
