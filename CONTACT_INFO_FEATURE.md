# Contact Information Feature for Plan Purchase Requests

## Overview

This feature enhances the plan purchase request system by allowing users to provide their contact information (phone number and Telegram username) when requesting a plan purchase. This information is stored in the database and displayed to administrators for easier communication with users.

## Changes Made

### 1. Database Migration

A new migration was added to include two new fields in the `plan_purchase_requests` table:
- `phone` (string, nullable): Stores the user's phone number
- `telegram_username` (string, nullable): Stores the user's Telegram username

### 2. Model Update

The `PlanPurchaseRequest` model was updated to include the new fields in the `$fillable` array:
- `phone`
- `telegram_username`

### 3. Frontend Changes

The dashboard frontend was modified to:
- Show a dedicated modal for contact information when a user selects a plan
- Collect phone number with automatic formatting (+998 XX XXX XX XX format)
- Collect Telegram username (both optional but at least one required)
- Submit the contact information along with the plan purchase request

A new reusable `ContactInfoModal` component was created to handle the contact form:
- Located at `resources/js/components/ContactInfoModal.tsx`
- Includes phone number formatting
- Validates that at least one contact method is provided
- Handles form submission

### 4. Backend Changes

The `TelegramController` was updated to:
- Accept `phone` and `telegram_username` parameters in the `requestPlanPurchase` method
- Validate the new parameters
- Store the contact information in the database
- Include the contact information in the admin notification message

### 5. Admin Interface

The admin interface was updated to:
- Display phone number and Telegram username in the plan purchase request details view
- Show contact information in the plan purchase requests table

## API Endpoints

### Request Plan Purchase

**Endpoint**: `POST /api/telegram/request-plan-purchase`

**Parameters**:
- `plan_id` (required): The ID of the plan to purchase
- `phone` (optional): The user's phone number
- `telegram_username` (optional): The user's Telegram username

**Response**:
```json
{
  "success": true,
  "message": "So'rovingiz yuborildi. Admin tez orada siz bilan bog'lanadi.",
  "request_id": 123
}
```

## Validation Rules

- At least one of `phone` or `telegram_username` should be provided (frontend validation)
- `phone`: string, max 20 characters
- `telegram_username`: string, max 50 characters

## User Experience

1. User clicks "Upgrade Plan" or "Select Plan" button
2. User selects a plan from the available options
3. User clicks "Bog'lanish uchun ma'lumotlar" button
4. A modal appears with fields for phone number and Telegram username
5. Phone number is automatically formatted as the user types (+998 XX XXX XX XX)
6. User fills in at least one contact method
7. User submits the form
8. System shows success message: "So'rovingiz yuborildi. Admin tez orada siz bilan bog'lanadi."
9. Admin receives notification with user's contact information

## Admin Experience

1. Admin receives a Telegram notification with plan purchase request details
2. Admin can view all requests in the admin panel
3. Contact information (phone and Telegram username) is displayed for each request
4. Admin can click on Telegram username to open chat with user

## Component Structure

- **Main Dashboard**: `resources/js/pages/dashboard/page.tsx`
  - Imports and uses the ContactInfoModal component
  - Handles plan selection and contact form display
  - Manages state for selected plan and modal visibility

- **Contact Info Modal**: `resources/js/components/ContactInfoModal.tsx`
  - Standalone reusable component for collecting contact information
  - Includes phone number formatting logic
  - Handles form validation and submission