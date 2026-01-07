from pydantic import BaseModel, EmailStr
from datetime import datetime
from pydantic import BaseModel, EmailStr
from apscheduler.schedulers.background import BackgroundScheduler
from email_service import send_email

scheduler = BackgroundScheduler()

def start_scheduler():
    scheduler.start()
    print("Reminder scheduler started.")

class EmailRequest(BaseModel):
    email: EmailStr
    subject: str
    message: str

class TaskCreate(BaseModel):
    title: str
    email: EmailStr
    dueDate: datetime
    reminderMinutes: int