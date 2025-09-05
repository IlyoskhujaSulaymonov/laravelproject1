# Telegram Account Connection Feature

This document explains how the Telegram account connection feature works in the education system.

## Overview

The Telegram account connection feature allows users to connect their Telegram accounts to the system so that they can receive direct notifications about plan purchases and other important updates.

## How It Works

### For Users:

1. When a user clicks the "Buy Plan" button on either the landing page or dashboard, they will be prompted to connect their Telegram account if they haven't already.

2. Users can connect their Telegram account by:
   - Clicking "Yes" when prompted to go to the Telegram bot
   - The system will automatically open the Telegram bot in a new tab
   - Sending the `/start` command to the bot
   - The bot will reply with their chat ID and instructions
   - Copying the chat ID from the bot's message
   - Entering the chat ID in the prompt on the website

3. Once the user enters their chat ID, it will be saved in their user profile.

4. When they submit a plan purchase request, the system will include their Telegram information in the notification sent to the admin.

5. If their request is approved or rejected, they will receive a direct message on Telegram.

### For Admins:

1. When an admin receives a plan purchase request notification, it will include the user's Telegram chat ID (if available).

2. When responding to requests, admins can be confident that users will receive direct notifications on Telegram.

## Technical Implementation

### Database Changes

A new `telegram_chat_id` field has been added to the `users` table via migration.

### Backend Changes

1. **User Model**: Added `telegram_chat_id` to the fillable fields.

2. **TelegramController**: Added a new endpoint `/api/telegram/connect-account` to handle connecting user accounts.

3. **TelegramService**: Enhanced to:
   - Automatically capture chat IDs when users send `/start` to the bot
   - Send direct messages to users when they have connected their Telegram accounts
   - Provide clear instructions to users through the bot

### Frontend Changes

1. **Dashboard Page**: Modified the plan purchase flow to automatically send users to the Telegram bot if not already connected.

2. **Landing Page**: Modified the plan purchase flow to automatically send users to the Telegram bot if not already connected.

### API Routes

- `POST /api/telegram/connect-account` - Connect user's Telegram account
- `POST /api/telegram/request-plan-purchase` - Request plan purchase (existing, enhanced)

## Setup Instructions

1. Ensure the Telegram bot is properly configured in the `.env` file:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_BOT_USERNAME=math_ai_integrator_bot
   TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id
   ```
   
   Note: TELEGRAM_BOT_USERNAME should be the username of your Telegram bot without the @ symbol.
   Example: if your bot is @math_ai_integrator_bot, then TELEGRAM_BOT_USERNAME=math_ai_integrator_bot

2. Run the database migration:
   ```bash
   php artisan migrate
   ```

## Testing

Unit tests have been added to verify the functionality:
- User can connect their Telegram account
- User can request plan purchase with Telegram information
- Admin can respond to requests and users receive notifications

## Future Improvements

1. Automatically detect Telegram chat ID when user interacts with the bot (without manual entry)
2. Add a web interface for users to manage their Telegram connection
3. Send more types of notifications via Telegram (e.g., plan expiration warnings)
4. Implement deep linking to automatically capture chat ID without manual entry