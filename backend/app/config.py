from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    # App
    APP_NAME: str = "MindSpero"
    API_VERSION: str = "v1"
    DEBUG: bool = False
    
    # Database (Supabase PostgreSQL)
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/postgres"
    SQLALCHEMY_ECHO: bool = False
    
    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"
    
    # Paystack
    PAYSTACK_SECRET_KEY: str = ""
    PAYSTACK_PUBLIC_KEY: str = ""
    PAYSTACK_WEBHOOK_URL: str = ""
    PAYSTACK_WEBHOOK_SECRET: str = ""
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Google Cloud Storage
    GOOGLE_CLOUD_PROJECT_ID: str = ""
    GOOGLE_CLOUD_STORAGE_BUCKET: str = "mindspero-files"
    GOOGLE_CLOUD_SERVICE_ACCOUNT_JSON: str = ""
    
    # AWS S3 (deprecated - using Google Cloud instead)
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_S3_BUCKET_NAME: str = "ai-education-platform"
    AWS_REGION: str = "us-east-1"
    
    # Email
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8081", "http://localhost:8000"]
    
    # Trial Settings
    TRIAL_DAYS: int = 30
    FREE_SUMMARY_LIMIT: int = 5
    BONUS_TRIAL_DAYS: int = 30  # Extra month for paid subscription
    
    class Config:
        # Load .env located in the backend folder regardless of cwd
        env_file = str(Path(__file__).resolve().parent.parent / ".env")
        env_file_encoding = "utf-8"
        extra = "allow"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
