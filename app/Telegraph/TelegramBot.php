<?php

namespace App\Telegraph;

use DefStudio\Telegraph\Models\TelegraphBot as BaseTelegraphBot;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use DefStudio\Telegraph\Models\TelegraphChat;
use App\Models\User;
use App\Models\Plan;
use App\Models\PlanPurchaseRequest;

class TelegramBot extends BaseTelegraphBot
{
    /**
     * Handle the /start command
     */
    public function handleStart(TelegraphChat $chat): void
    {
        $message = "👋 Assalomu alaykum! Ta'lim tizimimizning Telegram botiga xush kelibsiz!\n\n";
        $message .= "Quyidagi tugmalardan birini tanlang:";

        $keyboard = Keyboard::make()
            ->buttons([
                Button::make('💳 Reja sotib olish')->action('buy_plan'),
                Button::make('👨‍💼 Admin bilan bog\'lanish')->action('connect_admin'),
                Button::make('ℹ️ Mening hisobim')->action('my_account'),
            ]);

        $this->chat($chat->id)->message($message)->keyboard($keyboard)->send();
    }

    /**
     * Handle the buy_plan action
     */
    public function handleBuyPlan(TelegraphChat $chat): void
    {
        $message = "💳 Reja sotib olish:\n\n";
        $message .= "Mavjud rejalar:\n\n";

        // Get available plans
        $plans = Plan::orderBy('price', 'asc')->get();

        if ($plans->isEmpty()) {
            $message .= "Hozirda mavjud reja yo'q.\n";
        } else {
            foreach ($plans as $plan) {
                $message .= "🔹 <b>{$plan->name}</b>\n";
                $message .= "   Narx: " . ($plan->price > 0 ? number_format($plan->price) . " so'm" : "Bepul") . "\n";
                $message .= "   Muddat: {$plan->duration} kun\n";
                $message .= "   /select_{$plan->id} - Tanlash\n\n";
            }
        }

        $keyboard = Keyboard::make()
            ->buttons([
                Button::make('⬅️ Menyuga qaytish')->action('main_menu'),
            ]);

        $this->chat($chat->id)->message($message)->keyboard($keyboard)->send();
    }

    /**
     * Handle plan selection
     */
    public function handleSelectPlan(TelegraphChat $chat, int $planId): void
    {
        $plan = Plan::find($planId);

        if (!$plan) {
            $this->chat($chat->id)->message("❌ Reja topilmadi.")->send();
            return;
        }

        // Try to find user by chat ID
        $user = User::where('telegram_chat_id', $chat->id)->first();

        if (!$user) {
            $message = "⚠️ Hisobingiz hali bog'lanmagan.\n\n";
            $message .= "Veb-saytga kiring va hisobingizni bog'lang:\n";
            $websiteUrl = config('app.url');
            $message .= "<a href='{$websiteUrl}'>Veb-saytga o'tish</a>";

            $this->chat($chat->id)->message($message)->send();
            return;
        }

        // Create plan purchase request
        $planPurchaseRequest = PlanPurchaseRequest::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => 'pending',
            'request_message' => "Foydalanuvchi {$plan->name} rejasini sotib olishni so'radi.",
        ]);

        // Notify admin
        $adminChatId = config('services.telegram.admin_chat_id');
        if ($adminChatId) {
            $adminMessage = "Yangi reja sotib olish so'rovi:\n\n";
            $adminMessage .= "Foydalanuvchi: {$user->name} (ID: {$user->id})\n";
            $adminMessage .= "Email: {$user->email}\n";
            $adminMessage .= "Telegram: {$chat->id}\n";
            $adminMessage .= "Reja: {$plan->name}\n";
            $adminMessage .= "Narx: " . ($plan->price > 0 ? number_format($plan->price) . " so'm" : "Bepul") . "\n";
            $adminMessage .= "Muddat: {$plan->duration} kun\n";
            $adminMessage .= "So'rov ID: {$planPurchaseRequest->id}\n\n";
            
            // Create admin keyboard
            $adminKeyboard = Keyboard::make()
                ->buttons([
                    Button::make('✅ Tasdiqlash')->action("approve_{$planPurchaseRequest->id}"),
                    Button::make('❌ Rad etish')->action("reject_{$planPurchaseRequest->id}"),
                ]);

            $this->chat($adminChatId)->message($adminMessage)->keyboard($adminKeyboard)->send();
        }

        // Confirm to user
        $userMessage = "✅ Sizning so'rovingiz yuborildi!\n\n";
        $userMessage .= "<b>Reja tafsilotlari:</b>\n";
        $userMessage .= "Nomi: {$plan->name}\n";
        $userMessage .= "Narxi: " . ($plan->price > 0 ? number_format($plan->price) . " so'm" : "Bepul") . "\n";
        $userMessage .= "Muddati: {$plan->duration} kun\n";
        $userMessage .= "Testlar: {$plan->assessments_limit}\n";
        $userMessage .= "Darslar: {$plan->lessons_limit}\n";
        $userMessage .= "AI yordami: {$plan->ai_hints_limit}\n\n";
        $userMessage .= "Admin tez orada siz bilan bog'lanadi.";

        $keyboard = Keyboard::make()
            ->buttons([
                Button::make('⬅️ Menyuga qaytish')->action('main_menu'),
            ]);

        $this->chat($chat->id)->message($userMessage)->keyboard($keyboard)->send();
    }

    /**
     * Handle connect admin action
     */
    public function handleConnectAdmin(TelegraphChat $chat): void
    {
        // Try to find user by chat ID
        $user = User::where('telegram_chat_id', $chat->id)->first();

        // Notify admin
        $adminChatId = config('services.telegram.admin_chat_id');
        if ($adminChatId) {
            $message = "👨‍💼 Foydalanuvchi admin bilan bog'lanishni so'radi:\n";
            $message .= "Chat ID: {$chat->id}\n";
            
            if ($user) {
                $message .= "Foydalanuvchi: {$user->name} (ID: {$user->id})\n";
                $message .= "Email: {$user->email}\n";
            }

            // Create admin keyboard
            $adminKeyboard = Keyboard::make()
                ->buttons([
                    Button::make('💬 Javob berish')->action("reply_to_user_{$chat->id}"),
                ]);

            $this->chat($adminChatId)->message($message)->keyboard($adminKeyboard)->send();
        }

        // Confirm to user
        $userMessage = "✅ So'rovingiz yuborildi. Admin siz bilan tez orada bog'lanadi.";
        
        $keyboard = Keyboard::make()
            ->buttons([
                Button::make('⬅️ Menyuga qaytish')->action('main_menu'),
            ]);

        $this->chat($chat->id)->message($userMessage)->keyboard($keyboard)->send();
    }

    /**
     * Handle my account action
     */
    public function handleMyAccount(TelegraphChat $chat): void
    {
        // Try to find user by chat ID
        $user = User::where('telegram_chat_id', $chat->id)->first();

        if ($user) {
            $message = "ℹ️ <b>Mening hisobim</b>:\n\n";
            $message .= "Ism: {$user->name}\n";
            $message .= "Email: {$user->email}\n";
            $message .= "Chat ID: {$chat->id}\n\n";
            
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
            $message = "ℹ️ <b>Mening hisobim</b>:\n\n";
            $message .= "Chat ID: {$chat->id}\n";
            $message .= "Veb-saytda hisobingiz bog'lanmagan.\n\n";
            $message .= "Veb-saytga kiring va hisobingizni bog'lang:\n";
            $websiteUrl = config('app.url');
            $message .= "<a href='{$websiteUrl}'>Veb-saytga o'tish</a>";
        }

        $keyboard = Keyboard::make()
            ->buttons([
                Button::make('⬅️ Menyuga qaytish')->action('main_menu'),
            ]);

        $this->chat($chat->id)->message($message)->keyboard($keyboard)->send();
    }

    /**
     * Handle main menu action
     */
    public function handleMainMenu(TelegraphChat $chat): void
    {
        $this->handleStart($chat);
    }

    /**
     * Handle admin approval
     */
    public function handleApprove(TelegraphChat $chat, int $requestId): void
    {
        $purchaseRequest = PlanPurchaseRequest::find($requestId);

        if (!$purchaseRequest) {
            $this->chat($chat->id)->message("❌ So'rov topilmadi.")->send();
            return;
        }

        // Update the purchase request status
        $purchaseRequest->update([
            'status' => 'approved',
            'admin_response' => 'So\'rovingiz tasdiqlandi',
            'responded_at' => now(),
        ]);

        // Notify user if they have a chat ID
        $user = $purchaseRequest->user;
        if ($user && $user->telegram_chat_id) {
            $userMessage = "✅ Sizning reja sotib olish so'rovingiz tasdiqlandi!\n\n";
            $userMessage .= "Reja: {$purchaseRequest->plan->name}\n";
            $userMessage .= "Xabar: So'rovingiz tasdiqlandi";

            $this->chat($user->telegram_chat_id)->message($userMessage)->send();
        }

        // Confirm to admin
        $adminMessage = "✅ So'rov #{$requestId} tasdiqlandi.\n";
        if ($user) {
            $adminMessage .= "Foydalanuvchi: {$user->name}\n";
        }

        $this->chat($chat->id)->message($adminMessage)->send();
    }

    /**
     * Handle admin rejection
     */
    public function handleReject(TelegraphChat $chat, int $requestId): void
    {
        $purchaseRequest = PlanPurchaseRequest::find($requestId);

        if (!$purchaseRequest) {
            $this->chat($chat->id)->message("❌ So'rov topilmadi.")->send();
            return;
        }

        // Update the purchase request status
        $purchaseRequest->update([
            'status' => 'rejected',
            'admin_response' => 'So\'rovingiz rad etildi',
            'responded_at' => now(),
        ]);

        // Notify user if they have a chat ID
        $user = $purchaseRequest->user;
        if ($user && $user->telegram_chat_id) {
            $userMessage = "❌ Sizning reja sotib olish so'rovingiz rad etildi.\n\n";
            $userMessage .= "Reja: {$purchaseRequest->plan->name}\n";
            $userMessage .= "Xabar: So'rovingiz rad etildi";

            $this->chat($user->telegram_chat_id)->message($userMessage)->send();
        }

        // Confirm to admin
        $adminMessage = "❌ So'rov #{$requestId} rad etildi.\n";
        if ($user) {
            $adminMessage .= "Foydalanuvchi: {$user->name}\n";
        }

        $this->chat($chat->id)->message($adminMessage)->send();
    }
}