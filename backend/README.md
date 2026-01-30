# AI Education Platform Backend

Production-ready FastAPI backend for an AI-powered PDF education platform with subscription management, AI summarization, audio generation, and admin analytics.

## Features

### Core Features
- **JWT-based Authentication** - Secure user registration, login, and token management
- **Free Trial System** - Automatic 1-month free trial on signup
- **PDF Management** - Upload, extract text, and manage PDFs
- **AI Summarization** - Free for all users (GPT-powered)
- **Audio Generation** - Premium feature for subscribed users
- **Subscription System** - Monthly/yearly plans with Stripe integration
- **Bonus Rules** - Paid subscriptions get +1 free month
- **Admin Dashboard** - User management, analytics, and revenue tracking
- **Background Processing** - Async tasks with Celery
- **Webhook Integration** - Stripe payment webhooks

### Security
- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (User/Admin)
- Secure API endpoints with dependency injection
- CORS protection

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (python-jose)
- **Task Queue**: Celery with Redis
- **Payment**: Stripe
- **AI**: OpenAI GPT, pyttsx3 for audio
- **PDF Processing**: PyPDF2, pdf2image
- **Validation**: Pydantic

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration and settings
│   ├── database.py             # Database connection and session
│   ├── models/
│   │   ├── __init__.py         # Database models
│   │   └── models.py           # SQLAlchemy models
│   ├── schemas/
│   │   └── __init__.py         # Pydantic schemas (request/response)
│   ├── routes/
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── users.py            # User management endpoints
│   │   ├── documents.py        # PDF and summary endpoints
│   │   ├── payments.py         # Subscription and payment endpoints
│   │   └── admin.py            # Admin analytics endpoints
│   ├── services/
│   │   ├── __init__.py         # Business logic services
│   │   ├── ai_service.py       # AI/PDF processing
│   │   └── stripe_service.py   # Stripe integration
│   ├── utils/
│   │   └── auth.py             # Authentication utilities
│   └── tasks/
│       └── celery_app.py       # Background task definitions
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Installation & Setup

### 1. Prerequisites
- Python 3.10+
- PostgreSQL 14+
- Redis
- Stripe account (for payments)
- OpenAI API key (for AI features)

### 2. Clone & Install

```bash
cd backend
pip install -r requirements.txt
```

### 3. Environment Setup

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE ai_education;"

# Run migrations (using Alembic if configured)
# Or tables will be auto-created on first run
```

### 5. Start Services

```bash
# Terminal 1: FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Celery worker (background tasks)
celery -A app.tasks.celery_app worker --loglevel=info

# Terminal 3: Celery beat (scheduled tasks)
celery -A app.tasks.celery_app beat --loglevel=info

# Terminal 4: Redis server
redis-server
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration (auto free trial)
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### User Management
- `GET /api/users/me` - Get current user profile
- `GET /api/users/{user_id}` - Get user by ID
- `DELETE /api/users/{user_id}` - Delete user account
- `GET /api/users/me/subscription` - Get user subscription
- `GET /api/users/{user_id}/subscription-status` - Check subscription status
- `POST /api/users/{user_id}/subscription/cancel` - Cancel subscription
- `POST /api/users/{user_id}/subscription/activate` - Activate subscription (admin)

### PDF & Summaries
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents/files` - List user's files
- `POST /api/documents/summarize` - Generate AI summary (free)
- `GET /api/documents/summaries` - List summaries
- `GET /api/documents/summaries/{summary_id}` - Get summary details
- `DELETE /api/documents/files/{file_id}` - Delete file

### Audio & Payments
- `POST /api/audio/generate` - Generate audio explanation (premium)
- `GET /api/audio` - List audio files
- `DELETE /api/audio/{audio_id}` - Delete audio file
- `POST /api/subscription/upgrade` - Upgrade subscription
- `POST /api/stripe/webhook` - Stripe webhook handler

### Admin Analytics
- `GET /api/admin/users` - List all users (admin)
- `GET /api/admin/users/filter` - Filter users by status (admin)
- `DELETE /api/admin/users/{user_id}` - Delete user (admin)
- `GET /api/admin/stats/users` - User statistics
- `GET /api/admin/stats/revenue` - Revenue statistics
- `GET /api/admin/payments` - All payment transactions
- `GET /api/admin/payments/{user_id}` - User payments
- `GET /api/admin/analytics/monthly-revenue` - Monthly breakdown
- `GET /api/admin/analytics/subscription-growth` - Growth metrics

## Database Models

### User
```
id, name, email, password_hash, role, created_at, updated_at, is_active
```

### Subscription
```
id, user_id, plan, status, start_date, end_date, is_trial, 
stripe_customer_id, stripe_subscription_id
```

### UploadedFile
```
id, user_id, file_name, file_path, file_size, original_text, created_at
```

### Summary
```
id, user_id, file_id, summary_text, summary_length, processing_status
```

### AudioFile
```
id, user_id, summary_id, audio_path, audio_duration, voice_type, processing_status
```

### Payment
```
id, user_id, stripe_payment_id, amount, currency, payment_status, 
payment_date, subscription_month
```

## Configuration

### Key Settings
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_education

# JWT
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI
OPENAI_API_KEY=sk_...

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:8081"]

# Trial Settings
TRIAL_DAYS=30
BONUS_TRIAL_DAYS=30
```

## Subscription Logic

### Free Trial
- All new users get 1-month free trial automatically
- Free summary feature available
- Audio generation NOT available during trial

-### Premium Plans
- **Monthly**: GHC30/month
- **Yearly**: GHC360/year (10% discount applied at checkout — billed as GHC324 after discount where applicable)
- **Bonus**: +1 month free for any paid subscription
- Includes unlimited summaries and audio generation
- Auto-renews unless cancelled

## Stripe Integration

### Setup Steps
1. Create Stripe account at stripe.com
2. Get API keys from dashboard
3. Set `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` in `.env`
4. Configure webhook endpoint: `https://yourdomain/api/stripe/webhook`
5. Set webhook secret in `.env` as `STRIPE_WEBHOOK_SECRET`

### Events Handled
- `payment_intent.succeeded` - Record payment
- `customer.subscription.updated` - Update subscription
- `customer.subscription.deleted` - Cancel subscription

## Background Tasks

### Celery Tasks
- `process_pdf_summary` - Async PDF summarization
- `process_audio_generation` - Async audio generation
- `check_expired_subscriptions` - Hourly subscription checks
- `send_subscription_expiry_notification` - Email notifications
- `generate_monthly_revenue_report` - Monthly reports

## Example Usage

### Register User
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Upload PDF
```bash
curl -X POST "http://localhost:8000/api/documents/upload" \
  -H "Authorization: Bearer {token}" \
  -F "file=@document.pdf"
```

### Generate Summary
```bash
curl -X POST "http://localhost:8000/api/documents/summarize" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": 1,
    "summary_length": "medium"
  }'
```

### Upgrade Subscription
```bash
curl -X POST "http://localhost:8000/api/subscription/upgrade?plan=monthly" \
  -H "Authorization: Bearer {token}"
```

## Production Deployment

### Docker Setup
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment
- Use strong `SECRET_KEY` in production
- Set `DEBUG=False`
- Use PostgreSQL managed service (AWS RDS, Azure Database)
- Use Redis managed service (AWS ElastiCache, Redis Cloud)
- Configure proper logging and monitoring
- Set up SSL/TLS certificates
- Use environment-specific `.env` files

### Deployment Platforms
- **Heroku**: Procfile with web and worker dynos
- **AWS**: ECS with RDS, ElastiCache, S3
- **DigitalOcean**: App Platform with managed databases
- **Google Cloud**: Cloud Run with Cloud SQL

## Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# With coverage
pytest --cov=app tests/
```

## Monitoring & Logging

- Implement structured logging
- Use monitoring tools (Sentry, DataDog, New Relic)
- Set up alerts for:
  - Failed payments
  - API errors
  - Subscription expirations
  - High latency

## Security Checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Set `DEBUG=False` in production
- [ ] Use HTTPS only
- [ ] Validate all inputs
- [ ] Rate limiting on auth endpoints
- [ ] CORS properly configured
- [ ] Database passwords secured
- [ ] API keys in environment variables
- [ ] Regular security updates
- [ ] SQL injection protection (SQLAlchemy ORM)

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Update DATABASE_URL in .env
```

### Celery Tasks Not Running
```bash
# Check Redis
redis-cli ping

# Check Celery worker logs
celery -A app.tasks.celery_app worker --loglevel=debug
```

### Stripe Webhook Failures
- Verify webhook secret in `.env`
- Check endpoint URL in Stripe dashboard
- Review Stripe webhook logs in dashboard

## Documentation

API documentation available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI**: http://localhost:8000/openapi.json

## License

MIT

## Support

For issues or questions:
1. Check API documentation at `/docs`
2. Review error logs
3. Check Stripe and OpenAI dashboards for service status
4. Verify database and Redis connections
