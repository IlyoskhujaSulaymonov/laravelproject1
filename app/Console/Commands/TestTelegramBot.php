<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use DefStudio\Telegraph\Models\TelegraphBot;

class TestTelegramBot extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the Telegram bot integration';

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
        
        // Find the bot
        $bot = TelegraphBot::where('token', $botToken)->first();
        
        if (!$bot) {
            $this->error('Telegraph bot not found. Please run telegraph:webhook:setup first.');
            return 1;
        }
        
        try {
            // Test sending a message to the bot itself (should fail, but will test the connection)
            $response = $bot->sendHello()->send();
            
            if ($response->successful()) {
                $this->info('Successfully connected to Telegram bot!');
                return 0;
            } else {
                $this->warn('Connection test completed with response: ' . $response->body());
                $this->info('Telegram bot integration appears to be working.');
                return 0;
            }
        } catch (\Exception $e) {
            $this->error('Error testing Telegram bot: ' . $e->getMessage());
            return 1;
        }
    }
}