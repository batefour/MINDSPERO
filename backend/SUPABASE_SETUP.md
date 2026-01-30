# Supabase & Google OAuth Setup Guide

## Overview
This guide covers setting up Supabase PostgreSQL database and Google OAuth authentication for the MindSpero backend.

---

## Part 1: Supabase PostgreSQL Setup

### Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with email or GitHub
4. Create a new organization and project

### Step 2: Configure Project
1. **Project Settings** → **Database**
2. Set region (e.g., us-east-1)
3. Set database password (save this!)
4. Wait for project to be provisioned (~2 minutes)

### Step 3: Get Database Credentials
1. In Supabase Dashboard: **Settings** → **Database**
2. Copy the connection string:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```
3. Update `.env`:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   SUPABASE_URL=https://[PROJECT_ID].supabase.co
   SUPABASE_ANON_KEY=[ANON_KEY]
   SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
   ```

### Step 4: Get Supabase API Keys
1. **Settings** → **API**
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **Anon Key** → `SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 5: Create Tables
Run the SQL migrations in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    google_id VARCHAR(255) UNIQUE,
    google_picture VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(50) DEFAULT 'free',
    status VARCHAR(50) DEFAULT 'trial',
    is_trial BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    paystack_customer_code VARCHAR(255),
    paystack_subscription_code VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Uploaded files table
CREATE TABLE uploaded_files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    original_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Summaries table
CREATE TABLE summaries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_id INTEGER NOT NULL REFERENCES uploaded_files(id) ON DELETE CASCADE,
    summary_text TEXT NOT NULL,
    summary_length INTEGER,
    processing_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audio files table
CREATE TABLE audio_files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    summary_id INTEGER NOT NULL REFERENCES summaries(id) ON DELETE CASCADE,
    audio_path VARCHAR(500),
    audio_duration FLOAT,
    voice_type VARCHAR(50) DEFAULT 'default',
    processing_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    paystack_reference VARCHAR(255),
    amount FLOAT NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE,
    subscription_month VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_uploaded_files_user_id ON uploaded_files(user_id);
CREATE INDEX idx_summaries_user_id ON summaries(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
```

---

## Part 2: Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (name: "MindSpero")
3. Wait for project creation

### Step 2: Enable APIs
1. **APIs & Services** → **Library**
2. Search for "Google+ API" → Enable
3. Search for "Google Identity" → Enable

### Step 3: Create OAuth Credentials
1. **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **OAuth client ID**
3. If prompted, configure **OAuth consent screen** first:
   - User type: **External**
   - **Create**
   - Fill in app information:
     - App name: "MindSpero"
     - Support email: your-email@example.com
     - Developer contact: your-email@example.com
   - **Save and Continue**
   - Add scopes: email, profile, openid
   - **Save and Continue**
   - **Back to Dashboard**

4. **Credentials** → **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Name: "Backend Server"
7. **Add URI** under "Authorized redirect URIs":
   - Development: `http://localhost:8000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
8. Click **Create**

### Step 4: Copy Credentials
1. Copy the credentials to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
   ```

---

## Testing the Integration

### Test 1: Direct PostgreSQL Connection
```bash
# Test Supabase connection
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Should connect successfully
```

### Test 2: Register New User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Response should include tokens and user data
```

### Test 3: Google OAuth Flow
```bash
# Step 1: Get authorization URL
curl http://localhost:8000/api/auth/google/authorize

# Step 2: Open authorization URL in browser
# Step 3: User grants permission

# Step 4: Backend exchanges code for tokens
# Authorization code is returned in callback
```

### Test 4: Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Response should include JWT tokens
```

---

## Environment Variables Summary

```env
# Database - Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres

# Supabase
SUPABASE_URL=https://PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=anon_key
SUPABASE_SERVICE_ROLE_KEY=service_role_key

# JWT
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Paystack (Existing)
PAYSTACK_SECRET_KEY=sk_live_xxx
PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxx

# Other Services
OPENAI_API_KEY=sk-xxx
REDIS_URL=redis://localhost:6379/0
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET_NAME=ai-education-platform
```

---

## Production Checklist

- [ ] Database hosted on Supabase (not local)
- [ ] Google OAuth credentials set for production domain
- [ ] Environment variables configured in production
- [ ] SSL/HTTPS enabled
- [ ] Database backups configured in Supabase
- [ ] Monitor database performance
- [ ] Set up database connection pooling
- [ ] Configure Row Level Security (RLS) in Supabase for security
- [ ] Set up monitoring and alerts
- [ ] Test payment webhook with Paystack

---

## Troubleshooting

### Connection Refused
- Check if Supabase database is running
- Verify DATABASE_URL is correct
- Check firewall/network access

### Google OAuth Failed
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Check redirect URI matches exactly in Google Console
- Ensure Google+ API is enabled

### Database Migrations Failed
- Verify all tables created successfully in SQL Editor
- Check for missing foreign key constraints
- Ensure columns match model definitions

### CORS Issues
- Add frontend URL to CORS_ORIGINS in config.py
- Restart backend server

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/)

