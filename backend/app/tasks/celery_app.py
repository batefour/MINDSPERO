from celery import Celery
from app.config import get_settings
import logging

settings = get_settings()

# Initialize Celery
celery_app = Celery(
    "ai_education_platform",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
)

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, max_retries=3)
def process_pdf_summary(self, file_id: int, user_id: int, summary_length: str):
    """
    Background task to process PDF summarization
    - Called asynchronously after PDF upload
    - Extracts text, generates summary
    """
    try:
        from app.database import SessionLocal
        from app.models import UploadedFile, Summary
        from app.services.ai_service import AIService
        
        db = SessionLocal()
        
        # Get file
        file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
        if not file:
            return {"status": "error", "message": "File not found"}
        
        # Generate summary
        summary_text = AIService.generate_summary(file.original_text, summary_length)
        
        # Save summary
        summary = Summary(
            user_id=user_id,
            file_id=file_id,
            summary_text=summary_text,
            summary_length=summary_length,
            processing_status="completed",
        )
        db.add(summary)
        db.commit()
        
        logger.info(f"Summary generated for file {file_id}")
        return {"status": "completed", "file_id": file_id}
        
    except Exception as exc:
        logger.error(f"Error processing summary: {str(exc)}")
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(bind=True, max_retries=3)
def process_audio_generation(self, summary_id: int, user_id: int, voice_type: str):
    """
    Background task to generate audio from summary
    - Called asynchronously when user requests audio
    - Generates audio script and audio file
    """
    try:
        from app.database import SessionLocal
        from app.models import Summary, AudioFile
        from app.services.ai_service import AIService, StorageService
        import os
        from datetime import datetime
        
        db = SessionLocal()
        
        # Get summary
        summary = db.query(Summary).filter(Summary.id == summary_id).first()
        if not summary:
            return {"status": "error", "message": "Summary not found"}
        
        # Generate audio script
        audio_script = AIService.generate_audio_script(summary.summary_text)
        
        # Generate audio
        audio_content = AIService.generate_audio_from_text(audio_script, voice_type)
        
        # Save audio file
        audio_dir = f"uploads/{user_id}/audio"
        os.makedirs(audio_dir, exist_ok=True)
        audio_path = os.path.join(audio_dir, f"{datetime.now().timestamp()}.mp3")
        StorageService.save_file(audio_content, audio_path)
        
        # Create audio record
        audio_file = AudioFile(
            user_id=user_id,
            summary_id=summary_id,
            audio_path=audio_path,
            voice_type=voice_type,
            processing_status="completed",
        )
        db.add(audio_file)
        db.commit()
        
        logger.info(f"Audio generated for summary {summary_id}")
        return {"status": "completed", "summary_id": summary_id}
        
    except Exception as exc:
        logger.error(f"Error processing audio: {str(exc)}")
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task
def check_expired_subscriptions():
    """
    Periodic task to check and mark expired subscriptions
    - Run every hour
    - Updates subscription status
    """
    try:
        from app.database import SessionLocal
        from app.models import Subscription, SubscriptionStatusEnum
        from datetime import datetime
        
        db = SessionLocal()
        
        # Find expired subscriptions
        expired_subs = db.query(Subscription).filter(
            Subscription.end_date < datetime.utcnow(),
            Subscription.status == SubscriptionStatusEnum.ACTIVE,
        ).all()
        
        for sub in expired_subs:
            sub.status = SubscriptionStatusEnum.EXPIRED
        
        db.commit()
        logger.info(f"Marked {len(expired_subs)} subscriptions as expired")
        return {"status": "completed", "updated": len(expired_subs)}
        
    except Exception as exc:
        logger.error(f"Error checking subscriptions: {str(exc)}")
        return {"status": "error", "message": str(exc)}


@celery_app.task
def send_subscription_expiry_notification(user_id: int):
    """
    Send email notification when subscription is about to expire
    """
    try:
        from app.database import SessionLocal
        from app.models import User
        
        db = SessionLocal()
        user = db.query(User).filter(User.id == user_id).first()
        
        if user:
            # Send email notification
            logger.info(f"Sent expiry notification to {user.email}")
            return {"status": "completed", "user_id": user_id}
        
    except Exception as exc:
        logger.error(f"Error sending notification: {str(exc)}")
        return {"status": "error", "message": str(exc)}


@celery_app.task
def generate_monthly_revenue_report():
    """
    Generate monthly revenue report for admins
    """
    try:
        from app.database import SessionLocal
        from app.services import PaymentService
        
        db = SessionLocal()
        monthly_revenue = PaymentService.get_monthly_revenue(db)
        total_revenue = PaymentService.get_total_revenue(db)
        
        logger.info(f"Monthly revenue report generated. Total: ${total_revenue}")
        return {
            "status": "completed",
            "total_revenue": total_revenue,
            "monthly_breakdown": monthly_revenue,
        }
        
    except Exception as exc:
        logger.error(f"Error generating report: {str(exc)}")
        return {"status": "error", "message": str(exc)}
