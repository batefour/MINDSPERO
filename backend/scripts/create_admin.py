#!/usr/bin/env python3
"""Create an admin user in the configured database.

Usage:
  ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=strongpass python scripts/create_admin.py
Or pass args:
  python scripts/create_admin.py admin@example.com strongpass
"""
import os
import sys
from app.config import get_settings
from app.database import SessionLocal
from app.services import UserService
from app.models import RoleEnum

settings = get_settings()

if __name__ == "__main__":
    if len(sys.argv) >= 3:
        email = sys.argv[1]
        password = sys.argv[2]
        name = sys.argv[3] if len(sys.argv) >= 4 else "Administrator"
    else:
        email = os.getenv("ADMIN_EMAIL")
        password = os.getenv("ADMIN_PASSWORD")
        name = os.getenv("ADMIN_NAME", "Administrator")

    if not email or not password:
        print("Provide admin email and password via args or ADMIN_EMAIL/ADMIN_PASSWORD env vars")
        sys.exit(1)

    db = SessionLocal()
    try:
        existing = UserService.get_user_by_email(db, email)
        if existing:
            print(f"User with email {email} already exists (id={existing.id})")
            sys.exit(0)

        admin = UserService.create_user(db, name=name, email=email, password=password, role=RoleEnum.ADMIN)
        print(f"Created admin user: id={admin.id}, email={admin.email}")
    except Exception as e:
        print("Error creating admin:", e)
        sys.exit(1)
    finally:
        db.close()
