import os
from typing import Optional
from PyPDF2 import PdfReader
from io import BytesIO
import openai
from app.config import get_settings
import json
from google.cloud import storage, texttospeech

settings = get_settings()

# Initialize OpenAI
openai.api_key = settings.OPENAI_API_KEY

# Initialize Google Cloud clients
def _get_gcs_client():
    """Initialize Google Cloud Storage client"""
    if settings.GOOGLE_CLOUD_SERVICE_ACCOUNT_JSON:
        return storage.Client.from_service_account_json(
            settings.GOOGLE_CLOUD_SERVICE_ACCOUNT_JSON
        )
    return storage.Client(project=settings.GOOGLE_CLOUD_PROJECT_ID)

def _get_tts_client():
    """Initialize Google Cloud Text-to-Speech client"""
    if settings.GOOGLE_CLOUD_SERVICE_ACCOUNT_JSON:
        return texttospeech.TextToSpeechClient.from_service_account_json(
            settings.GOOGLE_CLOUD_SERVICE_ACCOUNT_JSON
        )
    return texttospeech.TextToSpeechClient()


class PDFService:
    @staticmethod
    def extract_text_from_pdf(pdf_bytes: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PdfReader(BytesIO(pdf_bytes))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    
    @staticmethod
    def get_pdf_page_count(pdf_bytes: bytes) -> int:
        """Get number of pages in PDF"""
        try:
            pdf_reader = PdfReader(BytesIO(pdf_bytes))
            return len(pdf_reader.pages)
        except Exception as e:
            return 0


class AIService:
    @staticmethod
    def generate_summary(text: str, length: str = "medium") -> str:
        """Generate AI-powered summary of text"""
        try:
            # Determine summary length
            length_prompts = {
                "short": "Create a brief 2-3 sentence summary.",
                "medium": "Create a moderate 5-7 sentence summary.",
                "long": "Create a detailed summary covering main points in 10-15 sentences.",
            }
            
            length_instruction = length_prompts.get(length, length_prompts["medium"])
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at creating clear, concise summaries of educational content.",
                    },
                    {
                        "role": "user",
                        "content": f"{length_instruction}\n\nText to summarize:\n\n{text[:4000]}",  # Limit text to avoid token overflow
                    },
                ],
                temperature=0.7,
                max_tokens=1000,
            )
            
            return response.choices[0].message.content
        except Exception as e:
            raise ValueError(f"Failed to generate summary: {str(e)}")
    
    @staticmethod
    def generate_audio_script(summary_text: str) -> str:
        """Generate audio-friendly script from summary"""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at converting text summaries into natural, conversational audio scripts suitable for text-to-speech.",
                    },
                    {
                        "role": "user",
                        "content": f"Convert this summary into a natural audio script that sounds like a tutor explaining the content:\n\n{summary_text}",
                    },
                ],
                temperature=0.7,
                max_tokens=1000,
            )
            
            return response.choices[0].message.content
        except Exception as e:
            raise ValueError(f"Failed to generate audio script: {str(e)}")
    
    @staticmethod
    def generate_audio_from_text(text: str, voice_type: str = "default") -> bytes:
        """Generate audio file from text using Google Cloud Text-to-Speech"""
        try:
            client = _get_tts_client()
            
            # Map voice types to Google Cloud voices
            voice_map = {
                "male": "en-US-Neural2-C",      # Male voice
                "female": "en-US-Neural2-C",    # Female voice (using standard for now)
                "default": "en-US-Neural2-A",   # Default natural voice
            }
            
            voice_name = voice_map.get(voice_type, voice_map["default"])
            
            # Prepare synthesis request
            synthesis_input = texttospeech.SynthesisInput(text=text)
            voice = texttospeech.VoiceSelectionParams(
                language_code="en-US",
                name=voice_name,
                ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
            )
            
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=1.0,  # 1.0 = normal speed
            )
            
            # Generate audio
            response = client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config,
            )
            
            return response.audio_content
        except Exception as e:
            raise ValueError(f"Failed to generate audio: {str(e)}")


class StorageService:
    @staticmethod
    def save_file(file_content: bytes, file_path: str) -> str:
        """Save file to Google Cloud Storage"""
        try:
            client = _get_gcs_client()
            bucket = client.bucket(settings.GOOGLE_CLOUD_STORAGE_BUCKET)
            blob = bucket.blob(file_path)
            
            # Upload to GCS
            blob.upload_from_string(
                file_content,
                content_type="application/octet-stream"
            )
            
            return file_path
        except Exception as e:
            raise ValueError(f"Failed to save file to Google Cloud Storage: {str(e)}")
    
    @staticmethod
    def load_file(file_path: str) -> bytes:
        """Load file from Google Cloud Storage"""
        try:
            client = _get_gcs_client()
            bucket = client.bucket(settings.GOOGLE_CLOUD_STORAGE_BUCKET)
            blob = bucket.blob(file_path)
            
            return blob.download_as_bytes()
        except Exception as e:
            raise ValueError(f"Failed to load file from Google Cloud Storage: {str(e)}")
    
    @staticmethod
    def delete_file(file_path: str) -> bool:
        """Delete file from Google Cloud Storage"""
        try:
            client = _get_gcs_client()
            bucket = client.bucket(settings.GOOGLE_CLOUD_STORAGE_BUCKET)
            blob = bucket.blob(file_path)
            
            blob.delete()
            return True
        except Exception as e:
            return False
