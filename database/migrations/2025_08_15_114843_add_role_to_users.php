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
         Schema::table('users', function (Blueprint $table) {
            $table->integer('role')->default(1)->after('email'); // 0 for user, 1 for admin
            $table->string('phone', 15)->nullable()->after('role'); // Phone number field
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
