# Paystack Webhook Setup - Complete Guide

## Step 1: Get Your Supabase Database Password

You need to retrieve your PostgreSQL password from Supabase:

1. Go to **Supabase Console** → Your project
2. Click **Settings** → **Database**
3. Look for the database connection string section
4. Find your PostgreSQL password (it's shown when you copy the connection string)
5. Update `.env` with the password:

```
DATABASE_URL=postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.xlmyrawojjitympyubny.supabase.co:5432/postgres
```

Replace `YOUR_SUPABASE_PASSWORD` with your actual Supabase password.

---

## Step 2: Start Your Backend Server

```bash
cd /workspaces/MINDSPERO/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Wait for the server to start (you should see "Uvicorn running on http://0.0.0.0:8000")

---

## Step 3: Create an ngrok Tunnel

In a **new terminal window**, run:

```bash
cd /workspaces/MINDSPERO
python setup_ngrok.py
```

This will output a URL like:
```
🌐 PUBLIC NGROK URL: https://abc123def456.ngrok.io
```

Copy this URL.

---

## Step 4: Configure Paystack Webhook

1. Go to **Paystack Dashboard** → **Settings** → **API Keys & Webhooks**
2. Scroll to **Webhooks** section
3. In **Test Webhook URL** field, enter:
   ```
   https://YOUR_NGROK_URL/api/paystack/webhook
   ```
   (Replace `YOUR_NGROK_URL` with the URL from Step 3)

4. Select webhook events:
   - ✅ charge.success
   - ✅ subscription.create
   - ✅ subscription.disable

5. Click **Save**

After saving, Paystack will **display your webhook secret** - it looks like: `whsec_xxxxx`

---

## Step 5: Add Webhook Secret to .env

Copy the webhook secret from Paystack and update `.env`:

```
PAYSTACK_WEBHOOK_SECRET=whsec_your_secret_from_paystack
PAYSTACK_WEBHOOK_URL=https://YOUR_NGROK_URL/api/paystack/webhook
```

---

## Step 6: Verify Everything Works

1. **Backend should be running** (from Step 2)
2. **ngrok tunnel should be active** (from Step 3)
3. **Paystack webhook should show in dashboard** (from Step 4)
4. **Test webhook** by going to Paystack → Settings → Webhooks → Click the three dots next to your webhook → Send test

If everything is configured correctly, your backend will receive the test webhook!

---

## Environment Variables Summary

Here's what needs to be in your `.env`:

```dotenv
# Database (with your actual Supabase password)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xlmyrawojjitympyubny.supabase.co:5432/postgres

# Supabase (already configured in .env)
SUPABASE_URL=https://xlmyrawojjitympyubny.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Paystack (will be filled in after Step 4 & 5)
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_WEBHOOK_URL=https://YOUR_NGROK_URL/api/paystack/webhook
PAYSTACK_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

---

## Troubleshooting

**Backend won't start?**
- Check that Supabase password is correct in DATABASE_URL
- Ensure all environment variables are set in .env

**ngrok tunnel offline?**
- The tunnel times out after a period. Re-run `python setup_ngrok.py` if needed
- Paystack will still work with the original URL during the session

**Webhook not working?**
- Verify the webhook URL in Paystack matches your ngrok URL
- Check backend logs for webhook errors
- Ensure PAYSTACK_WEBHOOK_SECRET is set correctly

---

## Quick Reference

- Backend: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`
- Webhook endpoint: `POST /api/paystack/webhook`
- Paystack Dashboard: https://dashboard.paystack.com
