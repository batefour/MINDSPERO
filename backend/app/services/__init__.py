from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models import User, Subscription, SubscriptionStatusEnum, SubscriptionPlanEnum, Payment
from app.utils.auth import hash_password, verify_password
from app.config import get_settings
from sqlalchemy import func

settings = get_settings()


class UserService:
    @staticmethod
    def create_user(db: Session, name: str, email: str, password: str) -> User:
        """Create a new user with free trial subscription"""
        user = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
        )
        db.add(user)
        db.flush()
        
        # Create free trial subscription
        trial_end = datetime.utcnow() + timedelta(days=settings.TRIAL_DAYS)
        subscription = Subscription(
            user_id=user.id,
            plan=SubscriptionPlanEnum.FREE,
            status=SubscriptionStatusEnum.TRIAL,
            start_date=datetime.utcnow(),
            end_date=trial_end,
            is_trial=True,
        )
        db.add(subscription)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """Authenticate user with email and password"""
        user = UserService.get_user_by_email(db, email)
        if not user or not verify_password(password, user.password_hash):
            return None
        return user
    
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> list:
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """Delete user and all related data"""
        user = UserService.get_user_by_id(db, user_id)
        if user:
            db.delete(user)
            db.commit()
            return True
        return False


class SubscriptionService:
    @staticmethod
    def get_user_subscription(db: Session, user_id: int) -> Subscription:
        """Get active subscription for user"""
        return db.query(Subscription).filter(
            Subscription.user_id == user_id
        ).order_by(Subscription.created_at.desc()).first()
    
    @staticmethod
    def upgrade_to_paid(
        db: Session,
        user_id: int,
        plan: SubscriptionPlanEnum,
        paystack_customer_code: str,
        paystack_subscription_code: str,
    ) -> Subscription:
        """Upgrade user to paid subscription with bonus month"""
        # Calculate end date based on plan
        if plan == SubscriptionPlanEnum.MONTHLY:
            duration = timedelta(days=30)
        else:  # YEARLY
            duration = timedelta(days=365)
        
        # Add bonus trial month
        end_date = datetime.utcnow() + duration + timedelta(days=settings.BONUS_TRIAL_DAYS)
        
        subscription = Subscription(
            user_id=user_id,
            plan=plan,
            status=SubscriptionStatusEnum.ACTIVE,
            start_date=datetime.utcnow(),
            end_date=end_date,
            is_trial=False,
            paystack_customer_code=paystack_customer_code,
            paystack_subscription_code=paystack_subscription_code,
        )
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
        return subscription
    
    @staticmethod
    def check_subscription_status(db: Session, user_id: int) -> str:
        """Check if user has active subscription"""
        subscription = SubscriptionService.get_user_subscription(db, user_id)
        
        if not subscription:
            return "no_subscription"
        
        if subscription.status == SubscriptionStatusEnum.ACTIVE:
            if subscription.end_date and datetime.utcnow() > subscription.end_date:
                # Mark as expired
                subscription.status = SubscriptionStatusEnum.EXPIRED
                db.commit()
                return "expired"
            return "active"
        
        if subscription.status == SubscriptionStatusEnum.TRIAL:
            if subscription.end_date and datetime.utcnow() > subscription.end_date:
                subscription.status = SubscriptionStatusEnum.EXPIRED
                db.commit()
                return "expired"
            return "trial"
        
        return subscription.status.value
    
    @staticmethod
    def deactivate_subscription(db: Session, user_id: int) -> Subscription:
        """Deactivate user subscription"""
        subscription = SubscriptionService.get_user_subscription(db, user_id)
        if subscription:
            subscription.status = SubscriptionStatusEnum.CANCELLED
            db.commit()
            db.refresh(subscription)
        return subscription
    
    @staticmethod
    def activate_subscription(db: Session, user_id: int) -> Subscription:
        """Activate user subscription (Admin)"""
        subscription = SubscriptionService.get_user_subscription(db, user_id)
        if subscription:
            subscription.status = SubscriptionStatusEnum.ACTIVE
            subscription.end_date = datetime.utcnow() + timedelta(days=30)
            db.commit()
            db.refresh(subscription)
        return subscription


class PaymentService:
    @staticmethod
    def record_payment(
        db: Session,
        user_id: int,
        amount: float,
        paystack_reference: str = None,
        subscription_month: str = None,
    ) -> Payment:
        """Record a payment transaction"""
        if not subscription_month:
            subscription_month = datetime.utcnow().strftime("%Y-%m")
        
        payment = Payment(
            user_id=user_id,
            amount=amount,
            paystack_reference=paystack_reference,
            payment_status="completed",
            subscription_month=subscription_month,
            currency="NGN",
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment
    
    @staticmethod
    def get_user_payments(db: Session, user_id: int) -> list:
        """Get all payments for a user"""
        return db.query(Payment).filter(Payment.user_id == user_id).all()
    
    @staticmethod
    def get_all_payments(db: Session, skip: int = 0, limit: int = 100) -> list:
        """Get all payments (Admin)"""
        return db.query(Payment).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_total_revenue(db: Session) -> float:
        """Calculate total subscription revenue"""
        result = db.query(func.sum(Payment.amount)).filter(
            Payment.payment_status == "completed"
        ).scalar()
        return result or 0.0
    
    @staticmethod
    def get_monthly_revenue(db: Session) -> dict:
        """Get monthly revenue breakdown"""
        payments = db.query(
            Payment.subscription_month,
            func.sum(Payment.amount).label("total")
        ).filter(Payment.payment_status == "completed").group_by(
            Payment.subscription_month
        ).all()
        
        return {month: total for month, total in payments}


class AnalyticsService:
    @staticmethod
    def get_user_stats(db: Session) -> dict:
        """Get user statistics"""
        total_users = db.query(func.count(User.id)).scalar()
        
        # Count by subscription status
        free_trial = db.query(func.count(User.id)).join(Subscription).filter(
            Subscription.status == SubscriptionStatusEnum.TRIAL
        ).scalar()
        
        active_sub = db.query(func.count(User.id)).join(Subscription).filter(
            Subscription.status == SubscriptionStatusEnum.ACTIVE
        ).scalar()
        
        expired_sub = db.query(func.count(User.id)).join(Subscription).filter(
            Subscription.status == SubscriptionStatusEnum.EXPIRED
        ).scalar()
        
        return {
            "total_users": total_users,
            "free_trial_users": free_trial or 0,
            "active_subscription_users": active_sub or 0,
            "expired_subscription_users": expired_sub or 0,
        }
    
    @staticmethod
    def filter_users_by_status(
        db: Session,
        status: str,
        skip: int = 0,
        limit: int = 100,
    ) -> list:
        """Filter users by subscription status"""
        if status == "free_trial":
            status_enum = SubscriptionStatusEnum.TRIAL
        elif status == "active":
            status_enum = SubscriptionStatusEnum.ACTIVE
        elif status == "expired":
            status_enum = SubscriptionStatusEnum.EXPIRED
        else:
            return []
        
        return db.query(User).join(Subscription).filter(
            Subscription.status == status_enum
        ).offset(skip).limit(limit).all()
