# Quick Reference - Supabase & Google OAuth

## 🚀 Get Started in 5 Minutes

### Step 1: Get Supabase Credentials
```bash
# Go to https://supabase.com
# Create project → Note these values:
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsbXlyYXdvamppdHltcHl1Ym55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3Mzk1OTcsImV4cCI6MjA4NTMxNTU5N30._Hmu8fRcmHmSOn9m8bmVEZ9rJw8YJC-YZuPALW65UcM
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres
```

### Step 2: Get Google OAuth Credentials
```bash
# Go to https://console.cloud.google.com
# Create project → Enable Google+ API → Create OAuth credentials
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### Step 3: Update .env
```bash
cd backend
cp .env.example .env

# Edit .env:
# - DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres
# - SUPABASE_URL=https://...supabase.co
# - SUPABASE_ANON_KEY=...
# - SUPABASE_SERVICE_ROLE_KEY=...
# - GOOGLE_CLIENT_ID=...
# - GOOGLE_CLIENT_SECRET=...
```

### Step 4: Create Database Tables
```bash
# In Supabase Dashboard → SQL Editor → Run this:
# (Copy from SUPABASE_SETUP.md "Create Tables" section)
```

### Step 5: Start Backend
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Step 6: Test It
```bash
# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Pass123!"}'

# Get Google auth URL
curl http://localhost:8000/api/auth/google/authorize
```

---

## 📊 API Endpoints Quick Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register with email | ❌ No |
| POST | `/api/auth/login` | Login with email | ❌ No |
| GET | `/api/auth/google/authorize` | Get Google login URL | ❌ No |
| POST | `/api/auth/google/callback` | Handle Google callback | ❌ No |
| POST | `/api/auth/refresh` | Refresh access token | ❌ No |
| GET | `/api/auth/me` | Get current user | ✅ Yes |

---

## 🔑 Environment Variables Checklist

```bash
# Database (Required)
✓ DATABASE_URL
✓ SUPABASE_URL
✓ SUPABASE_ANON_KEY
✓ SUPABASE_SERVICE_ROLE_KEY

# Google OAuth (Optional, for OAuth users)
✓ GOOGLE_CLIENT_ID
✓ GOOGLE_CLIENT_SECRET
✓ GOOGLE_REDIRECT_URI

# JWT (Required)
✓ SECRET_KEY
✓ ALGORITHM (default: HS256)
✓ ACCESS_TOKEN_EXPIRE_MINUTES (default: 30)
✓ REFRESH_TOKEN_EXPIRE_DAYS (default: 7)

# Other (Existing)
✓ PAYSTACK_SECRET_KEY
✓ PAYSTACK_PUBLIC_KEY
✓ OPENAI_API_KEY
✓ REDIS_URL
✓ AWS_ACCESS_KEY_ID
✓ AWS_SECRET_ACCESS_KEY
```

---

## 🧪 Test Commands

### Register New User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Response includes:
# {
#   "access_token": "...",
#   "refresh_token": "...",
#   "user": { ... }
# }
```

### Get Current User
```bash
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_REFRESH_TOKEN"
  }'
```

### Get Google Authorization URL
```bash
curl http://localhost:8000/api/auth/google/authorize

# Response:
# {
#   "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
#   "state": "..."
# }
```

---

## 📁 Files Changed

### New Files Created
- `app/services/google_oauth_service.py` - Google OAuth integration
- `SUPABASE_SETUP.md` - Detailed setup instructions
- `SUPABASE_GOOGLE_OAUTH_SETUP.md` - Complete integration guide
- `QUICK_REFERENCE.md` - This file

### Files Updated
- `app/config.py` - Added Supabase & Google OAuth settings
- `app/models/__init__.py` - Added Google OAuth fields to User model
- `app/routes/auth.py` - Added Google OAuth endpoints
- `requirements.txt` - Added new dependencies
- `.env.example` - Updated with new variables

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `database connection refused` | Supabase not running | Check DATABASE_URL, test with psql |
| `GOOGLE_CLIENT_ID not configured` | Missing env var | Add GOOGLE_CLIENT_ID to .env |
| `Invalid redirect_uri` | Mismatch in Google Console | Verify GOOGLE_REDIRECT_URI matches exactly |
| `User already exists` | Email already registered | Use different email for testing |
| `Invalid token` | Token expired or SECRET_KEY changed | Re-authenticate to get new token |
| `CORS error` | Frontend URL not whitelisted | Add to CORS_ORIGINS in config.py |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SUPABASE_SETUP.md` | **START HERE** - Step-by-step setup guide |
| `SUPABASE_GOOGLE_OAUTH_SETUP.md` | Complete integration reference |
| `QUICK_REFERENCE.md` | This file - Quick commands |
| `.env.example` | Environment variables template |

---

## 🎯 Next: Frontend Integration

Once backend is running, integrate with React:

### 1. Login Page
```tsx
<button onClick={() => window.location.href = '/api/auth/google/authorize'}>
  Sign in with Google
</button>
```

### 2. Handle Callback
```tsx
// In callback route, get tokens from response
const { access_token, refresh_token } = response;
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);
```

### 3. Protected Requests
```tsx
const response = await fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
```

---

## ✅ Deployment Checklist

Before going to production:

- [ ] Change `DEBUG=False` in .env
- [ ] Set strong `SECRET_KEY` (32+ chars)
- [ ] Update `GOOGLE_REDIRECT_URI` to production domain
- [ ] Enable HTTPS
- [ ] Update `CORS_ORIGINS` to production domain
- [ ] Configure production database
- [ ] Set up database backups
- [ ] Enable monitoring and alerts
- [ ] Test payment webhooks
- [ ] Configure rate limiting

---

## 🚀 Deploy Command

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations (if using Alembic)
alembic upgrade head

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## 📞 Need Help?

- **Supabase Issues**: https://supabase.com/docs
- **Google OAuth Issues**: https://developers.google.com/identity/protocols/oauth2
- **FastAPI Issues**: https://fastapi.tiangolo.com/
- **Database Issues**: https://www.postgresql.org/docs/

**All setup documented in SUPABASE_SETUP.md** ✨
