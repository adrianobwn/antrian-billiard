<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CustomersSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password'); // Default password untuk semua customer
        
        $customers = [
            [
                'id' => 'cus-001',
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@email.com',
                'phone' => '08123456789',
                'password' => $password,
                'registered_at' => now()->subDays(30),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'cus-002',
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@email.com',
                'phone' => '08234567890',
                'password' => $password,
                'registered_at' => now()->subDays(25),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'cus-003',
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@email.com',
                'phone' => '08345678901',
                'password' => $password,
                'registered_at' => now()->subDays(20),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'cus-004',
                'name' => 'Dewi Kartika',
                'email' => 'dewi.kartika@email.com',
                'phone' => '08456789012',
                'password' => $password,
                'registered_at' => now()->subDays(15),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'cus-005',
                'name' => 'Rizky Pratama',
                'email' => 'rizky.pratama@email.com',
                'phone' => '08567890123',
                'password' => $password,
                'registered_at' => now()->subDays(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'cus-006',
                'name' => 'Maya Anggraini',
                'email' => 'maya.anggraini@email.com',
                'phone' => '08678901234',
                'password' => $password,
                'registered_at' => now()->subDays(5),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'cus-007',
                'name' => 'Fajar Nugroho',
                'email' => 'fajar.nugroho@email.com',
                'phone' => '08789012345',
                'password' => $password,
                'registered_at' => now()->subDays(3),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'cus-008',
                'name' => 'Sarah Permata',
                'email' => 'sarah.permata@email.com',
                'phone' => '08890123456',
                'password' => $password,
                'registered_at' => now()->subDays(1),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('customers')->insert($customers);
    }
}