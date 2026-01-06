import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

msg = EmailMessage()
msg.set_content("Hello")
msg["Subject"] = "Test Email"
msg["From"] = SMTP_EMAIL
msg["To"] = "monisha612003@gmail.com"

with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
    server.ehlo()
    server.starttls()
    server.ehlo()
    server.login(SMTP_EMAIL, SMTP_PASSWORD)
    server.send_message(msg)

print("✅ Email sent successfully")
print(SMTP_EMAIL, SMTP_PASSWORD)
print(SMTP_EMAIL)
print(SMTP_PASSWORD)
def send_email(to_email: str, subject: str, body: str):
    sender_email =SMTP_EMAIL
    app_password = SMTP_PASSWORD
    msg = EmailMessage()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(sender_email, app_password)
        server.send_message(msg)