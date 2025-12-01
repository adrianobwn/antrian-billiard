<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TableTypesSeeder::class,
            AdminsSeeder::class,
            TablesSeeder::class,
            CustomersSeeder::class,
            PromosSeeder::class,
            ReservationsSeeder::class,
            PaymentsSeeder::class,
        ]);
    }
}