# Telegram Account Connection Feature

This document explains how the Telegram account connection feature works in the education system using the Telegraph library.

## Overview

The Telegram account connection feature allows users to connect their Telegram accounts to the system so that they can receive direct notifications about plan purchases and other important updates. The integration now uses the Telegraph library for a more robust and feature-rich Telegram bot experience.

## How It Works

### For Users:

1. When a user clicks the "Buy Plan" button on either the landing page or dashboard, their Telegram account is automatically connected if not already connected.

2. Users receive a notification to check their Telegram bot for further instructions.

3. In Telegram, users can interact with the bot using commands and buttons:
   - `/start` - Start the bot and show the main menu
   - 💳 "Reja sotib olish" (Buy Plan) - View available plans and select one
   - 👨‍💼 "Admin bilan bog'lanish" (Connect with Admin) - Request to speak with an admin
   - ℹ️ "Mening hisobim" (My Account) - View account information

4. When users select a plan, they can directly purchase it through the bot.

5. After submitting a plan purchase request, users will receive updates directly in Telegram.

### For Admins:

1. When an admin receives a plan purchase request notification, it will include the user's Telegram chat ID (if available).

2. Admins can respond to requests directly through Telegram using inline buttons:
   - ✅ "Tasdiqlash" (Approve) - Approve the plan purchase request
   - ❌ "Rad etish" (Reject) - Reject the plan purchase request

3. When responding to requests, admins can be confident that users will receive direct notifications on Telegram.

4. Admins can also respond to user requests to connect via the "Admin bilan bog'lanish" button.

## Technical Implementation

### Database Changes

A new `telegram_chat_id` field has been added to the `users` table via migration.

### Backend Changes

1. **User Model**: Added `telegram_chat_id` to the fillable fields and helper methods.

2. **TelegramController**: 
   - Added a new endpoint `/api/telegram/connect-account` to handle connecting user accounts
   - Added endpoint `/api/telegram/connect-via-bot` for deep link connections
   - Simplified the plan purchase flow

3. **Telegraph Integration**:
   - Created `app/Telegraph/TelegramBot.php` with handlers for all bot interactions
   - Created `app/Http/Controllers/TelegraphController.php` to handle webhook requests
   - Configured Telegraph in `config/telegraph.php`
   - Added command `php artisan telegraph:webhook:setup` to set up the webhook

4. **Enhanced Features**:
   - Automatic account connection through deep links
   - Interactive buttons for all major actions
   - Direct plan selection within Telegram
   - Real-time notifications for users and admins
   - Improved error handling and user feedback

### Frontend Changes

1. **Dashboard Page**: Simplified the plan purchase flow to automatically connect Telegram accounts.

2. **Landing Page**: Simplified the plan purchase flow to automatically connect Telegram accounts.

### API Routes

- `POST /api/telegram/connect-account` - Connect user's Telegram account
- `GET /api/telegram/connect-via-bot` - Connect via Telegram deep link
- `POST /api/telegram/request-plan-purchase` - Request plan purchase (enhanced)
- `POST /telegraph/{token}/webhook` - Telegraph webhook endpoint

## Setup Instructions

1. Ensure the Telegram bot is properly configured in the `.env` file:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELELEGRAM_BOT_USERNAME=math_ai_integrator_bot
   TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id
   ```
   
   Note: TELEGRAM_BOT_USERNAME should be the username of your Telegram bot without the @ symbol.
   Example: if your bot is @math_ai_integrator_bot, then TELEGRAM_BOT_USERNAME=math_ai_integrator_bot

2. Run the database migration:
   ```bash
   php artisan migrate
   ```

3. Set up the Telegram webhook:
   ```bash
   php artisan telegraph:webhook:setup
   ```

## Testing

Unit tests have been added to verify the functionality:
- User can connect their Telegram account
- User can request plan purchase with Telegram information
- Admin can respond to requests and users receive notifications

## Future Improvements

1. Enhanced admin interaction through the bot with custom message responses
2. More detailed account information in the "Mening hisobim" section
3. Additional features like plan expiration notifications
4. Multi-language support for the bot interface
5. Integration with payment systems for direct payments in Telegram