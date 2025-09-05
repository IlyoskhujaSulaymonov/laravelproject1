# Telegram Integration Setup Guide

This document explains how to set up and configure the Telegram integration for plan purchases in the education system.

## Overview

The Telegram integration allows users to request plan purchases through the website, which are then sent to an admin via Telegram. Admins can respond to these requests directly through Telegram, and the responses are processed by the system.

## Components

1. **TelegramService** - Handles communication with the Telegram Bot API
2. **PlanPurchaseRequest Model** - Tracks user requests
3. **API Endpoints** - Handle requests from the frontend
4. **Admin Interface** - Web interface for managing requests
5. **Frontend Integration** - Updated landing page and dashboard components

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat with BotFather
3. Send `/newbot` command
4. Follow the instructions to create a new bot
5. Copy the **bot token** that BotFather provides
6. Note the **bot username** that BotFather provides (without @)

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=math_ai_integrator_bot
TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id
```

Replace:
- `your_bot_token_here` with the token from BotFather
- `TELEGRAM_BOT_USERNAME` is already set to your bot's username: `math_ai_integrator_bot`
- `your_admin_chat_id` with your Telegram user ID (instructions below)

### 3. Get Your Telegram Chat ID

1. Start a chat with your bot (@math_ai_integrator_bot)
2. Send any message to the bot
3. Visit this URL in your browser (replace `BOT_TOKEN` with your actual token):
   ```
   https://api.telegram.org/bot[BOT_TOKEN]/getUpdates
   ```
4. Look for your `chat.id` in the response - this is your admin chat ID

### 4. Set Up Webhook (Optional but Recommended)

To receive messages from Telegram in real-time, set up a webhook:

```bash
php artisan telegram:webhook:set
```

Or manually:
```
https://api.telegram.org/bot[BOT_TOKEN]/setWebhook?url=[YOUR_DOMAIN]/api/telegram/webhook
```

### 5. Run Database Migrations

Make sure to run the migrations to create the plan_purchase_requests table:

```bash
php artisan migrate
```

## How It Works

### For Users:
1. User selects a plan on the landing page or dashboard
2. User clicks "Select Plan" 
3. If user hasn't connected their Telegram account, they are prompted to go to the Telegram bot (@math_ai_integrator_bot)
4. User sends `/start` to the bot and gets their chat ID
5. User enters chat ID on the website
6. System creates a plan purchase request and sends it to the admin via Telegram
7. User receives confirmation that their request has been sent

### For Admins:
1. Admin receives a message in Telegram with plan details
2. Admin can approve or reject the request using inline buttons
3. Admin responds with a message explaining the decision
4. System updates the request status and logs the response
5. User receives a direct message on Telegram with the admin's response

## Testing the Integration

1. Ensure all environment variables are set correctly
2. Run the database migrations
3. Visit the landing page and select a plan
4. Follow the prompts to connect your Telegram account
5. Check that a message is received in Telegram
6. Respond to the request via Telegram
7. Verify that the request status is updated in the admin panel
8. Verify that the user receives a direct message on Telegram

## Troubleshooting

### Common Issues:

1. **Messages not received in Telegram:**
   - Check that the bot token is correct
   - Verify the admin chat ID
   - Ensure the webhook is set up correctly

2. **Webhook not working:**
   - Check that your domain is accessible from the internet
   - Verify the webhook URL is correct
   - Check Laravel logs for errors

3. **Database errors:**
   - Ensure migrations have been run
   - Check database connection settings

4. **Users can't get their chat ID:**
   - Ensure the bot is properly configured
   - Check that the `/start` command handler is working
   - Verify the bot token is correct

### Advanced Configuration:

1. **Custom Bot Username:**
   The system uses the `TELEGRAM_BOT_USERNAME` environment variable to direct users to the correct bot.
   Your bot username is already configured as `math_ai_integrator_bot` in your `.env` file.

2. **Frontend Configuration:**
   The frontend uses `VITE_TELEGRAM_BOT_USERNAME` environment variable. 
   You can set this in your `.env.local` file:
   ```
   VITE_TELEGRAM_BOT_USERNAME=math_ai_integrator_bot
   ```

Possible improvements:
1. Store user Telegram chat IDs automatically when they interact with the bot
2. Add file upload support for admin responses
3. Implement more sophisticated plan management
4. Add notifications to users when their requests are processed