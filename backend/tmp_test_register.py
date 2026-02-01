import os
import sys

# Remove known extraneous env vars that cause pydantic Settings validation errors
for k in [
    'vite_public_builder_key',
    'ping_message',
]:
    os.environ.pop(k, None)

print('vite_public_builder_key after pop:', os.environ.get('vite_public_builder_key'))
print('ping_message after pop:', os.environ.get('ping_message'))

# Use a local sqlite DB for testing
os.environ['DATABASE_URL'] = 'sqlite:///./backend_test.db'

from app.config import get_settings
from sqlalchemy import create_engine

from app.database import Base, SessionLocal

settings = get_settings()
print('Using DATABASE_URL:', settings.DATABASE_URL)

# Import models so they are registered with SQLAlchemy's Base metadata
import app.models  # noqa: F401

# Create engine and tables
engine = create_engine(settings.DATABASE_URL, echo=True)
Base.metadata.create_all(bind=engine)

# Run a test user creation
from app.services import UserService

# Create a DB session
db = SessionLocal()

try:
    user = UserService.create_user(db, name='Test User', email='testuser@example.com', password='password123')
    print('Created user:', user.id, user.email)
except Exception as e:
    print('Error during create_user:', e)
    sys.exit(1)
finally:
    db.close()

print('Done')
