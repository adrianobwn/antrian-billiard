<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PromosSeeder extends Seeder
{
    public function run(): void
    {
        $promos = [
            [
                'id' => 'promo-001',
                'code' => 'WEEKEND50',
                'description' => 'Diskon 50% untuk booking meja di akhir pekan',
                'discount_percent' => 50,
                'valid_from' => now()->subDays(7),
                'valid_until' => now()->addDays(7),
                'managed_by_admin_id' => 'adm-002',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'promo-002',
                'code' => 'NEWYEAR25',
                'description' => 'Diskon 25% untuk pelanggan baru di bulan Januari',
                'discount_percent' => 25,
                'valid_from' => now()->startOfMonth(),
                'valid_until' => now()->endOfMonth(),
                'managed_by_admin_id' => 'adm-002',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'promo-003',
                'code' => 'VIP30',
                'description' => 'Diskon 30% untuk booking meja VIP minimal 3 jam',
                'discount_percent' => 30,
                'valid_from' => now()->subDays(3),
                'valid_until' => now()->addDays(14),
                'managed_by_admin_id' => 'adm-002',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'promo-004',
                'code' => 'HAPPYHOUR15',
                'description' => 'Diskon 15% untuk booking di jam sibuk (10:00 - 14:00)',
                'discount_percent' => 15,
                'valid_from' => now()->subDays(1),
                'valid_until' => now()->addDays(30),
                'managed_by_admin_id' => 'adm-002',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('promos')->insert($promos);
    }
}