import os
import smtplib
from email.message import EmailMessage
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# -----------------------------
# Logging
# -----------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Email Reminder API")

# -----------------------------
# Scheduler
# -----------------------------
scheduler = BackgroundScheduler()
scheduler.start()

# -----------------------------
# Email sending function
# -----------------------------
def send_email(to_email: str, subject: str, message: str):
    try:
        if not all([SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD]):
            raise ValueError("SMTP configuration is incomplete")

        msg = EmailMessage()
        msg["From"] = SMTP_EMAIL
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.set_content(message)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)

        logger.info(f"Email successfully sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")

# -----------------------------
# Pydantic model for Reminder
# -----------------------------
class Reminder(BaseModel):
    email: EmailStr
    subject: str
    message: str
    send_at: datetime | None = None  # Optional scheduled time

# -----------------------------
# Immediate email endpoint
# -----------------------------
@app.post("/email/test")
def email_test(reminder: Reminder):
    """
    Test sending an immediate email.
    """
    try:
        send_email(reminder.email, reminder.subject, reminder.message)
        return {"status": "success", "message": f"Email sent to {reminder.email}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------
# Send reminder endpoint
# -----------------------------
@app.post("/send-reminder")
def send_reminder(reminder: Reminder, background_tasks: BackgroundTasks):
    """
    Schedule or immediately send a reminder email.
    """
    try:
        send_time = reminder.send_at or datetime.utcnow()

        if send_time > datetime.utcnow():
            # Schedule future email with APScheduler
            scheduler.add_job(
                send_email,
                'date',
                run_date=send_time,
                args=[reminder.email, reminder.subject, reminder.message],
                id=f"reminder_{reminder.email}_{send_time.timestamp()}",
                replace_existing=True
            )
            logger.info(f"Reminder scheduled for {reminder.email} at {send_time}")
            return {
                "status": "success",
                "message": f"Reminder scheduled for {reminder.email} at {send_time}"
            }
        else:
            # Send immediately in background
            background_tasks.add_task(send_email, reminder.email, reminder.subject, reminder.message)
            logger.info(f"Reminder sent immediately to {reminder.email}")
            return {
                "status": "success",
                "message": f"Reminder sent immediately to {reminder.email}"
            }

    except Exception as e:
        logger.error(f"Failed to schedule/send reminder: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to schedule/send reminder")

# -----------------------------
# Root endpoint
# -----------------------------
@app.get("/")
def root():
    return {"status": "API running"}

