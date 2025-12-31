import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Ensure the path to .env.local is correct if it's in the root
load_dotenv(".env.local") 

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_email(to_email, subject, body):
    # Validation to ensure variables are loaded
    if not all([SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD]):
        print("Error: Environment variables not loaded correctly.")
        return

    msg = MIMEMultipart()
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        # Use with statement to ensure the connection closes
        with smtplib.SMTP(SMTP_HOST, int(SMTP_PORT)) as server:
            server.set_debuglevel(1)  # THIS IS KEY: It shows the logs in your terminal
            server.starttls() 
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
            print(f"✅ Email successfully sent to {to_email}")
    except Exception as e:
        print(f"❌ Error sending email: {e}")