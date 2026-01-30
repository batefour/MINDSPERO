from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserRegister, UserLogin, UserResponse, TokenResponse
from app.services import UserService
from app.services.google_oauth_service import GoogleOAuthService
from app.utils.auth import create_tokens
from app.models import User
import secrets
import json

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
google_service = GoogleOAuthService()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user with email and password
    - Creates user with free trial (1 month)
    - Returns JWT tokens
    """
    # Check if user already exists
    existing_user = UserService.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create user
    user = UserService.create_user(
        db,
        name=user_data.name,
        email=user_data.email,
        password=user_data.password,
    )
    
    # Generate tokens
    tokens = create_tokens(user.id)
    
    return {
        **tokens,
        "user": UserResponse.from_orm(user),
    }


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password
    - Returns JWT tokens for authenticated user
    """
    user = UserService.authenticate_user(db, credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )
    
    # Generate tokens
    tokens = create_tokens(user.id)
    
    return {
        **tokens,
        "user": UserResponse.from_orm(user),
    }


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(token: str):
    """
    Refresh access token using refresh token
    """
    from app.utils.auth import decode_token
    
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    tokens = create_tokens(user_id)
    return {
        **tokens,
        "user": {"id": user_id},
    }


@router.get("/google/authorize")
def google_authorize():
    """
    Get Google OAuth authorization URL
    - Returns authorization URL and state for CSRF protection
    """
    state = secrets.token_urlsafe(32)
    auth_url = google_service.get_authorization_url(state)
    
    return {
        "authorization_url": auth_url,
        "state": state,
    }


@router.post("/google/callback")
async def google_callback(
    code: str = Query(...),
    state: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Handle Google OAuth callback
    - Exchange authorization code for tokens
    - Create or authenticate user
    - Returns JWT tokens
    """
    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing authorization code",
        )
    
    try:
        # Authenticate or create user
        user = await google_service.authenticate_or_create_user(code, db)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Failed to authenticate with Google",
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated",
            )
        
        # Generate JWT tokens
        tokens = create_tokens(user.id)
        
        return {
            **tokens,
            "user": UserResponse.from_orm(user),
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google authentication failed: {str(e)}",
        )


@router.get("/me")
def get_current_user(
    current_user: User = Depends(lambda token: token),  # Will be implemented with dependency
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user profile
    """
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return UserResponse.from_orm(user)
