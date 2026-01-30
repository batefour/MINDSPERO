"""
Google OAuth Service
Handles Google authentication and user management
"""

import httpx
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.config import get_settings
from app.models import User
from app.services import UserService


class GoogleOAuthService:
    """Service for Google OAuth integration"""
    
    GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"
    
    def __init__(self):
        self.settings = get_settings()
        self.client_id = self.settings.GOOGLE_CLIENT_ID
        self.client_secret = self.settings.GOOGLE_CLIENT_SECRET
        self.redirect_uri = self.settings.GOOGLE_REDIRECT_URI
    
    def get_authorization_url(self, state: str) -> str:
        """
        Generate Google OAuth authorization URL
        
        Args:
            state: CSRF token for state validation
            
        Returns:
            Authorization URL to redirect user to
        """
        scope = "openid email profile"
        auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={self.client_id}&"
            f"redirect_uri={self.redirect_uri}&"
            f"response_type=code&"
            f"scope={scope}&"
            f"state={state}&"
            f"access_type=offline"
        )
        return auth_url
    
    async def exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """
        Exchange authorization code for access token
        
        Args:
            code: Authorization code from Google
            
        Returns:
            Dictionary with token and user info
            
        Raises:
            Exception: If token exchange fails
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.GOOGLE_TOKEN_URL,
                data={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": self.redirect_uri,
                },
            )
            response.raise_for_status()
            return response.json()
    
    async def get_user_info(self, access_token: str) -> Dict[str, Any]:
        """
        Get user information from Google
        
        Args:
            access_token: Google access token
            
        Returns:
            User information (email, name, picture, etc.)
            
        Raises:
            Exception: If request fails
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            response.raise_for_status()
            return response.json()
    
    async def authenticate_or_create_user(
        self, code: str, db: Session
    ) -> Optional[User]:
        """
        Authenticate user with Google or create new user if doesn't exist
        
        Args:
            code: Google authorization code
            db: Database session
            
        Returns:
            User object if successful, None otherwise
        """
        try:
            # Exchange code for token
            token_response = await self.exchange_code_for_token(code)
            access_token = token_response.get("access_token")
            
            if not access_token:
                return None
            
            # Get user info from Google
            user_info = await self.get_user_info(access_token)
            
            email = user_info.get("email")
            name = user_info.get("name", email.split("@")[0])
            picture = user_info.get("picture")
            
            if not email:
                return None
            
            # Check if user exists
            existing_user = UserService.get_user_by_email(db, email)
            
            if existing_user:
                # Update picture if changed
                if picture and not existing_user.google_picture:
                    existing_user.google_picture = picture
                    db.commit()
                return existing_user
            
            # Create new user with Google OAuth
            new_user = User(
                name=name,
                email=email,
                password_hash=None,  # No password for OAuth users
                google_picture=picture,
                is_active=True,
                role="user",
            )
            
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            # Create free trial subscription
            UserService.create_user_subscription(db, new_user.id)
            
            return new_user
            
        except Exception as e:
            print(f"Google OAuth error: {str(e)}")
            return None
