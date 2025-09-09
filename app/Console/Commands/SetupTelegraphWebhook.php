<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use DefStudio\Telegraph\Models\TelegraphBot;

class SetupTelegraphWebhook extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegraph:webhook:setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set up the Telegram webhook for Telegraph';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $botToken = config('services.telegram.bot_token');
        
        if (empty($botToken)) {
            $this->error('Telegram bot token is not configured in services.php');
            return 1;
        }
        
        // Create or update the bot
        $bot = TelegraphBot::where('token', $botToken)->first();
        
        if (!$bot) {
            $bot = TelegraphBot::create([
                'token' => $botToken,
                'name' => config('services.telegram.bot_username', 'math_ai_integrator_bot'),
            ]);
            $this->info('Created new Telegraph bot');
        } else {
            $bot->update([
                'name' => config('services.telegram.bot_username', 'math_ai_integrator_bot'),
            ]);
            $this->info('Updated existing Telegraph bot');
        }
        
        // Set up the webhook
        $appUrl = config('app.url');
        $webhookUrl = "{$appUrl}/telegraph/{$botToken}/webhook";
        
        try {
            $response = $bot->registerWebhook($webhookUrl)->send();
            
            if ($response->successful()) {
                $this->info("Webhook successfully set up at: {$webhookUrl}");
                $this->info('Telegram bot is now ready to receive messages!');
                return 0;
            } else {
                $this->error('Failed to set up webhook: ' . $response->body());
                return 1;
            }
        } catch (\Exception $e) {
            $this->error('Error setting up webhook: ' . $e->getMessage());
            return 1;
        }
    }
}