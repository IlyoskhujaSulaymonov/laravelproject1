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
            'name' => 'Oddiy',
            'slug' => 'free',
            'description' => 'Asosiy imkoniyatlar bilan tanishish uchun',
            'price' => 0,
            'assessments_limit' => 1,
            'lessons_limit' => 5,
            'ai_hints_limit' => 0,
            'duration' => null,
            'features' => json_encode([
                'Oyiga 1 ta baholash testi',
                'Oyiga 5 ta dars',
                'Asosiy statistika'
            ]),
        ],
        [
            'name' => 'Premium',
            'slug' => 'premium',
            'description' => 'Ko\'proq imkoniyatlar va qo\'shimcha resurslar',
            'price' => 50000,
            'assessments_limit' => 3,
            'lessons_limit' => 20,
            'ai_hints_limit' => 5,
            'duration' => 30,
            'features' => json_encode([
                'Oyiga 3 ta baholash testi',
                'Oyiga 50 ta dars',
                'AI maslahatlar',
                'Batafsil statistika',
                'Video darslar'
            ]),
        ],
        [
            'name' => 'Super premium',
            'slug' => 'super-premium',
            'price' => 150000,
            'assessments_limit' => 999,
            'lessons_limit' => 50,
            'ai_hints_limit' => 10,
            'description' => 'Eng yuqori darajadagi imkoniyatlar',
            'duration' => 30,
            'features' => json_encode([
                'Barcha Premium imkoniyatlar',
                'Cheksiz testlar va darslar',
                'Cheksiz AI maslahatlar',
                'Shaxsiy mentor',
                'Maxsus darslar',
                'Birinchi navbatda qo\'llab-quvvatlash'
            ]),
        ],
    ]);
    }

}
