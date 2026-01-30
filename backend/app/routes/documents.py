from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UploadedFileResponse, SummaryCreate, SummaryResponse
from app.services import SubscriptionService
from app.routes.users import get_current_user
from app.models import User, UploadedFile, Summary
from app.services.ai_service import PDFService, AIService, StorageService
from app.config import get_settings
import os
from datetime import datetime

router = APIRouter(prefix="/api/documents", tags=["PDF & Summaries"])
settings = get_settings()


@router.post("/upload", response_model=UploadedFileResponse, status_code=status.HTTP_201_CREATED)
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a PDF file
    - Extracts text from PDF
    - Stores file for later processing
    """
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )
    
    # Read file
    file_content = await file.read()
    
    # Validate PDF
    try:
        text = PDFService.extract_text_from_pdf(file_content)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    
    # Save file to storage
    upload_dir = f"uploads/{current_user.id}"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{datetime.now().timestamp()}_{file.filename}")
    
    try:
        StorageService.save_file(file_content, file_path)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
    
    # Create database record
    uploaded_file = UploadedFile(
        user_id=current_user.id,
        file_name=file.filename,
        file_path=file_path,
        file_size=len(file_content),
        original_text=text,
    )
    db.add(uploaded_file)
    db.commit()
    db.refresh(uploaded_file)
    
    return UploadedFileResponse.from_orm(uploaded_file)


@router.get("/files", response_model=list[UploadedFileResponse])
def list_user_files(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all uploaded files for current user"""
    files = db.query(UploadedFile).filter(
        UploadedFile.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return [UploadedFileResponse.from_orm(f) for f in files]


@router.post("/summarize", response_model=SummaryResponse, status_code=status.HTTP_201_CREATED)
def create_summary(
    summary_data: SummaryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create AI-powered summary of PDF
    - Free for all users (limited summaries based on subscription)
    - Uses OpenAI GPT for text summarization
    """
    # Get the uploaded file
    uploaded_file = db.query(UploadedFile).filter(
        UploadedFile.id == summary_data.file_id,
        UploadedFile.user_id == current_user.id,
    ).first()
    
    if not uploaded_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )
    
    if not uploaded_file.original_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No text extracted from PDF",
        )
    
    # Generate summary
    try:
        summary_text = AIService.generate_summary(
            uploaded_file.original_text,
            summary_data.summary_length,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
    
    # Create summary record
    summary = Summary(
        user_id=current_user.id,
        file_id=summary_data.file_id,
        summary_text=summary_text,
        summary_length=summary_data.summary_length,
        processing_status="completed",
    )
    db.add(summary)
    db.commit()
    db.refresh(summary)
    
    return SummaryResponse.from_orm(summary)


@router.get("/summaries", response_model=list[SummaryResponse])
def list_user_summaries(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all summaries for current user"""
    summaries = db.query(Summary).filter(
        Summary.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return [SummaryResponse.from_orm(s) for s in summaries]


@router.get("/summaries/{summary_id}", response_model=SummaryResponse)
def get_summary(
    summary_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get specific summary"""
    summary = db.query(Summary).filter(
        Summary.id == summary_id,
        Summary.user_id == current_user.id,
    ).first()
    
    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Summary not found",
        )
    
    return SummaryResponse.from_orm(summary)


@router.delete("/files/{file_id}")
def delete_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete uploaded file and associated summaries"""
    file = db.query(UploadedFile).filter(
        UploadedFile.id == file_id,
        UploadedFile.user_id == current_user.id,
    ).first()
    
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )
    
    # Delete physical file
    StorageService.delete_file(file.file_path)
    
    # Delete from database
    db.delete(file)
    db.commit()
    
    return {"message": "File deleted successfully"}
