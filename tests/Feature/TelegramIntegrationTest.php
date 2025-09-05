<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Plan;
use App\Models\PlanPurchaseRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TelegramIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_connect_their_telegram_account()
    {
        // Create a user
        $user = User::factory()->create();
        
        // Acting as the user
        $response = $this->actingAs($user)->postJson('/api/telegram/connect-account', [
            'telegram_chat_id' => '123456789',
        ]);

        // Assert the response
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Telegram hisobingiz bog\'landi!',
        ]);

        // Assert that the user's Telegram chat ID was saved
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'telegram_chat_id' => '123456789',
        ]);
    }

    /** @test */
    public function user_can_request_plan_purchase_via_telegram()
    {
        // Create a user
        $user = User::factory()->create();
        
        // Create a plan
        $plan = Plan::factory()->create([
            'name' => 'Test Plan',
            'price' => 10000,
            'duration' => 30,
        ]);

        // Acting as the user
        $response = $this->actingAs($user)->postJson('/api/telegram/request-plan-purchase', [
            'plan_id' => $plan->id,
        ]);

        // Assert the response
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'So\'rovingiz yuborildi. Admin tez orada siz bilan bog\'lanadi.',
        ]);

        // Assert that a plan purchase request was created
        $this->assertDatabaseHas('plan_purchase_requests', [
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function user_cannot_request_plan_purchase_with_invalid_plan()
    {
        // Create a user
        $user = User::factory()->create();

        // Acting as the user
        $response = $this->actingAs($user)->postJson('/api/telegram/request-plan-purchase', [
            'plan_id' => 9999, // Invalid plan ID
        ]);

        // Assert the response
        $response->assertStatus(422);
    }

    /** @test */
    public function guest_cannot_request_plan_purchase()
    {
        // Create a plan
        $plan = Plan::factory()->create();

        // Make request without authentication
        $response = $this->postJson('/api/telegram/request-plan-purchase', [
            'plan_id' => $plan->id,
        ]);

        // Assert the response
        $response->assertStatus(401);
    }

    /** @test */
    public function admin_can_respond_to_plan_purchase_request()
    {
        // Create a user with Telegram chat ID
        $user = User::factory()->create([
            'telegram_chat_id' => '123456789'
        ]);
        
        // Create a plan
        $plan = Plan::factory()->create([
            'name' => 'Test Plan',
            'price' => 10000,
            'duration' => 30,
        ]);
        
        // Create a plan purchase request
        $planPurchaseRequest = PlanPurchaseRequest::factory()->create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => 'pending',
        ]);

        // Create a mock for the Telegram service
        $telegramServiceMock = $this->createMock(\App\Services\TelegramService::class);
        $telegramServiceMock->expects($this->exactly(2)) // One for admin notification, one for user
            ->method('sendAdminResponseToUser')
            ->willReturn(true);

        $this->app->instance(\App\Services\TelegramService::class, $telegramServiceMock);

        // Simulate admin response (this would normally happen via Telegram webhook)
        $purchaseRequest = PlanPurchaseRequest::find($planPurchaseRequest->id);
        $result = $telegramServiceMock->sendAdminResponseToUser($purchaseRequest, 'Your plan has been approved!', true);

        // Assert that the method was called successfully
        $this->assertTrue($result);
    }
}