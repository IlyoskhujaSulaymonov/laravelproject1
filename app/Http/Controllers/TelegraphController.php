<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DefStudio\Telegraph\Models\TelegraphBot;
use DefStudio\Telegraph\Models\TelegraphChat;
use App\Telegraph\TelegramBot;
use App\Models\Plan;

class TelegraphController extends Controller
{
    /**
     * Handle webhook requests from Telegram
     */
    public function handleWebhook(TelegraphBot $bot, Request $request)
    {
        // Get the message text and chat
        $message = $request->input('message.text', '');
        $chatId = $request->input('message.chat.id');
        
        // Get callback query data if present
        $callbackData = $request->input('callback_query.data');
        $callbackId = $request->input('callback_query.id');
        
        // Acknowledge callback queries
        if ($callbackId) {
            $bot->replyWebhook($callbackId, '')->send();
        }
        
        // Handle callback queries
        if ($callbackData) {
            $this->handleCallbackQuery($bot, $callbackData, $chatId);
            return response()->json(['status' => 'ok']);
        }
        
        // Handle commands
        if (str_starts_with($message, '/')) {
            $this->handleCommand($bot, $message, $chatId);
            return response()->json(['status' => 'ok']);
        }
        
        // Handle regular messages
        $this->handleMessage($bot, $message, $chatId);
        
        return response()->json(['status' => 'ok']);
    }
    
    /**
     * Handle commands
     */
    private function handleCommand(TelegraphBot $bot, string $message, int $chatId)
    {
        $chat = TelegraphChat::firstOrCreate(['chat_id' => $chatId]);
        
        // Extract command and parameters
        $parts = explode(' ', $message);
        $command = substr($parts[0], 1); // Remove the / prefix
        $params = array_slice($parts, 1);
        
        switch ($command) {
            case 'start':
                $bot->handleStart($chat);
                break;
                
            case 'select':
                if (isset($params[0]) && is_numeric($params[0])) {
                    $bot->handleSelectPlan($chat, (int)$params[0]);
                } else {
                    $bot->chat($chatId)->message("Iltimos, reja tanlash uchun /select_{plan_id} formatidan foydaling.")->send();
                }
                break;
                
            case 'select_' . (is_numeric(substr($command, 7)) ? substr($command, 7) : ''):
                $planId = (int)substr($command, 7);
                if ($planId > 0) {
                    $bot->handleSelectPlan($chat, $planId);
                }
                break;
                
            default:
                $bot->chat($chatId)->message("❌ Noma'lum buyruq. Yordam uchun /start tugmasini bosing.")->send();
        }
    }
    
    /**
     * Handle callback queries
     */
    private function handleCallbackQuery(TelegraphBot $bot, string $callbackData, int $chatId)
    {
        $chat = TelegraphChat::firstOrCreate(['chat_id' => $chatId]);
        
        // Parse callback data
        if ($callbackData === 'buy_plan') {
            $bot->handleBuyPlan($chat);
        } elseif ($callbackData === 'connect_admin') {
            $bot->handleConnectAdmin($chat);
        } elseif ($callbackData === 'my_account') {
            $bot->handleMyAccount($chat);
        } elseif ($callbackData === 'main_menu') {
            $bot->handleMainMenu($chat);
        } elseif (str_starts_with($callbackData, 'approve_')) {
            $requestId = (int)substr($callbackData, 8);
            if ($requestId > 0) {
                $bot->handleApprove($chat, $requestId);
            }
        } elseif (str_starts_with($callbackData, 'reject_')) {
            $requestId = (int)substr($callbackData, 7);
            if ($requestId > 0) {
                $bot->handleReject($chat, $requestId);
            }
        } elseif (str_starts_with($callbackData, 'select_')) {
            $planId = (int)substr($callbackData, 7);
            if ($planId > 0) {
                $bot->handleSelectPlan($chat, $planId);
            }
        } elseif (str_starts_with($callbackData, 'reply_to_user_')) {
            $userChatId = substr($callbackData, 14);
            if ($userChatId) {
                // In a real implementation, you would prompt the admin for a message
                // and then send it to the user
                $bot->chat($chatId)->message("Iltimos, foydalanuvchiga javobingizni yozing:")->send();
            }
        }
    }
    
    /**
     * Handle regular messages
     */
    private function handleMessage(TelegraphBot $bot, string $message, int $chatId)
    {
        $chat = TelegraphChat::firstOrCreate(['chat_id' => $chatId]);
        
        // For regular messages, show the main menu
        $bot->handleStart($chat);
    }
    
    /**
     * Handle plan selection via inline button
     */
    public function handlePlanSelection(TelegraphBot $bot, int $planId, Request $request)
    {
        $chatId = $request->input('callback_query.message.chat.id');
        if (!$chatId) {
            $chatId = $request->input('message.chat.id');
        }
        
        if ($chatId) {
            $chat = TelegraphChat::firstOrCreate(['chat_id' => $chatId]);
            $bot->handleSelectPlan($chat, $planId);
        }
        
        return response()->json(['status' => 'ok']);
    }
}