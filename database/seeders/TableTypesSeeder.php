<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TableTypesSeeder extends Seeder
{
    public function run(): void
    {
        $tableTypes = [
            [
                'id' => 'tt-001',
                'name' => 'Meja Standard',
                'category' => 'standard',
                'hourly_rate' => 50000.00,
                'description' => 'Meja billiard standard ukuran 9 feet dengan kualitas baik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'tt-002',
                'name' => 'Meja Premium',
                'category' => 'premium',
                'hourly_rate' => 75000.00,
                'description' => 'Meja billiard premium ukuran 10 feet dengan permukaan terbaik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'tt-003',
                'name' => 'Meja VIP',
                'category' => 'vip',
                'hourly_rate' => 100000.00,
                'description' => 'Meja billiard VIP ukuran 12 feet dengan fasilitas lengkap dan ruangan eksklusif',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'tt-004',
                'name' => 'Meja Mini',
                'category' => 'mini',
                'hourly_rate' => 35000.00,
                'description' => 'Meja billiard mini ukuran 6 feet cocok untuk pemula dan anak-anak',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('table_types')->insert($tableTypes);
    }
}