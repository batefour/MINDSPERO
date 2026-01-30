import requests
import hmac
import hashlib
from app.config import get_settings
from sqlalchemy.orm import Session
from app.services import SubscriptionService, PaymentService
from app.models import SubscriptionPlanEnum

settings = get_settings()

# Paystack API endpoints
PAYSTACK_BASE_URL = "https://api.paystack.co"
PAYSTACK_INITIALIZE_TRANSACTION = f"{PAYSTACK_BASE_URL}/transaction/initialize"
PAYSTACK_VERIFY_TRANSACTION = f"{PAYSTACK_BASE_URL}/transaction/verify"
PAYSTACK_CREATE_PLAN = f"{PAYSTACK_BASE_URL}/plan"
PAYSTACK_LIST_PLANS = f"{PAYSTACK_BASE_URL}/plan"
PAYSTACK_CREATE_SUBSCRIPTION = f"{PAYSTACK_BASE_URL}/subscription"


class PaystackService:
    @staticmethod
    def get_headers():
        """Get authorization headers for Paystack API"""
        return {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        }
    
    @staticmethod
    def initialize_payment(email: str, amount: float, plan_name: str = None, reference: str = None) -> dict:
        """Initialize a payment transaction"""
        try:
            payload = {
                "email": email,
                "amount": int(amount * 100),  # Convert to kobo (smallest unit)
                "reference": reference,
            }
            
            if plan_name:
                payload["plan"] = plan_name
            
            response = requests.post(
                PAYSTACK_INITIALIZE_TRANSACTION,
                json=payload,
                headers=PaystackService.get_headers(),
            )
            
            if response.status_code != 200:
                raise ValueError(f"Failed to initialize payment: {response.text}")
            
            return response.json()["data"]
        except Exception as e:
            raise ValueError(f"Failed to initialize payment: {str(e)}")
    
    @staticmethod
    def verify_payment(reference: str) -> dict:
        """Verify a payment transaction"""
        try:
            response = requests.get(
                f"{PAYSTACK_VERIFY_TRANSACTION}/{reference}",
                headers=PaystackService.get_headers(),
            )
            
            if response.status_code != 200:
                raise ValueError(f"Failed to verify payment: {response.text}")
            
            return response.json()["data"]
        except Exception as e:
            raise ValueError(f"Failed to verify payment: {str(e)}")
    
    @staticmethod
    def create_plan(name: str, plan_code: str, amount: float, interval: str) -> dict:
        """
        Create a subscription plan
        interval: "monthly", "quarterly", "biannually", "annually"
        """
        try:
            payload = {
                "name": name,
                "plan_code": plan_code,
                "amount": int(amount * 100),  # Convert to kobo
                "interval": interval,
            }
            
            response = requests.post(
                PAYSTACK_CREATE_PLAN,
                json=payload,
                headers=PaystackService.get_headers(),
            )
            
            if response.status_code != 200:
                raise ValueError(f"Failed to create plan: {response.text}")
            
            return response.json()["data"]
        except Exception as e:
            raise ValueError(f"Failed to create plan: {str(e)}")
    
    @staticmethod
    def get_or_create_plan(name: str, plan_code: str, amount: float, interval: str) -> str:
        """Get existing plan or create new one"""
        try:
            # Try to get existing plans
            response = requests.get(
                f"{PAYSTACK_LIST_PLANS}?perPage=100",
                headers=PaystackService.get_headers(),
            )
            
            if response.status_code == 200:
                plans = response.json()["data"]
                for plan in plans:
                    if plan.get("plan_code") == plan_code:
                        return plan["plan_code"]
            
            # Create new plan if not found
            plan = PaystackService.create_plan(name, plan_code, amount, interval)
            return plan["plan_code"]
        except Exception as e:
            raise ValueError(f"Failed to get or create plan: {str(e)}")
    
    @staticmethod
    def create_subscription(
        email: str,
        plan_code: str,
        authorization_code: str,
        reference: str = None,
    ) -> dict:
        """Create a subscription using authorization code"""
        try:
            payload = {
                "customer": email,
                "plan": plan_code,
                "authorization": authorization_code,
                "reference": reference,
            }
            
            response = requests.post(
                PAYSTACK_CREATE_SUBSCRIPTION,
                json=payload,
                headers=PaystackService.get_headers(),
            )
            
            if response.status_code != 200:
                raise ValueError(f"Failed to create subscription: {response.text}")
            
            return response.json()["data"]
        except Exception as e:
            raise ValueError(f"Failed to create subscription: {str(e)}")
    
    @staticmethod
    def verify_webhook_signature(payload: str, signature: str) -> bool:
        """Verify Paystack webhook signature"""
        try:
            hash_signature = hmac.new(
                settings.PAYSTACK_SECRET_KEY.encode(),
                payload.encode(),
                hashlib.sha512,
            ).hexdigest()
            
            return hash_signature == signature
        except Exception as e:
            print(f"Failed to verify webhook: {str(e)}")
            return False
    
    @staticmethod
    def handle_charge_success(db: Session, event_data: dict):
        """Handle successful charge from webhook"""
        try:
            customer_email = event_data.get("customer", {}).get("email")
            amount = event_data.get("amount") / 100  # Convert from kobo to naira
            reference = event_data.get("reference")
            authorization = event_data.get("authorization", {})
            
            # Record payment
            PaymentService.record_payment(
                db,
                user_id=None,  # You'll need to look up user by email
                amount=amount,
                paystack_reference=reference,
            )
            
            return True
        except Exception as e:
            print(f"Error handling charge success: {str(e)}")
            return False
    
    @staticmethod
    def handle_subscription_create(db: Session, event_data: dict):
        """Handle subscription creation from webhook"""
        try:
            subscription_code = event_data.get("subscription_code")
            customer_email = event_data.get("customer", {}).get("email")
            plan_code = event_data.get("plan", {}).get("plan_code")
            
            # Update subscription in database
            return True
        except Exception as e:
            print(f"Error handling subscription create: {str(e)}")
            return False
    
    @staticmethod
    def handle_subscription_disable(db: Session, event_data: dict):
        """Handle subscription cancellation from webhook"""
        try:
            subscription_code = event_data.get("subscription_code")
            
            # Mark subscription as cancelled in database
            return True
        except Exception as e:
            print(f"Error handling subscription disable: {str(e)}")
            return False
