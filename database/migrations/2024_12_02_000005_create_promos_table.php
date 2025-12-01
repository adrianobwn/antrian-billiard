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
        Schema::create('promos', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->integer('discount_percent');
            $table->datetime('valid_from');
            $table->datetime('valid_until');
            $table->string('managed_by_admin_id')->nullable();

            $table->foreign('managed_by_admin_id')->references('id')->on('admins');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};