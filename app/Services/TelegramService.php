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
     * Send welcome message with buttons to the user
     *
     * @param string $chatId
     * @return bool
     */
    public function sendWelcomeMessageWithButtons(string $chatId): bool
    {
        try {
            $message = "👋 Assalomu alaykum! Ta'lim tizimimizning Telegram botiga xush kelibsiz!\n\n";
            $message .= "Quyidagi tugmalardan birini tanlang:";

            $this->telegram->sendMessage([
                'chat_id' => $chatId,
                'text' => $message,
                'reply_markup' => $this->createWelcomeKeyboard(),
            ]);

            return true;
        } catch (TelegramSDKException $e) {
            Log::error('Telegram SDK Error: ' . $e->getMessage());
            return false;
        } catch (\Exception $e) {
            Log::error('Error sending welcome message: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Create welcome keyboard with buttons
     *
     * @return array
     */
    private function createWelcomeKeyboard(): array
    {
        return [
            'inline_keyboard' => [
                [
                    ['text' => '💳 Reja sotib olish', 'callback_data' => 'buy_plan'],
                ],
                [
                    ['text' => '👨‍💼 Admin bilan bog\'lanish', 'callback_data' => 'connect_admin'],
                ],
                [
                    ['text' => 'ℹ️ Mening hisobim', 'callback_data' => 'my_account'],
                ],
            ]
        ];
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
                
                // Handle the /start command to capture chat ID and show buttons
                if ($text === '/start') {
                    // Save chat ID to user session or database if user is logged in
                    // For now, just send welcome message with buttons
                    $this->sendWelcomeMessageWithButtons($chatId);
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
                    // For regular users, show the welcome message with buttons
                    $this->sendWelcomeMessageWithButtons($chatId);
                }
            }
            
            // Handle callback queries (button presses)
            elseif (isset($update['callback_query'])) {
                $callbackData = $update['callback_query']['data'] ?? '';
                $chatId = $update['callback_query']['from']['id'] ?? '';
                $messageId = $update['callback_query']['message']['message_id'] ?? '';
                
                // Acknowledge the button press
                $this->telegram->answerCallbackQuery([
                    'callback_query_id' => $update['callback_query']['id'],
                ]);
                
                // Handle different button presses
                switch ($callbackData) {
                    case 'buy_plan':
                        $this->handleBuyPlanButton($chatId);
                        break;
                        
                    case 'connect_admin':
                        $this->handleConnectAdminButton($chatId);
                        break;
                        
                    case 'my_account':
                        $this->handleMyAccountButton($chatId);
                        break;
                        
                    case 'main_menu':
                        $this->sendWelcomeMessageWithButtons($chatId);
                        break;
                        
                    // Handle admin approval/rejection buttons
                    case (preg_match('/^(approve|reject)_(\d+)$/', $callbackData) ? true : false):
                        if ($chatId == config('services.telegram.admin_chat_id')) {
                            preg_match('/^(approve|reject)_(\d+)$/', $callbackData, $matches);
                            $action = $matches[1];
                            $requestId = (int)$matches[2];
                            
                            // Store the pending action in the session or database
                            // For simplicity, we'll ask the admin to respond with a specific format
                            $actionText = $action === 'approve' ? 'approve' : 'reject';
                            $this->telegram->sendMessage([
                                'chat_id' => $chatId,
                                'text' => "Please respond with the following format to {$actionText} request #{$requestId}:\n\n"
                                        . "/respond_{$requestId} [approved/rejected] [your message here]\n\n"
                                        . "Example: /respond_{$requestId} approved Here is your approval message",
                            ]);
                        }
                        break;
                        
                    // Handle admin reply to user
                    case (preg_match('/^reply_to_user_(.+)$/', $callbackData) ? true : false):
                        if ($chatId == config('services.telegram.admin_chat_id')) {
                            preg_match('/^reply_to_user_(.+)$/', $callbackData, $matches);
                            $userChatId = $matches[1];
                            
                            // Ask admin for reply message
                            $this->telegram->sendMessage([
                                'chat_id' => $chatId,
                                'text' => "Iltimos, foydalanuvchiga javobingizni yozing:",
                            ]);
                            
                            // Store the user chat ID in session or database for the next message
                            // This is a simplified implementation
                        }
                        break;
                }
            }
        } catch (\Exception $e) {
            Log::error('Error handling Telegram webhook: ' . $e->getMessage(), $update);
        }
    }

    /**
     * Handle Buy Plan button press
     *
     * @param string $chatId
     * @return void
     */
    private function handleBuyPlanButton(string $chatId): void
    {
        try {
            // Create a deep link for automatic account connection
            $websiteUrl = config('app.url');
            $deepLink = "{$websiteUrl}/api/telegram/connect-via-bot?chat_id={$chatId}";
            
            $message = "💳 Reja sotib olish:\n\n";
            $message .= "1. Quyidagi tugmani bosing, hisobingiz avtomatik ravishda bog'lanadi:\n";
            $message .= "[👉 Hisobni bog'lash]({$deepLink})\n\n";
            $message .= "2. Veb-saytga kiring va reja tanlang\n";
            $message .= "3. Sotib olish so'rovini yuboring\n";
            $message .= "4. Admin siz bilan bog'lanadi";
            
            $this->telegram->sendMessage([
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'Markdown',
                'reply_markup' => $this->createBackToMenuKeyboard(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling Buy Plan button: ' . $e->getMessage());
        }
    }

    /**
     * Handle Connect Admin button press
     *
     * @param string $chatId
     * @return void
     */
    private function handleConnectAdminButton(string $chatId): void
    {
        try {
            // Notify admin about user request to connect
            $adminChatId = config('services.telegram.admin_chat_id');
            if ($adminChatId) {
                $userInfo = $this->getUserInfoFromChatId($chatId);
                $message = "👨‍💼 Foydalanuvchi admin bilan bog'lanishni so'radi:\n";
                $message .= "Chat ID: {$chatId}\n";
                if ($userInfo) {
                    $message .= "Ism: {$userInfo['first_name']}\n";
                    if (!empty($userInfo['last_name'])) {
                        $message .= "Familiya: {$userInfo['last_name']}\n";
                    }
                    if (!empty($userInfo['username'])) {
                        $message .= "Username: @{$userInfo['username']}\n";
                    }
                }
                
                // Send message to admin with option to connect
                $this->telegram->sendMessage([
                    'chat_id' => $adminChatId,
                    'text' => $message,
                    'reply_markup' => [
                        'inline_keyboard' => [
                            [
                                ['text' => '💬 Javob berish', 'callback_data' => "reply_to_user_{$chatId}"],
                            ]
                        ]
                    ]
                ]);
            }
            
            // Send confirmation to user
            $this->telegram->sendMessage([
                'chat_id' => $chatId,
                'text' => "✅ So'rovingiz yuborildi. Admin siz bilan tez orada bog'lanadi.",
                'reply_markup' => $this->createBackToMenuKeyboard(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling Connect Admin button: ' . $e->getMessage());
        }
    }

    /**
     * Handle My Account button press
     *
     * @param string $chatId
     * @return void
     */
    private function handleMyAccountButton(string $chatId): void
    {
        try {
            // Try to find user by chat ID
            $user = User::where('telegram_chat_id', $chatId)->first();
            
            if ($user) {
                $message = "ℹ️ Mening hisobim:\n\n";
                $message .= "Ism: {$user->name}\n";
                $message .= "Email: {$user->email}\n";
                $message .= "Chat ID: {$chatId}\n\n";
                
                // Add current plan information if available
                $currentPlan = $user->currentPlan;
                if ($currentPlan && $currentPlan->plan) {
                    $message .= "Joriy reja: {$currentPlan->plan->name}\n";
                    if ($currentPlan->ends_at) {
                        $message .= "Tugash sanasi: " . $currentPlan->ends_at->format('Y-m-d') . "\n";
                    }
                } else {
                    $message .= "Hozirda faol reja yo'q\n";
                }
            } else {
                // Create a deep link for automatic account connection
                $websiteUrl = config('app.url');
                $deepLink = "{$websiteUrl}/api/telegram/connect-via-bot?chat_id={$chatId}";
                
                $message = "ℹ️ Mening hisobim:\n\n";
                $message .= "Chat ID: {$chatId}\n";
                $message .= "Veb-saytda hisobingiz bog'lanmagan.\n\n";
                $message .= "[👉 Hisobni bog'lash]({$deepLink})";
            }
            
            $this->telegram->sendMessage([
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'Markdown',
                'reply_markup' => $this->createBackToMenuKeyboard(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling My Account button: ' . $e->getMessage());
        }
    }

    /**
     * Create back to menu keyboard
     *
     * @return array
     */
    private function createBackToMenuKeyboard(): array
    {
        return [
            'inline_keyboard' => [
                [
                    ['text' => '⬅️ Menyuga qaytish', 'callback_data' => 'main_menu'],
                ]
            ]
        ];
    }

    /**
     * Get user info from chat ID (simplified implementation)
     *
     * @param string $chatId
     * @return array|null
     */
    private function getUserInfoFromChatId(string $chatId): ?array
    {
        // In a real implementation, you might want to store this information
        // in a database when the user first interacts with the bot
        return null;
    }
}