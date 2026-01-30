from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models import SubscriptionPlanEnum, SubscriptionStatusEnum, RoleEnum


# ============= USER SCHEMAS =============
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr


class UserRegister(UserBase):
    password: str = Field(..., min_length=8, max_length=255)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: RoleEnum
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserDetailResponse(UserResponse):
    updated_at: datetime


# ============= SUBSCRIPTION SCHEMAS =============
class SubscriptionBase(BaseModel):
    plan: SubscriptionPlanEnum
    status: SubscriptionStatusEnum
    is_trial: bool = True


class SubscriptionCreate(BaseModel):
    plan: SubscriptionPlanEnum = SubscriptionPlanEnum.FREE


class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    start_date: datetime
    end_date: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class SubscriptionDetailResponse(SubscriptionResponse):
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    updated_at: datetime


# ============= PAYMENT SCHEMAS =============
class PaymentResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    currency: str
    payment_status: str
    payment_date: datetime
    subscription_month: str
    
    class Config:
        from_attributes = True


class PaymentDetailResponse(PaymentResponse):
    stripe_payment_id: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime


class PaymentCreate(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = "usd"
    subscription_month: str


# ============= FILE SCHEMAS =============
class UploadedFileResponse(BaseModel):
    id: int
    user_id: int
    file_name: str
    file_size: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class UploadedFileDetailResponse(UploadedFileResponse):
    file_path: str
    original_text: Optional[str] = None
    updated_at: datetime


# ============= SUMMARY SCHEMAS =============
class SummaryCreate(BaseModel):
    file_id: int
    summary_length: str = Field("medium", pattern="^(short|medium|long)$")


class SummaryResponse(BaseModel):
    id: int
    user_id: int
    file_id: int
    summary_text: str
    summary_length: str
    processing_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= AUDIO SCHEMAS =============
class AudioFileCreate(BaseModel):
    summary_id: int
    voice_type: str = "default"


class AudioFileResponse(BaseModel):
    id: int
    user_id: int
    summary_id: int
    audio_path: str
    audio_duration: Optional[int] = None
    voice_type: str
    processing_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= ADMIN SCHEMAS =============
class AdminUserStats(BaseModel):
    total_users: int
    free_trial_users: int
    active_subscription_users: int
    expired_subscription_users: int


class AdminRevenueStats(BaseModel):
    total_revenue: float
    monthly_revenue: dict  # {month: amount}
    currency: str = "usd"


class AdminTransactionResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    payment_date: datetime
    subscription_month: str
    payment_status: str
    
    class Config:
        from_attributes = True


# ============= AUTH SCHEMAS =============
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: int
    exp: datetime
    iat: datetime


# ============= ERROR SCHEMAS =============
class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
