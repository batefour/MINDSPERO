#!/usr/bin/env python
"""Initialize database - creates all tables"""

import os
from sqlalchemy import create_engine
from app.database import Base
from app.models import User, Subscription, UploadedFile, Summary, AudioFile, Payment
from app.config import get_settings

settings = get_settings()

# Create engine
engine = create_engine(settings.DATABASE_URL)

# Create all tables
print("Creating database tables...")
Base.metadata.create_all(bind=engine)

print("✓ Database tables created successfully!")
print(f"Database: {settings.DATABASE_URL}")
print(f"\nTables created:")
print("  - users")
print("  - subscriptions")
print("  - uploaded_files")
print("  - summaries")
print("  - audio_files")
print("  - payments")
print("\nYou can now start the application!")
