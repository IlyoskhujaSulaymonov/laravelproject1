<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TelegramService;
use App\Models\PlanPurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TelegramController extends Controller
{
    protected $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Connect user's Telegram account automatically
     */
    public function connectTelegramAccount(Request $request)
    {
        try {
            $user = Auth::user();
            
            // If chat ID is provided in request, use it
            if ($request->has('telegram_chat_id')) {
                $user->telegram_chat_id = $request->telegram_chat_id;
                $user->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Telegram hisobingiz bog\'landi!',
                ]);
            }
            
            // Otherwise, we'll handle it through the bot interaction
            return response()->json([
                'success' => true,
                'message' => 'Telegram hisobingiz avtomatik ravishda bog\'lanadi.',
            ]);
        } catch (\Exception $e) {
            Log::error('Telegram account connection error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Telegram hisobingizni bog\'lashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.',
            ], 500);
        }
    }

    /**
     * Handle plan purchase request via Telegram
     */
    public function requestPlanPurchase(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'phone' => 'nullable|string|max:20',
            'telegram_username' => 'nullable|string|max:50',
        ]);

        try {
            $user = Auth::user();
            $plan = \App\Models\Plan::findOrFail($request->plan_id);

            // Create plan purchase request record
            $planPurchaseRequest = PlanPurchaseRequest::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'status' => 'pending',
                'message' => "Foydalanuvchi {$plan->name} rejasini sotib olishni so'radi.",
                'phone' => $request->phone,
                'telegram_username' => $request->telegram_username,
            ]);

            // Send message to admin via Telegram
            $message = "Yangi reja sotib olish so'rovi:\n\n";
            $message .= "Foydalanuvchi: {$user->name} (ID: {$user->id})\n";
            $message .= "Email: {$user->email}\n";
            if ($user->telegram_chat_id) {
                $message .= "Telegram: {$user->telegram_chat_id}\n";
            }
            if ($request->phone) {
                $message .= "Telefon: {$request->phone}\n";
            }
            if ($request->telegram_username) {
                $message .= "Telegram username: @{$request->telegram_username}\n";
            }
            $message .= "Reja: {$plan->name}\n";
            $message .= "Narx: " . ($plan->price > 0 ? number_format($plan->price) . " so'm" : "Bepul") . "\n";
            $message .= "Muddat: {$plan->duration} kun\n";
            $message .= "So'rov ID: {$planPurchaseRequest->id}\n\n";
            $message .= "Foydalanuvchiga javob berish uchun quyidagi tugmalardan foydalaning:";

            $this->telegramService->sendPlanPurchaseRequestToAdmin($message, $planPurchaseRequest->id);

            return response()->json([
                'success' => true,
                'message' => 'So\'rovingiz yuborildi. Admin tez orada siz bilan bog\'lanadi.',
                'request_id' => $planPurchaseRequest->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Plan purchase request error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'So\'rovni yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.',
            ], 500);
        }
    }

    /**
     * Handle Telegram webhook for admin responses
     */
    public function handleWebhook(Request $request)
    {
        try {
            $update = $request->all();
            
            // Process the update with TelegramService
            $this->telegramService->handleWebhook($update);
            
            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('Telegram webhook error: ' . $e->getMessage());
            return response()->json(['status' => 'error'], 500);
        }
    }
    
    /**
     * Handle deep link from Telegram bot to automatically connect account
     */
    public function handleTelegramDeepLink(Request $request)
    {
        $chatId = $request->query('chat_id');
        
        if (!$chatId) {
            return response()->json(['success' => false, 'message' => 'Chat ID required'], 400);
        }
        
        try {
            $user = Auth::user();
            
            if ($user) {
                // Connect the Telegram account
                $user->telegram_chat_id = $chatId;
                $user->save();
                
                // Send confirmation to Telegram
                $this->telegramService->sendDirectMessageToUser($chatId, "✅ Hisobingiz muvaffaqiyatli bog'landi!");
                
                return response()->json([
                    'success' => true,
                    'message' => 'Telegram hisobingiz bog\'landi!',
                ]);
            } else {
                return response()->json(['success' => false, 'message' => 'Foydalanuvchi topilmadi'], 404);
            }
        } catch (\Exception $e) {
            Log::error('Telegram deep link error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Telegram hisobingizni bog\'lashda xatolik yuz berdi.',
            ], 500);
        }
    }
}