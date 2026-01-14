import smtplib
import os
from email.message import EmailMessage

def send_email(to_email, subject, content):
    msg = EmailMessage()
    msg.set_content(content)
    msg['Subject'] = subject
    msg['From'] = os.getenv("SMTP_EMAIL")
    msg['To'] = to_email

    try:
        # Port 587 is required for starttls()
        with smtplib.SMTP(os.getenv("SMTP_HOST"), 587) as server:
            server.starttls() 
            server.login(os.getenv("SMTP_EMAIL"), os.getenv("SMTP_PASSWORD"))
            server.send_message(msg)
            return True
    except Exception as e:
        print(f"SMTP Error: {e}")
        return False

