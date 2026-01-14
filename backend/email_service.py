import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Ensure these match your .env file keys exactly
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

def send_email(to_email: str, subject: str, message: str):
    """
    Send an email using SMTP with STARTTLS for Port 587.
    """
    try:
        # 1. Validation: Ensure credentials exist
        if not SMTP_USER or not SMTP_PASS:
            raise Exception("SMTP credentials missing in .env")

        # 2. Construct the Email
        msg = EmailMessage()
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.set_content(message)

        # 3. Connect and Send (Properly indented)
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.starttls()  # Upgrade connection to secure
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)

        print(f"✅ Email sent to {to_email}")

    except smtplib.SMTPAuthenticationError:
        print("❌ Auth Error: Check if you are using a 'Gmail App Password'.")
        raise Exception("SMTP Authentication failed.")
    except Exception as e:
        print(f"❌ Error details: {e}")
        raise Exception(f"Failed to send email: {e}")