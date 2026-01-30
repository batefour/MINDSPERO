from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AdminUserStats, AdminRevenueStats, AdminTransactionResponse, UserDetailResponse
from app.services import PaymentService, AnalyticsService, UserService, SubscriptionService
from app.routes.users import get_current_user
from app.models import User, RoleEnum
from datetime import datetime

router = APIRouter(prefix="/api/admin", tags=["Admin"])


def verify_admin(current_user: User = Depends(get_current_user)):
    """Verify user is admin"""
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


# ============= USER MANAGEMENT =============
@router.get("/users", response_model=list[UserDetailResponse])
def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Get all registered users (Admin only)"""
    users = UserService.get_all_users(db, skip, limit)
    return [UserDetailResponse.from_orm(u) for u in users]


@router.get("/users/filter", response_model=list[UserDetailResponse])
def filter_users_by_status(
    status: str = Query(..., regex="^(free_trial|active|expired)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Filter users by subscription status (Admin only)"""
    users = AnalyticsService.filter_users_by_status(db, status, skip, limit)
    return [UserDetailResponse.from_orm(u) for u in users]


@router.delete("/users/{user_id}")
def admin_delete_user(
    user_id: int,
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Delete user (Admin only)"""
    success = UserService.delete_user(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return {"message": "User deleted successfully"}


# ============= ANALYTICS =============
@router.get("/stats/users", response_model=AdminUserStats)
def get_user_statistics(
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Get user statistics (Admin only)"""
    stats = AnalyticsService.get_user_stats(db)
    return AdminUserStats(**stats)


@router.get("/stats/revenue", response_model=AdminRevenueStats)
def get_revenue_statistics(
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Get revenue statistics (Admin only)"""
    total_revenue = PaymentService.get_total_revenue(db)
    monthly_revenue = PaymentService.get_monthly_revenue(db)
    
    return AdminRevenueStats(
        total_revenue=total_revenue,
        monthly_revenue=monthly_revenue,
        currency="usd",
    )


# ============= PAYMENT MANAGEMENT =============
@router.get("/payments", response_model=list[AdminTransactionResponse])
def get_all_payments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Get all payment transactions (Admin only)"""
    payments = PaymentService.get_all_payments(db, skip, limit)
    return [AdminTransactionResponse.from_orm(p) for p in payments]


@router.get("/payments/{user_id}", response_model=list[AdminTransactionResponse])
def get_user_payments(
    user_id: int,
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Get all payments for specific user (Admin only)"""
    payments = PaymentService.get_user_payments(db, user_id)
    return [AdminTransactionResponse.from_orm(p) for p in payments]


# ============= SUBSCRIPTION MANAGEMENT =============
@router.post("/subscriptions/{user_id}/activate")
def admin_activate_subscription(
    user_id: int,
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Activate user subscription manually (Admin only)"""
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    subscription = SubscriptionService.activate_subscription(db, user_id)
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )
    
    return {
        "message": "Subscription activated",
        "subscription": {
            "id": subscription.id,
            "status": subscription.status.value,
            "plan": subscription.plan.value,
        },
    }


@router.post("/subscriptions/{user_id}/deactivate")
def admin_deactivate_subscription(
    user_id: int,
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Deactivate user subscription manually (Admin only)"""
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    subscription = SubscriptionService.deactivate_subscription(db, user_id)
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )
    
    return {
        "message": "Subscription deactivated",
        "subscription": {
            "id": subscription.id,
            "status": subscription.status.value,
            "plan": subscription.plan.value,
        },
    }


# ============= REVENUE ANALYTICS =============
@router.get("/analytics/monthly-revenue")
def get_monthly_revenue_breakdown(
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Get detailed monthly revenue breakdown (Admin only)"""
    monthly_revenue = PaymentService.get_monthly_revenue(db)
    return {
        "breakdown": monthly_revenue,
        "total": sum(monthly_revenue.values()),
        "months": len(monthly_revenue),
    }


@router.get("/analytics/subscription-growth")
def get_subscription_growth(
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Get subscription growth metrics (Admin only)"""
    stats = AnalyticsService.get_user_stats(db)
    return {
        "total_users": stats["total_users"],
        "subscribed_users": stats["active_subscription_users"],
        "trial_users": stats["free_trial_users"],
        "conversion_rate": (
            stats["active_subscription_users"] / stats["total_users"] * 100
            if stats["total_users"] > 0
            else 0
        ),
    }
