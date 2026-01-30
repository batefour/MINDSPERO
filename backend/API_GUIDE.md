# API Documentation Guide

## Quick Start

### 1. Installation & Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

### 2. Start Services (Terminal 1)
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Flow Example

### Step 1: Register User
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "is_active": true,
    "created_at": "2024-01-30T10:00:00"
  }
}
```

### Step 2: Upload PDF (using access token)
```bash
POST /api/documents/upload
Header: Authorization: Bearer {access_token}
Body: form-data with file

Response:
{
  "id": 1,
  "user_id": 1,
  "file_name": "document.pdf",
  "file_size": 102400,
  "created_at": "2024-01-30T10:05:00"
}
```

### Step 3: Generate Summary (FREE)
```bash
POST /api/documents/summarize
Header: Authorization: Bearer {access_token}
{
  "file_id": 1,
  "summary_length": "medium"
}

Response:
{
  "id": 1,
  "user_id": 1,
  "file_id": 1,
  "summary_text": "This document discusses...",
  "summary_length": "medium",
  "processing_status": "completed",
  "created_at": "2024-01-30T10:10:00"
}
```

### Step 4: Check Subscription Status
```bash
GET /api/users/me/subscription
Header: Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "user_id": 1,
  "plan": "free",
  "status": "trial",
  "start_date": "2024-01-30T10:00:00",
  "end_date": "2024-02-29T10:00:00",
  "is_trial": true,
  "created_at": "2024-01-30T10:00:00"
}
```

### Step 5: Upgrade to Paid Plan
```bash
POST /api/subscription/initialize-payment?plan=monthly
Header: Authorization: Bearer {access_token}

Response:
{
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "access_code",
  "reference": "subscription_1_monthly_...",
  "plan": "monthly",
  "amount": 2499
}

# Then verify payment after user completes payment
POST /api/subscription/verify-payment/{reference}
Header: Authorization: Bearer {access_token}

Response:
{
  "id": 2,
  "user_id": 1,
  "plan": "monthly",
  "status": "active",
  "start_date": "2024-01-30T10:15:00",
  "end_date": "2024-03-01T10:15:00",  // +1 month bonus
  "is_trial": false,
  "paystack_customer_code": "CUS_...",
  "paystack_subscription_code": "SUB_...",
  "created_at": "2024-01-30T10:15:00"
}
```

### Step 6: Generate Audio (PREMIUM)
```bash
POST /api/audio/generate
Header: Authorization: Bearer {access_token}
{
  "summary_id": 1,
  "voice_type": "default"
}

Response:
{
  "id": 1,
  "user_id": 1,
  "summary_id": 1,
  "audio_path": "uploads/1/audio/1234567890.mp3",
  "audio_duration": 120,
  "voice_type": "default",
  "processing_status": "completed",
  "created_at": "2024-01-30T10:20:00"
}
```

### Step 7: Admin - View Revenue
```bash
GET /api/admin/stats/revenue
Header: Authorization: Bearer {admin_token}

Response:
{
  "total_revenue": 19.98,
  "monthly_revenue": {
    "2024-01": 9.99,
    "2024-02": 9.99
  },
  "currency": "usd"
}
```

## Authentication Details

### Token Format
- **Type**: JWT (JSON Web Token)
- **Algorithm**: HS256
- **Expiration**: 30 minutes (configurable)
- **Header**: Authorization: Bearer {token}

### Token Payload
```json
{
  "sub": 1,  // user_id
  "exp": 1704067200,  // expiration timestamp
  "iat": 1704067200   // issued at timestamp
}
```

## Error Handling

All errors return consistent format:
```json
{
  "detail": "Error message",
  "error_code": "ERROR_CODE"  // optional
}
```

### Common HTTP Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Admin Endpoints

All admin endpoints require:
- Valid JWT token with admin role
- Header: `Authorization: Bearer {admin_token}`

### Available Admin Endpoints
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/filter?status=active` - Filter by status
- `GET /api/admin/stats/users` - User statistics
- `GET /api/admin/stats/revenue` - Revenue statistics
- `GET /api/admin/payments` - All transactions
- `POST /api/admin/subscriptions/{user_id}/activate` - Activate subscription
- `POST /api/admin/subscriptions/{user_id}/deactivate` - Deactivate subscription

## Subscription Plans

### Free Trial
- Duration: 30 days
- Features:
  - PDF upload (unlimited)
  - Text extraction
  - AI summaries (free)
  - **NOT**: Audio generation
- Auto-expires after 30 days

### Monthly Plan (GHC30/month)
- Duration: 30 days
- Bonus: +1 free month
- Features:
  - Everything in Free Trial
  - Audio generation (unlimited)
  - Priority support
- Auto-renews monthly

### Yearly Plan (GHC360/year — 10% discount = GHC324)
- Duration: 365 days
- Bonus: +1 free month (30 days extra)
- Features:
  - Everything in Monthly
  - Annual discount (save 10% — saves GHC36)
  - Priority support
- Auto-renews annually

## Webhook Integration

### Stripe Webhook Endpoint
`POST /api/stripe/webhook`

### Events Handled
1. **payment_intent.succeeded** - Record successful payment
2. **customer.subscription.updated** - Update subscription details
3. **customer.subscription.deleted** - Cancel subscription

### Verification
- All webhooks are verified using Stripe signature
- Signature header: `stripe-signature`
- Secret: `STRIPE_WEBHOOK_SECRET` from environment

## Rate Limiting Recommendations

- Auth endpoints: 5 requests per minute
- API endpoints: 100 requests per minute
- Admin endpoints: 50 requests per minute
- Webhook: No limit (whitelist by IP)

## Pagination

Endpoints with list responses support:
- `skip`: Number of records to skip (default: 0)
- `limit`: Number of records to return (default: 50, max: 1000)

Example:
```
GET /api/documents/files?skip=0&limit=10
```

## Testing Endpoints

### Health Check
```bash
curl http://localhost:8000/health

Response: {"status": "healthy", "app": "AI Education Platform", "version": "v1"}
```

### Root Endpoint
```bash
curl http://localhost:8000/

Response: {"message": "Welcome to AI Education Platform", "docs": "/docs"}
```

## Database Relationships

```
User
├── Subscriptions (1-to-many)
├── UploadedFiles (1-to-many)
│   └── Summaries (1-to-many)
│       └── AudioFiles (1-to-many)
├── AudioFiles (1-to-many)
└── Payments (1-to-many)
```

## Environment Variables Reference

Key variables needed:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT signing key
- `STRIPE_SECRET_KEY` - Stripe API key
- `OPENAI_API_KEY` - OpenAI API key
- `CORS_ORIGINS` - Allowed origins

See `.env.example` for complete list.
