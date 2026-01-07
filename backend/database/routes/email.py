from fastapi import APIRouter, HTTPException
from schemas import ReminderEmailRequest
from email_service import send_email

router = APIRouter(prefix="/email", tags=["Email"])

@router.post("/send-reminder")
def send_reminder(data: ReminderEmailRequest):
    try:
        send_email(data.email, data.subject, data.message)
        return {"status": "success", "message": "Email sent"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
