from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AudioFileCreate, AudioFileResponse, SubscriptionDetailResponse
from app.services import SubscriptionService
from app.routes.users import get_current_user
from app.models import User, AudioFile, Summary, SubscriptionStatusEnum
from app.services.ai_service import AIService, StorageService
from app.services.stripe_service import PaystackService
from app.config import get_settings
import os
from datetime import datetime
import json

router = APIRouter(prefix="/api", tags=["Audio & Payments"])
settings = get_settings()


# ============= AUDIO ROUTES =============
@router.post("/audio/generate", response_model=AudioFileResponse, status_code=status.HTTP_201_CREATED)
async def generate_audio(
    audio_data: AudioFileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Generate audio explanation from summary
    - Requires active subscription
    - Creates natural voice explanation of summary
    """
    # Check subscription status
    subscription = SubscriptionService.get_user_subscription(db, current_user.id)
    if not subscription or subscription.status != SubscriptionStatusEnum.ACTIVE:
        if not (subscription and subscription.status == SubscriptionStatusEnum.TRIAL):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Active subscription required for audio features",
            )
    
    # Get the summary
    summary = db.query(Summary).filter(
        Summary.id == audio_data.summary_id,
        Summary.user_id == current_user.id,
    ).first()
    
    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Summary not found",
        )
    
    # Generate audio script
    try:
        audio_script = AIService.generate_audio_script(summary.summary_text)
        audio_content = AIService.generate_audio_from_text(audio_script, audio_data.voice_type)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
    
    # Save audio file
    audio_dir = f"uploads/{current_user.id}/audio"
    os.makedirs(audio_dir, exist_ok=True)
    audio_path = os.path.join(audio_dir, f"{datetime.now().timestamp()}.mp3")
    
    try:
        StorageService.save_file(audio_content, audio_path)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
    
    # Create audio record
    audio_file = AudioFile(
        user_id=current_user.id,
        summary_id=audio_data.summary_id,
        audio_path=audio_path,
        voice_type=audio_data.voice_type,
        processing_status="completed",
    )
    db.add(audio_file)
    db.commit()
    db.refresh(audio_file)
    
    return AudioFileResponse.from_orm(audio_file)


@router.get("/audio", response_model=list[AudioFileResponse])
def list_user_audio(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all audio files for current user"""
    audio_files = db.query(AudioFile).filter(
        AudioFile.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return [AudioFileResponse.from_orm(a) for a in audio_files]


@router.delete("/audio/{audio_id}")
def delete_audio(
    audio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete audio file"""
    audio = db.query(AudioFile).filter(
        AudioFile.id == audio_id,
        AudioFile.user_id == current_user.id,
    ).first()
    
    if not audio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found",
        )
    
    # Delete physical file
    StorageService.delete_file(audio.audio_path)
    
    # Delete from database
    db.delete(audio)
    db.commit()
    
    return {"message": "Audio file deleted successfully"}


# ============= SUBSCRIPTION PAYMENT ROUTES =============
@router.post("/subscription/initialize-payment")
def initialize_payment(
    plan: str = Query(..., regex="^(monthly|yearly)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Initialize Paystack payment for subscription upgrade
    - Returns authorization URL and payment details
    """
    # Define plan amounts (in Naira)
    plans = {
        "monthly": {"name": "Monthly Plan", "amount": 2499, "code": "PLN_monthly"},
        "yearly": {"name": "Yearly Plan", "amount": 24999, "code": "PLN_yearly"},
    }
    
    plan_info = plans.get(plan)
    if not plan_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan",
        )
    
    try:
        # Create or get plan
        plan_code = PaystackService.get_or_create_plan(
            plan_info["name"],
            plan_info["code"],
            plan_info["amount"] / 100,  # Convert to naira
            "monthly" if plan == "monthly" else "annually",
        )
        
        # Initialize payment
        payment_data = PaystackService.initialize_payment(
            email=current_user.email,
            amount=plan_info["amount"] / 100,  # Convert to naira
            plan_name=plan_code,
            reference=f"subscription_{current_user.id}_{plan}_{datetime.now().timestamp()}",
        )
        
        return {
            "authorization_url": payment_data["authorization_url"],
            "access_code": payment_data["access_code"],
            "reference": payment_data["reference"],
            "plan": plan,
            "amount": plan_info["amount"] / 100,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("/subscription/verify-payment/{reference}", response_model=SubscriptionDetailResponse)
def verify_payment(
    reference: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Verify Paystack payment and upgrade subscription
    """
    try:
        # Verify payment with Paystack
        payment_data = PaystackService.verify_payment(reference)
        
        if payment_data["status"] != "success":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment verification failed",
            )
        
        # Extract plan from reference
        ref_parts = reference.split("_")
        plan = ref_parts[2] if len(ref_parts) > 2 else "monthly"
        
        # Update subscription
        from app.models import SubscriptionPlanEnum
        plan_enum = SubscriptionPlanEnum.MONTHLY if plan == "monthly" else SubscriptionPlanEnum.YEARLY
        
        subscription = SubscriptionService.upgrade_to_paid(
            db,
            current_user.id,
            plan_enum,
            reference,  # Use reference as customer code
            payment_data.get("authorization", {}).get("authorization_code", reference),
        )
        
        # Record payment
        from app.services import PaymentService
        PaymentService.record_payment(
            db,
            current_user.id,
            payment_data["amount"] / 100,  # Convert from kobo to naira
            paystack_reference=reference,
        )
        
        return SubscriptionDetailResponse.from_orm(subscription)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("/paystack/webhook")
async def paystack_webhook(request):
    """
    Handle Paystack webhook events
    - charge.success
    - subscription.create
    - subscription.disable
    """
    payload = await request.body()
    sig_header = request.headers.get("x-paystack-signature")
    
    # Verify webhook signature
    if not PaystackService.verify_webhook_signature(payload.decode(), sig_header):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook signature",
        )
    
    event = json.loads(payload)
    event_type = event.get("event")
    event_data = event.get("data", {})
    
    # Handle different event types
    if event_type == "charge.success":
        PaystackService.handle_charge_success(db, event_data)
    elif event_type == "subscription.create":
        PaystackService.handle_subscription_create(db, event_data)
    elif event_type == "subscription.disable":
        PaystackService.handle_subscription_disable(db, event_data)
    
    return {"received": True}
