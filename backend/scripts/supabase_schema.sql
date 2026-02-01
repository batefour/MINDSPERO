-- ============================================================================
-- MindSpero Database Schema for Supabase (CLEAN SLATE)
-- ============================================================================
-- WARNING: This script drops ALL existing tables and enums, then recreates them.
-- Run this script in Supabase SQL Editor:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Click "New Query"
-- 3. Copy-paste this entire script
-- 4. Click "Run"
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP ALL EXISTING TABLES (in reverse dependency order)
-- ============================================================================
DROP TABLE IF EXISTS audio_files CASCADE;
DROP TABLE IF EXISTS summaries CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS uploaded_files CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- STEP 2: DROP ALL EXISTING ENUM TYPES
-- ============================================================================
DROP TYPE IF EXISTS subscriptionstatusenum CASCADE;
DROP TYPE IF EXISTS subscriptionplanenum CASCADE;
DROP TYPE IF EXISTS roleenum CASCADE;

-- ============================================================================
-- STEP 3: CREATE ENUM TYPES
-- ============================================================================
CREATE TYPE roleenum AS ENUM ('user', 'admin');
CREATE TYPE subscriptionplanenum AS ENUM ('free', 'monthly', 'yearly');
CREATE TYPE subscriptionstatusenum AS ENUM ('active', 'expired', 'cancelled', 'trial');

-- ============================================================================
-- STEP 4: CREATE USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role roleenum DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    google_id VARCHAR(255) UNIQUE,
    google_picture VARCHAR(500)
);

CREATE INDEX ix_users_email ON users(email);
CREATE INDEX ix_users_google_id ON users(google_id);
CREATE INDEX ix_users_id ON users(id);

-- ============================================================================
-- STEP 5: CREATE SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan subscriptionplanenum DEFAULT 'free',
    status subscriptionstatusenum DEFAULT 'trial',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    end_date TIMESTAMP WITH TIME ZONE,
    is_trial BOOLEAN DEFAULT true,
    paystack_customer_code VARCHAR(255),
    paystack_subscription_code VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX ix_subscriptions_id ON subscriptions(id);

-- ============================================================================
-- STEP 6: CREATE UPLOADED FILES TABLE
-- ============================================================================
CREATE TABLE uploaded_files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size INTEGER,
    original_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX ix_uploaded_files_id ON uploaded_files(id);

-- ============================================================================
-- STEP 7: CREATE SUMMARIES TABLE
-- ============================================================================
CREATE TABLE summaries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_id INTEGER NOT NULL REFERENCES uploaded_files(id) ON DELETE CASCADE,
    summary_text TEXT NOT NULL,
    summary_length VARCHAR(50),
    processing_status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX ix_summaries_id ON summaries(id);

-- ============================================================================
-- STEP 8: CREATE AUDIO FILES TABLE
-- ============================================================================
CREATE TABLE audio_files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    summary_id INTEGER NOT NULL REFERENCES summaries(id) ON DELETE CASCADE,
    audio_path VARCHAR(512) NOT NULL,
    audio_duration INTEGER,
    voice_type VARCHAR(50) DEFAULT 'default',
    processing_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX ix_audio_files_id ON audio_files(id);

-- ============================================================================
-- STEP 9: CREATE PAYMENTS TABLE
-- ============================================================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    paystack_reference VARCHAR(255) UNIQUE,
    amount FLOAT NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    subscription_month VARCHAR(20),
    description VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX ix_payments_id ON payments(id);

-- ============================================================================
-- SCHEMA CREATION COMPLETE
-- ============================================================================
-- All tables created successfully!
-- You can now:
-- 1. Register users: POST /api/auth/register
-- 2. Login: POST /api/auth/login
-- 3. Create admin: python backend/scripts/create_admin.py
-- ============================================================================
