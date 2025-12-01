<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminsSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            [
                'id' => 'adm-001',
                'name' => 'Admin Utama',
                'email' => 'admin@antrianbilliard.com',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'adm-002',
                'name' => 'Manager Operasional',
                'email' => 'manager@antrianbilliard.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'adm-003',
                'name' => 'Staff Kasir',
                'email' => 'kasir@antrianbilliard.com',
                'password' => Hash::make('kasir123'),
                'role' => 'cashier',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'adm-004',
                'name' => 'Operator Lapangan',
                'email' => 'operator@antrianbilliard.com',
                'password' => Hash::make('operator123'),
                'role' => 'operator',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('admins')->insert($admins);
    }
}