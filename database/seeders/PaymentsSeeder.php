<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentsSeeder extends Seeder
{
    public function run(): void
    {
        $payments = [
            [
                'id' => 'pay-001',
                'reservation_id' => 'res-001',
                'payment_method' => 'cash',
                'amount' => 150000.00,
                'payment_date' => now()->subHours(2),
                'status' => 'pending',
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subMinutes(30),
            ],
            [
                'id' => 'pay-002',
                'reservation_id' => 'res-002',
                'payment_method' => 'transfer',
                'amount' => 112500.00,
                'payment_date' => now()->subHours(1),
                'status' => 'paid',
                'created_at' => now()->subHours(1),
                'updated_at' => now()->subHours(1),
            ],
            [
                'id' => 'pay-003',
                'reservation_id' => 'res-003',
                'payment_method' => 'ewallet',
                'amount' => 210000.00,
                'payment_date' => now()->subMinutes(30),
                'status' => 'paid',
                'created_at' => now()->subMinutes(30),
                'updated_at' => now()->subMinutes(30),
            ],
            [
                'id' => 'pay-004',
                'reservation_id' => 'res-005',
                'payment_method' => 'cash',
                'amount' => 100000.00,
                'payment_date' => now()->subHours(4),
                'status' => 'paid',
                'created_at' => now()->subHours(4),
                'updated_at' => now()->subHours(4),
            ],
            [
                'id' => 'pay-005',
                'reservation_id' => 'res-006',
                'payment_method' => 'transfer',
                'amount' => 35000.00,
                'payment_date' => now()->subHours(1),
                'status' => 'paid',
                'created_at' => now()->subHours(1),
                'updated_at' => now()->subHours(1),
            ],
        ];

        DB::table('payments')->insert($payments);
    }
}