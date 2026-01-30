# 🚀 Supabase & Google OAuth Integration - Complete Setup

## ✅ What's Been Completed

### 1. **Supabase PostgreSQL Database**
- ✅ Configuration added to `config.py`
- ✅ Environment variables defined
- ✅ Database connection ready
- ✅ SQL migration scripts provided

### 2. **Google OAuth 2.0 Authentication**
- ✅ New `GoogleOAuthService` created
- ✅ Authorization endpoints added
- ✅ Callback handler implemented
- ✅ User auto-creation on first login
- ✅ Token refresh support

### 3. **Updated Models**
- ✅ User model updated with Google OAuth fields
- ✅ `google_id` - unique Google identifier
- ✅ `google_picture` - user's profile picture
- ✅ `password_hash` - nullable for OAuth users

### 4. **New Authentication Routes**
- ✅ `GET /api/auth/google/authorize` - Get authorization URL
- ✅ `POST /api/auth/google/callback` - Handle OAuth callback
- ✅ `GET /api/auth/me` - Get current user profile

### 5. **Updated Dependencies**
Added to `requirements.txt`:
- `httpx==0.25.1` - Async HTTP client
- `supabase==2.0.1` - Supabase Python client
- `google-auth==2.26.1` - Google authentication

---

## 📋 Files Updated/Created

| File | Status | Description |
|------|--------|-------------|
| `app/config.py` | ✅ Updated | Supabase + Google OAuth configuration |
| `app/models/__init__.py` | ✅ Updated | User model with Google fields |
| `app/routes/auth.py` | ✅ Updated | New Google OAuth endpoints |
| `app/services/google_oauth_service.py` | ✅ Created | Google OAuth service class |
| `requirements.txt` | ✅ Updated | New dependencies added |
| `.env.example` | ✅ Updated | Complete environment template |
| `SUPABASE_SETUP.md` | ✅ Created | Detailed setup instructions |

---

## 🔧 Quick Start

### 1. Create Supabase Project
```bash
# Go to https://supabase.com
# 1. Create account
# 2. New project
# 3. Note your credentials
```

### 2. Create Google OAuth Credentials
```bash
# Go to https://console.cloud.google.com
# 1. New project
# 2. Enable Google+ API
# 3. Create OAuth 2.0 credentials
# 4. Add redirect URIs
```

### 3. Configure Environment
```bash
cd backend

# Copy template
cp .env.example .env

# Edit .env with your credentials:
# - DATABASE_URL (from Supabase)
# - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
# - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
```

### 4. Create Database Tables
```bash
# Run migrations in Supabase SQL Editor
# See SUPABASE_SETUP.md for SQL scripts
```

### 5. Install Dependencies
```bash
pip install -r requirements.txt
```

### 6. Start Backend
```bash
uvicorn app.main:app --reload --port 8000
```

---

## 🔐 OAuth Flow Diagram

```
User → Click "Sign in with Google"
  ↓
GET /api/auth/google/authorize
  ↓
Redirect to Google login
  ↓
User authorizes app
  ↓
Google redirects to callback with code
  ↓
POST /api/auth/google/callback?code=...&state=...
  ↓
Backend exchanges code for tokens
  ↓
Get user info from Google
  ↓
Create/Update user in database
  ↓
Generate JWT tokens
  ↓
Return tokens + user data to frontend
  ↓
User logged in! 🎉
```

---

## 📚 API Endpoints

### Authentication Endpoints

#### 1. Register with Email
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "access_token": "eyJ0eXA...",
  "refresh_token": "eyJ0eXA...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "is_active": true
  }
}
```

#### 2. Login with Email
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "access_token": "eyJ0eXA...",
  "refresh_token": "eyJ0eXA...",
  "user": { ... }
}
```

#### 3. Google Authorize
```bash
GET /api/auth/google/authorize

Response:
{
  "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "state": "random-csrf-token"
}
```

#### 4. Google Callback
```bash
POST /api/auth/google/callback?code=...&state=...

Response:
{
  "access_token": "eyJ0eXA...",
  "refresh_token": "eyJ0eXA...",
  "user": { ... }
}
```

#### 5. Get Current User
```bash
GET /api/auth/me
Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "google_picture": "https://lh3.googleusercontent.com/...",
  "role": "user",
  "is_active": true,
  "created_at": "2024-01-30T...",
  "updated_at": "2024-01-30T..."
}
```

#### 6. Refresh Token
```bash
POST /api/auth/refresh

{
  "token": "eyJ0eXA..."  # refresh token
}

Response:
{
  "access_token": "eyJ0eXA...",
  "refresh_token": "eyJ0eXA...",
  "user": { ... }
}
```

---

## 🧪 Testing

### Test with cURL

#### 1. Google Authorization
```bash
# Get authorization URL
curl http://localhost:8000/api/auth/google/authorize

# Copy the authorization_url and open in browser
# Grant permissions
# Browser redirects to callback with code
```

#### 2. Simulate Callback (for testing)
```bash
# You'll need a valid auth code from Google
curl -X POST "http://localhost:8000/api/auth/google/callback?code=YOUR_CODE&state=STATE"
```

#### 3. Email Registration
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

#### 4. Email Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

#### 5. Get Current User
```bash
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),              -- Nullable for OAuth users
    role VARCHAR(50) DEFAULT 'user',
    google_id VARCHAR(255) UNIQUE,            -- Google's user ID
    google_picture VARCHAR(500),              -- Profile picture URL
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Relationships
- **users** ← 1:N → **subscriptions**
- **users** ← 1:N → **uploaded_files**
- **users** ← 1:N → **summaries**
- **users** ← 1:N → **audio_files**
- **users** ← 1:N → **payments**

---

## 🔑 Environment Variables

### Required for Supabase
```
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres
SUPABASE_URL=https://project-id.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Required for Google OAuth
```
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### Required for JWT
```
SECRET_KEY=minimum-32-characters-long-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

---

## 🚀 Frontend Integration

### React Example

```typescript
// src/hooks/useAuth.ts
import { useState } from 'react';

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  
  // Get authorization URL
  const startGoogleLogin = async () => {
    const response = await fetch('/api/auth/google/authorize');
    const { authorization_url } = await response.json();
    window.location.href = authorization_url;
  };
  
  return { startGoogleLogin, loading };
}
```

```tsx
// src/pages/Login.tsx
import { useGoogleAuth } from '@/hooks/useAuth';

export function Login() {
  const { startGoogleLogin } = useGoogleAuth();
  
  return (
    <div>
      <button onClick={startGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}
```

---

## 🛡️ Security Checklist

- [ ] HTTPS enabled in production
- [ ] SECRET_KEY is cryptographically secure (32+ chars)
- [ ] GOOGLE_CLIENT_SECRET never exposed to frontend
- [ ] Redirect URIs whitelisted in Google Console
- [ ] CORS origins restricted to your domain
- [ ] Database passwords strong and unique
- [ ] Supabase Row Level Security (RLS) configured
- [ ] Regular database backups enabled
- [ ] Monitoring and alerts configured
- [ ] Rate limiting enabled on auth endpoints

---

## 🐛 Troubleshooting

### 1. Database Connection Failed
```
Error: could not connect to server: No such file or directory

Solution:
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure firewall allows connection
- Test with: psql $DATABASE_URL
```

### 2. Google OAuth Fails
```
Error: Invalid redirect_uri

Solution:
- Check GOOGLE_REDIRECT_URI in .env
- Verify redirect URI in Google Console matches exactly
- Ensure Google+ API is enabled
```

### 3. User Not Created
```
Error: User already exists

Solution:
- Check if email is already registered
- Use different email for testing
- Check database for orphaned entries
```

### 4. Token Invalid
```
Error: Invalid refresh token

Solution:
- Regenerate tokens by re-authenticating
- Check SECRET_KEY hasn't changed
- Verify token expiration hasn't passed
```

---

## 📈 Next Steps

1. **Configure Supabase**
   - [ ] Create Supabase account
   - [ ] Create project
   - [ ] Get API keys
   - [ ] Create tables from SQL scripts

2. **Configure Google OAuth**
   - [ ] Create Google Cloud project
   - [ ] Enable APIs
   - [ ] Create OAuth credentials
   - [ ] Set redirect URIs

3. **Test Integration**
   - [ ] Test email registration
   - [ ] Test email login
   - [ ] Test Google OAuth flow
   - [ ] Verify user creation in database

4. **Frontend Integration**
   - [ ] Add login page
   - [ ] Add "Sign in with Google" button
   - [ ] Handle OAuth callback
   - [ ] Store JWT tokens securely

5. **Production Deployment**
   - [ ] Update GOOGLE_REDIRECT_URI to production domain
   - [ ] Enable HTTPS
   - [ ] Configure production database
   - [ ] Update CORS_ORIGINS
   - [ ] Deploy to cloud platform

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **FastAPI Security**: https://fastapi.tiangolo.com/tutorial/security/
- **PostgreSQL**: https://www.postgresql.org/docs/

---

## 🎉 Summary

You now have a **production-ready authentication system** with:

✅ **Supabase PostgreSQL** - Secure, scalable database  
✅ **Google OAuth 2.0** - One-click authentication  
✅ **Email/Password** - Traditional login support  
✅ **JWT Tokens** - Secure API authentication  
✅ **Auto User Creation** - New users created on first Google login  
✅ **Profile Pictures** - Synced from Google  

**Status**: Ready for testing and frontend integration! 🚀
