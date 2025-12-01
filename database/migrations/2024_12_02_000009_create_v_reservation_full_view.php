<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            CREATE OR REPLACE VIEW v_reservation_full AS
            SELECT
                r.id as reservation_id,
                r.customer_id,
                c.name as customer_name,
                c.email as customer_email,
                c.phone as customer_phone,
                r.table_id,
                t.table_number,
                tt.name as table_type_name,
                tt.category as table_category,
                tt.hourly_rate as table_hourly_rate,
                r.reservation_time,
                r.duration_hours,
                r.status as reservation_status,
                r.promo_id,
                p.code as promo_code,
                p.description as promo_description,
                p.discount_percent as promo_discount_percent,
                p.valid_from,
                p.valid_until,
                r.created_at,
                r.updated_at
            FROM reservations r
            LEFT JOIN customers c ON r.customer_id = c.id
            LEFT JOIN tables t ON r.table_id = t.id
            LEFT JOIN table_types tt ON t.table_type_id = tt.id
            LEFT JOIN promos p ON r.promo_id = p.id
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS v_reservation_full");
    }
};