<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        \App\Models\Plan::insert([
            [
                'name' => 'Free',
                'slug' => 'free',
                'price' => 0,
                'duration' => 30,
                'features' => json_encode(['Basic courses']),
            ],
            [
                'name' => 'Premium',
                'slug' => 'premium',
                'price' => 9.99,
                'duration' => 30,
                'features' => json_encode(['All courses', 'Priority support']),
            ],
            [
                'name' => 'Star',
                'slug' => 'star',
                'price' => 19.99,
                'duration' => 30,
                'features' => json_encode(['All courses', '1-on-1 mentoring', 'Downloadable resources']),
            ],
        ]);
    }

}
