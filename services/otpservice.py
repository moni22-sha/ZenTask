import os
import smtplib
from email.message import EmailMessage

def send_email(to_email: str, subject: str, body: str) -> bool:
    try:
        msg = EmailMessage()
        msg["From"] = os.getenv("SMTP_EMAIL")
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.set_content(body)

        with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as server:
            server.starttls()
            server.login(
                os.getenv("SMTP_EMAIL"),
                os.getenv("SMTP_PASSWORD")
            )
            server.send_message(msg)

        print("✅ Email sent successfully")
        return True

    except Exception as e:
        print("❌ SMTP Error:", e)
        return False
