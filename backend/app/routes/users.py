from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserDetailResponse, SubscriptionResponse, SubscriptionDetailResponse
from app.services import UserService, SubscriptionService
from app.utils.auth import decode_token
from app.models import User

router = APIRouter(prefix="/api/users", tags=["Users"])


def get_current_user(authorization: str = None, db: Session = Depends(get_db)) -> User:
    """Dependency to get current authenticated user"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
        )
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme",
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
        )
    
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return user


@router.get("/me", response_model=UserDetailResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    """Get current user profile"""
    return UserDetailResponse.from_orm(current_user)


@router.get("/{user_id}", response_model=UserDetailResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID (public, limited info)"""
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return UserDetailResponse.from_orm(user)


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete user account (only own account or admin)"""
    if current_user.id != user_id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this user",
        )
    
    success = UserService.delete_user(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return {"message": "User deleted successfully"}


# ============= SUBSCRIPTION ROUTES =============
@router.get("/me/subscription", response_model=SubscriptionDetailResponse)
def get_my_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's subscription details"""
    subscription = SubscriptionService.get_user_subscription(db, current_user.id)
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found",
        )
    return SubscriptionDetailResponse.from_orm(subscription)


@router.get("/{user_id}/subscription-status")
def check_subscription_status(
    user_id: int,
    db: Session = Depends(get_db),
):
    """Check user subscription status"""
    status_result = SubscriptionService.check_subscription_status(db, user_id)
    return {
        "user_id": user_id,
        "subscription_status": status_result,
    }


@router.post("/{user_id}/subscription/cancel")
def cancel_subscription(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel user subscription"""
    if current_user.id != user_id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )
    
    subscription = SubscriptionService.deactivate_subscription(db, user_id)
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )
    
    return {
        "message": "Subscription cancelled",
        "subscription": SubscriptionDetailResponse.from_orm(subscription),
    }


@router.post("/{user_id}/subscription/activate")
def activate_subscription(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Activate user subscription (Admin only)"""
    if current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    
    subscription = SubscriptionService.activate_subscription(db, user_id)
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )
    
    return {
        "message": "Subscription activated",
        "subscription": SubscriptionDetailResponse.from_orm(subscription),
    }
