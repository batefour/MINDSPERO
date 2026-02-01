#!/usr/bin/env python3
"""
Setup ngrok tunnel for Paystack webhook testing
"""
from pyngrok import ngrok

# Connect ngrok to port 8000
public_url = ngrok.connect(8000)
print(f"\n{'='*60}")
print(f"🌐 PUBLIC NGROK URL: {public_url}")
print(f"{'='*60}")
print(f"\n📝 Use this URL in Paystack Webhook Settings:")
print(f"   {public_url}/api/paystack/webhook")
print(f"\n⏸️  Press Ctrl+C to stop the tunnel")
print(f"{'='*60}\n")

# Keep the tunnel open
ngrok_process = ngrok.get_ngrok_process()
ngrok_process.proc.wait()
