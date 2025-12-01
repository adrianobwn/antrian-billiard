<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TablesSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [
            [
                'id' => 'tbl-001',
                'table_number' => 'S-01',
                'table_type_id' => 'tt-001',
                'status' => 'available',
                'location' => 'Area Utama Lantai 1',
                'managed_by_admin_id' => 'adm-004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'tbl-002',
                'table_number' => 'S-02',
                'table_type_id' => 'tt-001',
                'status' => 'occupied',
                'location' => 'Area Utama Lantai 1',
                'managed_by_admin_id' => 'adm-004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'tbl-003',
                'table_number' => 'P-01',
                'table_type_id' => 'tt-002',
                'status' => 'available',
                'location' => 'Area Premium Lantai 2',
                'managed_by_admin_id' => 'adm-004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'tbl-004',
                'table_number' => 'P-02',
                'table_type_id' => 'tt-002',
                'status' => 'maintenance',
                'location' => 'Area Premium Lantai 2',
                'managed_by_admin_id' => 'adm-004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'tbl-005',
                'table_number' => 'VIP-01',
                'table_type_id' => 'tt-003',
                'status' => 'available',
                'location' => 'Ruangan VIP Eksklusif',
                'managed_by_admin_id' => 'adm-004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'tbl-006',
                'table_number' => 'M-01',
                'table_type_id' => 'tt-004',
                'status' => 'available',
                'location' => 'Area Anak-Anak Lantai 1',
                'managed_by_admin_id' => 'adm-004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'tbl-007',
                'table_number' => 'S-03',
                'table_type_id' => 'tt-001',
                'status' => 'reserved',
                'location' => 'Area Utama Lantai 1',
                'managed_by_admin_id' => 'adm-004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'tbl-008',
                'table_number' => 'S-04',
                'table_type_id' => 'tt-001',
                'status' => 'available',
                'location' => 'Area Utama Lantai 1',
                'managed_by_admin_id' => 'adm-004',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('tables')->insert($tables);
    }
}