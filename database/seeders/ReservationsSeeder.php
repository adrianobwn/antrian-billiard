<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReservationsSeeder extends Seeder
{
    public function run(): void
    {
        $reservations = [
            [
                'id' => 'res-001',
                'customer_id' => 'cus-001',
                'table_id' => 'tbl-002',
                'reservation_time' => now()->subHours(2),
                'duration_hours' => 3,
                'status' => 'active',
                'promo_id' => null,
                'created_at' => now()->subHours(3),
                'updated_at' => now()->subHours(2),
            ],
            [
                'id' => 'res-002',
                'customer_id' => 'cus-002',
                'table_id' => 'tbl-003',
                'reservation_time' => now()->addHours(2),
                'duration_hours' => 2,
                'status' => 'confirmed',
                'promo_id' => 'promo-001',
                'created_at' => now()->subHours(1),
                'updated_at' => now()->subMinutes(30),
            ],
            [
                'id' => 'res-003',
                'customer_id' => 'cus-003',
                'table_id' => 'tbl-007',
                'reservation_time' => now()->addHours(5),
                'duration_hours' => 4,
                'status' => 'confirmed',
                'promo_id' => 'promo-003',
                'created_at' => now()->subMinutes(15),
                'updated_at' => now()->subMinutes(15),
            ],
            [
                'id' => 'res-004',
                'customer_id' => 'cus-004',
                'table_id' => 'tbl-005',
                'reservation_time' => now()->addHours(24),
                'duration_hours' => 5,
                'status' => 'pending',
                'promo_id' => 'promo-002',
                'created_at' => now()->subMinutes(45),
                'updated_at' => now()->subMinutes(45),
            ],
            [
                'id' => 'res-005',
                'customer_id' => 'cus-005',
                'table_id' => 'tbl-001',
                'reservation_time' => now()->subHours(6),
                'duration_hours' => 2,
                'status' => 'completed',
                'promo_id' => null,
                'created_at' => now()->subHours(8),
                'updated_at' => now()->subHours(4),
            ],
            [
                'id' => 'res-006',
                'customer_id' => 'cus-006',
                'table_id' => 'tbl-006',
                'reservation_time' => now()->addHours(12),
                'duration_hours' => 1,
                'status' => 'confirmed',
                'promo_id' => null,
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(1),
            ],
            [
                'id' => 'res-007',
                'customer_id' => 'cus-007',
                'table_id' => 'tbl-008',
                'reservation_time' => now()->addHours(8),
                'duration_hours' => 3,
                'status' => 'confirmed',
                'promo_id' => 'promo-004',
                'created_at' => now()->subMinutes(30),
                'updated_at' => now()->subMinutes(30),
            ],
        ];

        DB::table('reservations')->insert($reservations);
    }
}