# email_service.py
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# Check if SMTP credentials are loaded
if not SMTP_EMAIL or not SMTP_PASSWORD:
    raise RuntimeError("❌ SMTP_EMAIL or SMTP_PASSWORD not set in .env file")

def send_email(to_email: str, subject: str, body: str):
    """Send an email using Gmail SMTP"""
    msg = EmailMessage()
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()  # Secure connection
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
