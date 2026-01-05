from fastapi import APIRouter, HTTPException
from email_service import send_email

router = APIRouter()

@router.post("/reminder/send")
def send_reminder(data: dict):
    email = data.get("email")
    title = data.get("title")
    reminder_time = data.get("reminderTime")

    if not email:
        raise HTTPException(
            status_code=400,
            detail="User email missing"
        )

    send_email(
        to=email,
        subject="⏰ Task Reminder",
        body=f"Reminder: {title} is due soon!"
    )

    return {"message": "Reminder email sent successfully"}
