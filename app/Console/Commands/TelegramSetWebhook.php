<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Telegram\Bot\Api;
use Telegram\Bot\Exceptions\TelegramSDKException;

class TelegramSetWebhook extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:webhook:set';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set the Telegram webhook for the bot';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            $botToken = config('services.telegram.bot_token');
            
            if (empty($botToken)) {
                $this->error('Telegram bot token is not configured in services.php or .env file');
                return 1;
            }
            
            $appUrl = config('app.url');
            
            if (empty($appUrl)) {
                $this->error('APP_URL is not configured in .env file');
                return 1;
            }
            
            $webhookUrl = rtrim($appUrl, '/') . '/api/telegram/webhook';
            
            $telegram = new Api($botToken);
            $response = $telegram->setWebhook(['url' => $webhookUrl]);
            
            if ($response->getResult()) {
                $this->info('Telegram webhook set successfully!');
                $this->line('Webhook URL: ' . $webhookUrl);
                return 0;
            } else {
                $this->error('Failed to set Telegram webhook: ' . $response->getDescription());
                return 1;
            }
        } catch (TelegramSDKException $e) {
            $this->error('Telegram SDK Error: ' . $e->getMessage());
            return 1;
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return 1;
        }
    }
}