<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $regions = [
            'Toshkent shahri',
            'Toshkent viloyati',
            'Andijon viloyati',
            'Farg‘ona viloyati',
            'Namangan viloyati',
            'Samarqand viloyati',
            'Buxoro viloyati',
            'Xorazm viloyati',
            'Qashqadaryo viloyati',
            'Surxondaryo viloyati',
            'Jizzax viloyati',
            'Sirdaryo viloyati',
            'Navoiy viloyati',
            'Qoraqalpog‘iston Respublikasi',
        ];

        foreach ($regions as $region) {
            DB::table('regions')->insert([
                'name' => $region,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
