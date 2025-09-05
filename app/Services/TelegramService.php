<?php

namespace App\Services;

use Telegram\Bot\Api;
use Telegram\Bot\Exceptions\TelegramSDKException;
use App\Models\PlanPurchaseRequest;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    protected $telegram;

    public function __construct()
    {
        $this->telegram = new Api(config('services.telegram.bot_token'));
    }

    /**
     * Send a plan purchase request to the admin
     *
     * @param string $message
     * @param int $requestId
     * @return bool
     */
    public function sendPlanPurchaseRequestToAdmin(string $message, int $requestId): bool
    {
        try {
            $adminChatId = config('services.telegram.admin_chat_id');
            
            if (!$adminChatId) {
                Log::warning('Telegram admin chat ID not configured');
                return false;
            }

            // Send message to admin with inline buttons for approval/rejection
            $this->telegram->sendMessage([
                'chat_id' => $adminChatId,
                'text' => $message,
                'parse_mode' => 'Markdown',
                'reply_markup' => $this->createAdminReplyMarkup($requestId),
            ]);

            return true;
        } catch (TelegramSDKException $e) {
            Log::error('Telegram SDK Error: ' . $e->getMessage());
            return false;
        } catch (\Exception $e) {
            Log::error('Error sending plan purchase request to admin: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send a response to the user from admin
     *
     * @param PlanPurchaseRequest $purchaseRequest
     * @param string $adminResponse
     * @param bool $approved
     * @return bool
     */
    public function sendAdminResponseToUser(PlanPurchaseRequest $purchaseRequest, string $adminResponse, bool $approved = false): bool
    {
        try {
            // Update the purchase request status
            $purchaseRequest->update([
                'status' => $approved ? 'approved' : 'rejected',
                'admin_response' => $adminResponse,
                'responded_at' => now(),
            ]);

            // Get user information
            $user = $purchaseRequest->user;
            
            // Notify admin that response was processed
            $adminChatId = config('services.telegram.admin_chat_id');
            if ($adminChatId) {
                $responseMessage = $approved ? "✅ Plan purchase request approved!\n\n" : "❌ Plan purchase request rejected.\n\n";
                $responseMessage .= "User: {$user->name}\n";
                $responseMessage .= "Response: {$adminResponse}";
                
                $this->telegram->sendMessage([
                    'chat_id' => $adminChatId,
                    'text' => $responseMessage,
                ]);
            }

            // Send message to user if they have connected their Telegram account
            if ($user->telegram_chat_id) {
                $userMessage = $approved ? "✅ Sizning reja sotib olish so'rovingiz tasdiqlandi!\n\n" : "❌ Sizning reja sotib olish so'rovingiz rad etildi.\n\n";
                $userMessage .= "Xabar: {$adminResponse}";
                
                $this->telegram->sendMessage([
                    'chat_id' => $user->telegram_chat_id,
                    'text' => $userMessage,
                ]);
            }

            Log::info("Admin response sent for plan purchase request #{$purchaseRequest->id}");

            return true;
        } catch (TelegramSDKException $e) {
            Log::error('Telegram SDK Error: ' . $e->getMessage());
            return false;
        } catch (\Exception $e) {
            Log::error('Error sending admin response to user: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send a direct message to a user
     *
     * @param string $chatId
     * @param string $message
     * @return bool
     */
    public function sendDirectMessageToUser(string $chatId, string $message): bool
    {
        try {
            $this->telegram->sendMessage([
                'chat_id' => $chatId,
                'text' => $message,
            ]);

            return true;
        } catch (TelegramSDKException $e) {
            Log::error('Telegram SDK Error: ' . $e->getMessage());
            return false;
        } catch (\Exception $e) {
            Log::error('Error sending direct message to user: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Create reply markup for admin responses
     *
     * @param int $requestId
     * @return array
     */
    private function createAdminReplyMarkup(int $requestId): array
    {
        return [
            'inline_keyboard' => [
                [
                    ['text' => '✅ Approve', 'callback_data' => "approve_{$requestId}"],
                    ['text' => '❌ Reject', 'callback_data' => "reject_{$requestId}"],
                ]
            ]
        ];
    }

    /**
     * Handle incoming webhook updates from Telegram
     *
     * @param array $update
     * @return void
     */
    public function handleWebhook(array $update): void
    {
        try {
            // Handle user messages
            if (isset($update['message'])) {
                $chatId = $update['message']['from']['id'] ?? '';
                $text = $update['message']['text'] ?? '';
                $username = $update['message']['from']['username'] ?? '';
                $firstName = $update['message']['from']['first_name'] ?? '';
                $lastName = $update['message']['from']['last_name'] ?? '';
                
                // Handle the /start command to capture chat ID
                if ($text === '/start') {
                    // Send welcome message with chat ID
                    $welcomeMessage = "👋 Assalomu alaykum! Sizning Telegram chat ID: `{$chatId}`\n\n";
                    $welcomeMessage .= "Bu ID ni saqlab qo'ying, chunki u sizning hisobingizni tizim bilan bog'lash uchun kerak bo'ladi.\n\n";
                    $welcomeMessage .= "Keyingi qadam sifatida quyidagilardan birini bajaring:\n";
                    $welcomeMessage .= "1. Saytga kiring va 'Reja sotib olish' tugmasini bosing\n";
                    $welcomeMessage .= "2. So'rov yuborilgandan so'ng, sizga ushbu chat ID avtomatik tarzda bog'lanadi";
                    
                    $this->telegram->sendMessage([
                        'chat_id' => $chatId,
                        'text' => $welcomeMessage,
                        'parse_mode' => 'Markdown',
                    ]);
                    
                    return;
                }
                
                // Handle admin responses with the /respond_{id} format
                if ($chatId == config('services.telegram.admin_chat_id')) {
                    // Check if this is a response command
                    if (preg_match('/^\/respond_(\d+)\s+(approved|rejected)\s+(.+)$/i', $text, $matches)) {
                        $requestId = (int)$matches[1];
                        $status = strtolower($matches[2]);
                        $responseMessage = $matches[3];
                        $approved = $status === 'approved';
                        
                        // Get the purchase request
                        $purchaseRequest = PlanPurchaseRequest::find($requestId);
                        
                        if (!$purchaseRequest) {
                            $this->telegram->sendMessage([
                                'chat_id' => $chatId,
                                'text' => "❌ Request #{$requestId} not found.",
                            ]);
                            return;
                        }
                        
                        // Process the response
                        if ($this->sendAdminResponseToUser($purchaseRequest, $responseMessage, $approved)) {
                            $statusText = $approved ? 'approved' : 'rejected';
                            $this->telegram->sendMessage([
                                'chat_id' => $chatId,
                                'text' => "✅ Request #{$requestId} has been {$statusText}.\n\n"
                                        . "Message sent to user: {$responseMessage}",
                            ]);
                        } else {
                            $this->telegram->sendMessage([
                                'chat_id' => $chatId,
                                'text' => "❌ Failed to process response for request #{$requestId}.",
                            ]);
                        }
                    } else {
                        // Provide help information
                        $this->telegram->sendMessage([
                            'chat_id' => $chatId,
                            'text' => "I can help you process plan purchase requests.\n\n"
                                    . "To respond to a request, use the format:\n"
                                    . "/respond_{request_id} [approved/rejected] [your message]\n\n"
                                    . "Example: /respond_123 approved Thank you for your purchase! Your plan is now active.",
                        ]);
                    }
                }
                // Handle regular user messages
                else {
                    // For regular users, provide information
                    $this->telegram->sendMessage([
                        'chat_id' => $chatId,
                        'text' => "👋 Hello! This bot is for processing plan purchase requests.\n\n"
                                . "To get started:\n"
                                . "1. Your chat ID is: `{$chatId}` (save this!)\n"
                                . "2. Visit our website and select a plan\n"
                                . "3. When prompted, this chat ID will be automatically linked to your account",
                        'parse_mode' => 'Markdown',
                    ]);
                }
            }
            
            // Check if this is a callback query (button press)
            elseif (isset($update['callback_query'])) {
                $callbackData = $update['callback_query']['data'] ?? '';
                $adminChatId = $update['callback_query']['from']['id'] ?? '';
                $chatId = $update['callback_query']['message']['chat']['id'] ?? '';
                
                // Verify this is from the admin
                if ($adminChatId != config('services.telegram.admin_chat_id')) {
                    Log::warning('Unauthorized callback query received', $update);
                    return;
                }

                // Parse the callback data
                if (preg_match('/^(approve|reject)_(\d+)$/', $callbackData, $matches)) {
                    $action = $matches[1];
                    $requestId = (int)$matches[2];
                    
                    // Store the pending action in the session or database
                    // For simplicity, we'll ask the admin to respond with a specific format
                    $actionText = $action === 'approve' ? 'approve' : 'reject';
                    $this->telegram->sendMessage([
                        'chat_id' => $adminChatId,
                        'text' => "Please respond with the following format to {$actionText} request #{$requestId}:\n\n"
                                . "/respond_{$requestId} [approved/rejected] [your message here]\n\n"
                                . "Example: /respond_{$requestId} approved Here is your approval message",
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Error handling Telegram webhook: ' . $e->getMessage(), $update);
        }
    }
}