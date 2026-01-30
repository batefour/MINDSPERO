# Paystack Configuration Guide

This file contains setup instructions for Paystack payment integration.

## Creating Plans in Paystack

### Step 1: Get API Keys
1. Go to https://dashboard.paystack.com
2. Navigate to Settings → API Keys
3. Copy your **Secret Key** (starts with `sk_...`)
4. Copy your **Public Key** (starts with `pk_...`)

### Step 2: Configure Environment Variables

Add to your `.env` file:
```
PAYSTACK_SECRET_KEY=sk_...
PAYSTACK_PUBLIC_KEY=pk_...
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
```

### Step 3: Create Plans (Optional)

Plans are created automatically via the API, but you can pre-create them:

**Monthly Plan (NGN 2,499)**
- Go to Plans section in dashboard
- Create new plan
- Amount: 2,499
- Interval: Monthly
- Plan code: `PLN_monthly`

**Yearly Plan (NGN 24,999)**
- Amount: 24,999
- Interval: Yearly
- Plan code: `PLN_yearly`

## Webhook Setup

### Configure Webhook URL
1. Go to Paystack Dashboard → Settings → Webhooks
2. Add endpoint: `https://yourdomain.com/api/paystack/webhook`
3. Copy the webhook secret
4. Add to `.env` as `PAYSTACK_WEBHOOK_SECRET`

### Events to Enable
- `charge.success` - Successful payment
- `subscription.create` - New subscription
- `subscription.disable` - Subscription cancelled

## Testing

### Test Cards
**Nigerian Bank**
- Card: 4084 0343 0343 0343
- Name: Any name
- Expiry: Any future date
- CVV: 123

**Mastercard**
- Card: 5399 8343 0343 0343
- Expiry: Any future date
- CVV: 123

### Test Amount
- Any amount works in test mode
- Use `NGN` as currency

## API Endpoints Used

- `POST /transaction/initialize` - Start payment
- `GET /transaction/verify/{reference}` - Verify payment
- `POST /plan` - Create subscription plan
- `GET /plan` - List plans
- `POST /subscription` - Create subscription

## Pricing

**Monthly Plan**: NGN 2,499 (~$5.30 USD)
**Yearly Plan**: NGN 24,999 (~$53 USD)

*Paystack charges 1.5% + ₦10 per successful transaction*

## Support

- Documentation: https://paystack.com/developers
- Dashboard: https://dashboard.paystack.com
- Email: support@paystack.com

