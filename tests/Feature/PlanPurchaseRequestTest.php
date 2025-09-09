<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\PlanPurchaseRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanPurchaseRequestTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_store_phone_and_telegram_username_with_plan_purchase_request()
    {
        // Create a user and plan
        $user = User::factory()->create();
        $plan = Plan::factory()->create();

        // Authenticate the user
        $this->actingAs($user);

        // Make a request to create a plan purchase request with contact info
        $response = $this->postJson('/api/telegram/request-plan-purchase', [
            'plan_id' => $plan->id,
            'phone' => '+998901234567',
            'telegram_username' => 'testuser',
        ]);

        // Assert the response
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // Assert the plan purchase request was created with contact info
        $this->assertDatabaseHas('plan_purchase_requests', [
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'phone' => '+998901234567',
            'telegram_username' => 'testuser',
        ]);
    }

    /** @test */
    public function it_can_store_plan_purchase_request_without_contact_info()
    {
        // Create a user and plan
        $user = User::factory()->create();
        $plan = Plan::factory()->create();

        // Authenticate the user
        $this->actingAs($user);

        // Make a request to create a plan purchase request without contact info
        $response = $this->postJson('/api/telegram/request-plan-purchase', [
            'plan_id' => $plan->id,
        ]);

        // Assert the response
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // Assert the plan purchase request was created without contact info
        $planPurchaseRequest = PlanPurchaseRequest::where('user_id', $user->id)
            ->where('plan_id', $plan->id)
            ->first();

        $this->assertNotNull($planPurchaseRequest);
        $this->assertNull($planPurchaseRequest->phone);
        $this->assertNull($planPurchaseRequest->telegram_username);
    }
}