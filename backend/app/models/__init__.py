from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Enum, ForeignKey, Text, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
from app.database import Base


class RoleEnum(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class SubscriptionStatusEnum(str, enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    TRIAL = "trial"


class SubscriptionPlanEnum(str, enum.Enum):
    FREE = "free"
    MONTHLY = "monthly"
    YEARLY = "yearly"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)  # Nullable for OAuth users
    role = Column(Enum(RoleEnum), default=RoleEnum.USER)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Google OAuth
    google_id = Column(String(255), unique=True, nullable=True, index=True)
    google_picture = Column(String(500), nullable=True)
    
    # Relationships (cascade deletes when user is removed)
    subscriptions = relationship(
        "Subscription",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    uploaded_files = relationship(
        "UploadedFile",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    summaries = relationship(
        "Summary",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    audio_files = relationship(
        "AudioFile",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    payments = relationship(
        "Payment",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan = Column(Enum(SubscriptionPlanEnum), default=SubscriptionPlanEnum.FREE)
    status = Column(Enum(SubscriptionStatusEnum), default=SubscriptionStatusEnum.TRIAL)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), nullable=True)
    is_trial = Column(Boolean, default=True)
    paystack_customer_code = Column(String(255), nullable=True)
    paystack_subscription_code = Column(String(255), nullable=True, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")


class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer)  # In bytes
    original_text = Column(Text, nullable=True)  # Extracted PDF text
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="uploaded_files")
    summaries = relationship(
        "Summary",
        back_populates="uploaded_file",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Summary(Base):
    __tablename__ = "summaries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_id = Column(Integer, ForeignKey("uploaded_files.id", ondelete="CASCADE"), nullable=False)
    summary_text = Column(Text, nullable=False)
    summary_length = Column(String(50))  # short, medium, long
    processing_status = Column(String(50), default="completed")  # pending, processing, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="summaries")
    uploaded_file = relationship("UploadedFile", back_populates="summaries")
    audio_files = relationship(
        "AudioFile",
        back_populates="summary",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class AudioFile(Base):
    __tablename__ = "audio_files"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    summary_id = Column(Integer, ForeignKey("summaries.id", ondelete="CASCADE"), nullable=False)
    audio_path = Column(String(512), nullable=False)
    audio_duration = Column(Integer, nullable=True)  # Duration in seconds
    voice_type = Column(String(50), default="default")  # default, male, female, etc.
    processing_status = Column(String(50), default="pending")  # pending, processing, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="audio_files")
    summary = relationship("Summary", back_populates="audio_files")


class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    paystack_reference = Column(String(255), nullable=True, unique=True)
    amount = Column(Float, nullable=False)  # In kobo (100 kobo = 1 naira)
    currency = Column(String(10), default="NGN")
    payment_status = Column(String(50), default="pending")  # pending, completed, failed
    payment_date = Column(DateTime(timezone=True), server_default=func.now())
    subscription_month = Column(String(20))  # YYYY-MM format
    description = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="payments")
