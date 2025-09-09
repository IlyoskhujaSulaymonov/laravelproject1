<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Plan;
use App\Models\PlanPurchaseRequest;
use DefStudio\Telegraph\Models\TelegraphBot;
use DefStudio\Telegraph\Models\TelegraphChat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TelegraphIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function telegraph_bot_can_be_created()
    {
        // Create a bot
        $bot = TelegraphBot::create([
            'token' => 'test_token',
            'name' => 'test_bot',
        ]);

        // Assert the bot was created
        $this->assertDatabaseHas('telegraph_bots', [
            'token' => 'test_token',
            'name' => 'test_bot',
        ]);
    }

    /** @test */
    public function telegraph_chat_can_be_created()
    {
        // Create a chat
        $chat = TelegraphChat::create([
            'chat_id' => 123456789,
        ]);

        // Assert the chat was created
        $this->assertDatabaseHas('telegraph_chats', [
            'chat_id' => 123456789,
        ]);
    }

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

        // Acting as the user
        $response = $this->actingAs($user)->postJson('/api/telegram/request-plan-purchase', [
            'plan_id' => $plan->id,
        ]);

        // Assert the response
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        // Assert that a plan purchase request was created
        $this->assertDatabaseHas('plan_purchase_requests', [
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function telegraph_webhook_route_exists()
    {
        // Create a bot
        $bot = TelegraphBot::create([
            'token' => 'test_token',
            'name' => 'test_bot',
        ]);
        
        // Test the webhook route
        $response = $this->post("/telegraph/{$bot->token}/webhook", [
            'message' => [
                'text' => '/start',
                'chat' => [
                    'id' => 123456789,
                ],
            ],
        ]);

        // Assert the response
        $response->assertStatus(200);
    }
}