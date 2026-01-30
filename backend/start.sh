#!/bin/bash
# Startup script for AI Education Platform Backend

set -e

echo "Starting AI Education Platform Backend..."

# Create necessary directories
mkdir -p uploads
mkdir -p logs

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Install dependencies
echo "Installing dependencies..."
pip install -q -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env from template..."
    cp .env.example .env
    echo "Please update .env with your actual credentials!"
fi

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
python -c "
import time
import os
from sqlalchemy import create_engine

db_url = os.getenv('DATABASE_URL', 'postgresql://user:password@localhost:5432/ai_education')
for i in range(30):
    try:
        engine = create_engine(db_url)
        engine.connect()
        print('✓ PostgreSQL is ready')
        break
    except:
        print(f'Waiting for PostgreSQL... ({i+1}/30)')
        time.sleep(1)
else:
    print('✗ PostgreSQL connection timeout')
    exit(1)
"

# Wait for Redis
echo "Waiting for Redis..."
python -c "
import time
import redis

for i in range(30):
    try:
        r = redis.Redis(host='localhost', port=6379, socket_connect_timeout=5)
        r.ping()
        print('✓ Redis is ready')
        break
    except:
        print(f'Waiting for Redis... ({i+1}/30)')
        time.sleep(1)
else:
    print('⚠ Redis not available (optional for development)')
"

# Initialize database
echo "Initializing database..."
python app/database.py

echo ""
echo "================================================"
echo "AI Education Platform Backend Ready!"
echo "================================================"
echo ""
echo "Starting services..."
echo ""
echo "1. FastAPI Server (port 8000)"
echo "   http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo ""
echo "2. Start Celery Worker (in another terminal):"
echo "   celery -A app.tasks.celery_app worker --loglevel=info"
echo ""
echo "3. Start Celery Beat (in another terminal):"
echo "   celery -A app.tasks.celery_app beat --loglevel=info"
echo ""

# Start FastAPI server
echo "Starting FastAPI server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
