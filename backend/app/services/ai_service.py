import os
from typing import Optional
from PyPDF2 import PdfReader
from io import BytesIO
import openai
from app.config import get_settings

settings = get_settings()

# Initialize OpenAI
openai.api_key = settings.OPENAI_API_KEY


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
        """Generate audio file from text using TTS"""
        try:
            # Using OpenAI TTS API (Whisper API is for STT)
            # For actual implementation, consider using Google Cloud TTS or AWS Polly
            response = openai.Audio.transcriptions.create(
                model="whisper-1",
                file=BytesIO(text.encode()),
            )
            
            # Fallback: Using pyttsx3 for local generation
            import pyttsx3
            engine = pyttsx3.init()
            
            if voice_type == "male":
                engine.setProperty("voice", engine.getProperty("voices")[0].id)
            elif voice_type == "female":
                engine.setProperty("voice", engine.getProperty("voices")[1].id)
            
            engine.setProperty("rate", 150)  # Speed of speech
            
            # Save to temporary file
            temp_path = "/tmp/audio_temp.mp3"
            engine.save_to_file(text, temp_path)
            engine.runAndWait()
            
            with open(temp_path, "rb") as f:
                audio_bytes = f.read()
            
            os.remove(temp_path)
            return audio_bytes
        except Exception as e:
            raise ValueError(f"Failed to generate audio: {str(e)}")


class StorageService:
    @staticmethod
    def save_file(file_content: bytes, file_path: str) -> str:
        """Save file locally or to cloud storage (S3)"""
        try:
            # For now, saving locally
            # In production, integrate with AWS S3 or similar
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "wb") as f:
                f.write(file_content)
            return file_path
        except Exception as e:
            raise ValueError(f"Failed to save file: {str(e)}")
    
    @staticmethod
    def load_file(file_path: str) -> bytes:
        """Load file from storage"""
        try:
            with open(file_path, "rb") as f:
                return f.read()
        except Exception as e:
            raise ValueError(f"Failed to load file: {str(e)}")
    
    @staticmethod
    def delete_file(file_path: str) -> bool:
        """Delete file from storage"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
            return True
        except Exception as e:
            return False
