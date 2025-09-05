<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PlanFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Plan::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->words(3, true);
        
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'price' => $this->faker->randomElement([0, 99000, 199000, 299000]),
            'duration' => $this->faker->randomElement([30, 90, 180, 365]),
            'description' => $this->faker->sentence(),
            'features' => $this->faker->randomElements([
                'Unlimited tests',
                'Personal tutor',
                'Progress tracking',
                'AI explanations',
                'Video lessons',
                'Priority support'
            ], $this->faker->numberBetween(2, 5)),
            'assessments_limit' => $this->faker->randomElement([10, 50, 100, 999]),
            'lessons_limit' => $this->faker->randomElement([5, 20, 50, -1]),
            'ai_hints_limit' => $this->faker->randomElement([10, 50, 100, -1]),
            'subjects_limit' => $this->faker->randomElement([3, 5, 10, -1]),
        ];
    }

    /**
     * Indicate that the plan is free.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function free()
    {
        return $this->state(function (array $attributes) {
            return [
                'price' => 0,
                'name' => 'Free Plan',
                'slug' => 'free-plan',
            ];
        });
    }

    /**
     * Indicate that the plan is premium.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function premium()
    {
        return $this->state(function (array $attributes) {
            return [
                'price' => 199000,
                'name' => 'Premium Plan',
                'slug' => 'premium-plan',
            ];
        });
    }
}