<?php

namespace Database\Factories;

use App\Models\PlanPurchaseRequest;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanPurchaseRequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PlanPurchaseRequest::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'plan_id' => Plan::factory(),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'request_message' => $this->faker->sentence(),
            'admin_response' => $this->faker->optional()->sentence(),
            'responded_at' => $this->faker->optional()->dateTime(),
        ];
    }

    /**
     * Indicate that the request is pending.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function pending()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
                'admin_response' => null,
                'responded_at' => null,
            ];
        });
    }

    /**
     * Indicate that the request is approved.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function approved()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'approved',
                'admin_response' => $this->faker->sentence(),
                'responded_at' => $this->faker->dateTime(),
            ];
        });
    }

    /**
     * Indicate that the request is rejected.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function rejected()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'rejected',
                'admin_response' => $this->faker->sentence(),
                'responded_at' => $this->faker->dateTime(),
            ];
        });
    }
}