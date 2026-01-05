from fastapi import APIRouter
from pydantic import BaseModel
from email.message import EmailMessage
import smtplib
import ssl

reminder_router = APIRouter()

class Reminder(BaseModel):
    email: str
    title: str
    reminderTime: str


def send_email(to_email: str, subject: str, body: str):
    sender_email = "monisha612003@gmail.com"
    app_password = "ramjowoadmsfpjpd"

    msg = EmailMessage()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, app_password)
        server.send_message(msg)


@reminder_router.post("/email")
def send_reminder(reminder: Reminder):
    send_email(
        reminder.email,
        "⏰ Task Reminder",
        f"""
Hello 👋

This is a reminder for your task:

📝 Task: {reminder.title}
⏰ Reminder Time: {reminder.reminderTime}

Stay productive 🚀
"""
    )
    return {"message": "Reminder email sent successfully"}
