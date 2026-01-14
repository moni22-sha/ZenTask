# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv
import os
import traceback

# -----------------------------
# Routers (your other routers)
# -----------------------------
from admin import admin_router
from task import task_router
from reminder_service import router as reminder_router
from scheduler import start_scheduler
from email_service import send_email

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Zentask Pro")

# -----------------------------
# CORS middleware
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Include routers
# -----------------------------
app.include_router(admin_router, prefix="/admin", tags=["admin"])
app.include_router(task_router, prefix="/tasks", tags=["tasks"])
app.include_router(reminder_router, prefix="/reminders", tags=["reminders"])

# -----------------------------
# Scheduler startup
# -----------------------------
@app.on_event("startup")
def startup_event():
    start_scheduler()

# -----------------------------
# Root endpoint
# -----------------------------
@app.get("/")
def root():
    return {"status": "API running"}

# -----------------------------
# Email test API
# -----------------------------
class EmailTestRequest(BaseModel):
    to_email: EmailStr
    subject: str
    message: str
    reminderTime: str

@app.post("/email/test")
def email_test_api(data: EmailTestRequest):
    try:
        send_email(data.to_email, data.subject, data.message)
        return {"success": True, "message": "Email sent successfully"}
    except Exception as e:
        print("Email error:\n", traceback.format_exc())
        # Safe fallback: print email instead of sending
        return {"success": False, "message": f"Email failed to send: {e}"}

# -----------------------------
# Reminder Email API
# -----------------------------
class ReminderRequest(BaseModel):
    task_id: str = Field(..., alias="taskId")
    email: EmailStr
    title: str
    reminder_time: str = Field(..., alias="reminderTime")

    class Config:
        allow_population_by_field_name = True

@app.post("/email/reminders")
def send_email_reminder(req: ReminderRequest):
    try:
        subject = f"⏰ Reminder: {req.title}"
        message = f"""
Hello 👋

This is a reminder for your task:

📌 Task: {req.title}
⏱ Time: {req.reminder_time}

— Zentask Pro
"""
        send_email(req.email, subject, message)
        return {"success": True, "message": "Reminder email sent successfully"}
    except Exception as e:
        print("🔥 EMAIL ERROR:", traceback.format_exc())
        # Safe fallback: return error details
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")

