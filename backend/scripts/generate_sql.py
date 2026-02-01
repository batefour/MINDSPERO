#!/usr/bin/env python3
"""
Generate SQL schema statements to run in Supabase SQL editor.

This script prints the DDL statements needed to create all tables in Supabase.
You can copy-paste the output into:
  Supabase Dashboard → SQL Editor → New Query → paste & run
"""
import sys
import os

# Add backend to path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.config import get_settings
from app.database import Base
from sqlalchemy import create_engine
from sqlalchemy.schema import CreateTable
from sqlalchemy.dialects import postgresql

# Import models to register them with Base
import app.models  # noqa: F401

def generate_sql():
    """Generate DDL for all models."""
    for table in Base.metadata.sorted_tables:
        # Generate PostgreSQL-specific CREATE TABLE statement
        create_stmt = CreateTable(table).compile(dialect=postgresql.dialect())
        print(str(create_stmt) + ";")
        print()

if __name__ == "__main__":
    print("=" * 80)
    print("SQL Schema for Supabase - Copy/Paste into Supabase SQL Editor")
    print("=" * 80)
    print()
    generate_sql()
    print("=" * 80)
    print("After running the above SQL in Supabase, you can:")
    print("  - Register users via: POST /api/auth/register")
    print("  - Create admins via: python backend/scripts/create_admin.py")
    print("=" * 80)
