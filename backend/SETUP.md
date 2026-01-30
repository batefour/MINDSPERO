# AI Education Platform - Complete Setup Guide

## 📋 Overview

This is a production-ready FastAPI backend for an AI-powered PDF education platform with subscription management, AI-powered summaries, audio generation, and comprehensive admin analytics.

## 🎯 What's Included

### ✅ Core Features Implemented
1. **Authentication System**
   - JWT-based auth with bcrypt password hashing
   - User registration with auto free trial (30 days)
   - Login with access/refresh tokens
   - Role-based access control (User/Admin)

2. **User Features**
   - PDF upload with text extraction
   - Free AI-powered summarization (GPT-powered)
   - Premium audio generation (TTS)
   - User dashboard APIs
   - Subscription management

3. **Subscription System**
   - Free trial (30 days automatic)
   - Monthly plan ($9.99)
   - Yearly plan ($99.99)
   - Bonus: +1 free month for paid subscriptions
   - Stripe integration with webhooks

4. **Admin Features**
   - User management (view, filter, delete)
   - Revenue analytics (total, monthly breakdown)
   - Payment transaction tracking
   - Subscription status management
   - User growth metrics

5. **AI Integration**
   - OpenAI GPT-3.5 for PDF summarization
   - Text-to-speech audio generation
   - Multiple voice types
   - Configurable summary lengths (short, medium, long)

6. **Background Processing**
   - Celery task queue with Redis
   - Async PDF processing
   - Async audio generation
   - Scheduled subscription checks
   - Monthly revenue reports

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Settings management
│   ├── database.py          # DB connection
│   ├── models/
│   │   └── models.py        # SQLAlchemy ORM models
│   ├── schemas/
│   │   └── __init__.py      # Pydantic request/response schemas
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── users.py         # User management endpoints
│   │   ├── documents.py     # PDF & summary endpoints
│   │   ├── payments.py      # Subscription & payment endpoints
│   │   └── admin.py         # Admin analytics endpoints
│   ├── services/
│   │   ├── __init__.py      # Business logic
│   │   ├── ai_service.py    # AI & file processing
│   │   └── stripe_service.py# Payment integration
│   ├── utils/
│   │   └── auth.py          # Auth utilities
│   └── tasks/
│       └── celery_app.py    # Background tasks
├── requirements.txt         # Dependencies
├── .env.example             # Environment template
├── Dockerfile               # Docker image
├── docker-compose.yml       # Full stack setup
├── start.sh                 # Startup script
├── README.md                # Backend docs
├── API_GUIDE.md             # API usage guide
└── SETUP.md                 # This file
```

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose installed
- 4GB RAM minimum

### Launch Everything
```bash
cd backend
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- FastAPI (port 8000)
- Celery Worker
- Celery Beat

### Verify
```bash
# Check services
docker-compose ps

# API Docs
open http://localhost:8000/docs

# Health check
curl http://localhost:8000/health
```

## 🛠 Manual Setup

### Requirements
- Python 3.10+
- PostgreSQL 14+
- Redis 7+
- Stripe account (payments)
- OpenAI API key (AI features)

### Step 1: Install Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials:
# - DATABASE_URL (PostgreSQL)
# - REDIS_URL (Redis)
# - STRIPE_SECRET_KEY (Stripe)
# - OPENAI_API_KEY (OpenAI)
# - SECRET_KEY (JWT - change to random value!)
```

### Step 3: Setup PostgreSQL
```bash
# Create database
psql -U postgres -c "CREATE DATABASE ai_education;"

# Or using Docker
docker run -d \
  --name ai_education_db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ai_education \
  -p 5432:5432 \
  postgres:15-alpine
```

### Step 4: Setup Redis
```bash
# Using Docker
docker run -d \
  --name ai_education_redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Step 5: Start Services

**Terminal 1 - FastAPI**
```bash
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Celery Worker**
```bash
source venv/bin/activate
celery -A app.tasks.celery_app worker --loglevel=info
```

**Terminal 3 - Celery Beat**
```bash
source venv/bin/activate
celery -A app.tasks.celery_app beat --loglevel=info
```

### Step 6: Access API
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health**: http://localhost:8000/health

## 🔐 Security Configuration

### Required Setup
1. **Change SECRET_KEY**
   ```python
   # Generate random key
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   # Put in .env as SECRET_KEY
   ```

2. **Paystack Webhook Setup**
   - Go to Paystack Dashboard → Settings → Webhooks
   - Add endpoint: `https://yourdomain/api/paystack/webhook`
   - Select events: `charge.success`, `subscription.create`, `subscription.disable`
   - Copy webhook secret to `.env` as `PAYSTACK_WEBHOOK_SECRET`

3. **CORS Configuration**
   - Update `CORS_ORIGINS` in `.env` with your frontend domains

4. **Database Security**
   - Use strong PostgreSQL password
   - Restrict database access to application only
   - Enable SSL for production

## 📊 Database Models

### User
- Stores user info, role, authentication
- Relations: subscriptions, files, summaries, audio, payments

### Subscription
- Tracks subscription plan and status
- Includes Stripe customer/subscription IDs
- Auto-expires after end_date

### UploadedFile
- PDF upload metadata
- Stores file path and extracted text

### Summary
- AI-generated summaries of PDFs
- Tracks processing status and summary length

### AudioFile
- Audio generation results
- References summary and storage path

### Payment
- Stripe payment records
- Monthly aggregation for revenue reports

## 🔗 API Examples

### Register & Get Tokens
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Upload PDF
```bash
curl -X POST "http://localhost:8000/api/documents/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"
```

### Generate Summary (FREE)
```bash
curl -X POST "http://localhost:8000/api/documents/summarize" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"file_id": 1, "summary_length": "medium"}'
```

### Generate Audio (PREMIUM)
```bash
curl -X POST "http://localhost:8000/api/audio/generate" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"summary_id": 1, "voice_type": "default"}'
```

### Admin - Get Revenue
```bash
curl "http://localhost:8000/api/admin/stats/revenue" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

See [API_GUIDE.md](API_GUIDE.md) for complete endpoint documentation.

## 🧪 Testing

### Manual Testing
Use Swagger UI at http://localhost:8000/docs

### Automated Tests
```bash
pip install pytest pytest-asyncio httpx
pytest
```

### Test User Flow
1. Register → Get tokens ✓
2. Upload PDF → Get file ID ✓
3. Summarize → Get summary ✓
4. Subscribe → Upgrade plan ✓
5. Generate audio → Get audio ✓

## 📦 Deployment

### Docker Deployment
```bash
# Build image
docker build -t ai-education-api .

# Run container
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  -e STRIPE_SECRET_KEY=sk_... \
  -e OPENAI_API_KEY=sk-... \
  ai-education-api
```

### Cloud Platforms

**Heroku**
```bash
heroku create ai-education-api
heroku config:set DATABASE_URL=...
git push heroku main
```

**AWS ECS**
- Use ECR for image registry
- RDS for PostgreSQL
- ElastiCache for Redis
- CloudFormation for infrastructure

**DigitalOcean App Platform**
- Connect GitHub repo
- Deploy with docker-compose
- Managed databases available

**Google Cloud Run**
- Upload Docker image
- CloudSQL for PostgreSQL
- Redis Cloud for cache

## 🔧 Configuration Reference

### Database
```
DATABASE_URL=postgresql://user:password@host:5432/ai_education
SQLALCHEMY_ECHO=False
```

### Authentication
```
SECRET_KEY=your-super-secret-random-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Payment (Stripe)
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### AI Services
```
OPENAI_API_KEY=sk-...
```

### Cache & Tasks
```
REDIS_URL=redis://localhost:6379/0
```

### Subscription
```
TRIAL_DAYS=30
BONUS_TRIAL_DAYS=30
FREE_SUMMARY_LIMIT=5
```

## 🚨 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL running
psql -U postgres -c "SELECT 1"

# Test connection
python -c "from sqlalchemy import create_engine; engine = create_engine('DATABASE_URL'); engine.connect()"
```

### Redis Connection Error
```bash
# Check Redis running
redis-cli ping

# Should return: PONG
```

### Celery Tasks Not Running
```bash
# Check Redis is available
redis-cli ping

# Restart Celery worker
celery -A app.tasks.celery_app worker --loglevel=debug
```

### Stripe Webhook Not Working
1. Verify webhook secret in `.env`
2. Check endpoint URL in Stripe dashboard
3. Verify HTTPS (Stripe requires it)
4. Check logs for webhook errors

### OpenAI API Errors
1. Verify API key is correct
2. Check account has credits
3. Monitor API usage in OpenAI dashboard
4. Handle rate limits gracefully

## 📈 Monitoring

### Logging
```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

### Health Checks
- `/health` endpoint monitors service status
- Docker health checks configured
- Database connectivity tested on startup

### Alerts to Setup
- Failed payments
- Subscription expirations
- API errors
- High latency
- Database connection failures

## 🔄 Maintenance

### Database Backups
```bash
# Backup
pg_dump ai_education > backup.sql

# Restore
psql ai_education < backup.sql
```

### Log Rotation
Configure log rotation in production (logrotate, systemd, etc.)

### Dependency Updates
```bash
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

## 📚 Documentation

- [Backend README](README.md) - Overview & features
- [API Guide](API_GUIDE.md) - Endpoint documentation
- Swagger UI - http://localhost:8000/docs
- ReDoc - http://localhost:8000/redoc

## 🤝 Integration Points

### Frontend (React/Vue/etc)
- API endpoint: `http://localhost:8000`
- Auth: JWT tokens in Authorization header
- CORS: Configured for localhost:3000, etc.

### Payment Processing
- Stripe API for subscriptions
- Webhook endpoint for events
- Customer/subscription tracking

### AI Services
- OpenAI API for summaries
- pyttsx3 for audio generation
- File storage for uploads

## ✨ Next Steps

1. **Configure Stripe Account**
   - Create products and prices
   - Set up webhook
   - Get API keys

2. **Set OpenAI API Key**
   - Create account at openai.com
   - Generate API key
   - Add to .env

3. **Setup Frontend**
   - Point to http://localhost:8000
   - Implement auth flow
   - Integrate payment forms

4. **Deploy to Production**
   - Choose hosting platform
   - Configure CI/CD pipeline
   - Set up monitoring
   - Enable HTTPS

## 📞 Support

For issues:
1. Check API docs at http://localhost:8000/docs
2. Review error logs
3. Check service health
4. Verify .env configuration
5. Test database/Redis connectivity

## 📄 License

MIT - See LICENSE file

---

**Congratulations!** Your AI Education Platform backend is ready. 🎉

Next: Configure your Stripe account and OpenAI API key, then deploy!
