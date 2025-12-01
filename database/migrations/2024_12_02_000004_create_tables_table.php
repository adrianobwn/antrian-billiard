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
        Schema::create('tables', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('table_number')->unique();
            $table->string('table_type_id');
            $table->string('status');
            $table->string('location');
            $table->string('managed_by_admin_id')->nullable();

            $table->foreign('table_type_id')->references('id')->on('table_types');
            $table->foreign('managed_by_admin_id')->references('id')->on('admins');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};