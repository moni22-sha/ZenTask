from pickle import APPEND
from fastapi import FastAPI, HTTPException
from admin import admin_router
from task import task_router
from scheduler import start_scheduler
from reminder_service import router as reminder_router
from email_service import send_email   # ✅ ONLY import send_email
from reminder_service import router as reminder_router

APPEND.include_router(reminder_router)

from dotenv import load_dotenv
import traceback

# ✅ Load environment variables
load_dotenv()

app = FastAPI()

# ✅ Include routers
app.include_router(reminder_router)
app.include_router(admin_router)
app.include_router(task_router)

# ✅ Start scheduler on startup
@app.on_event("startup")
def startup_event():
    start_scheduler()

# ✅ Root endpoint
@app.get("/")
def root():
    return {"status": "API running"}

# ✅ Email test API (RENAMED FUNCTION)
@app.post("/email/test")
def email_test_api(data: dict):
    try:
        to_email = data["to_email"]
        subject = data["subject"]
        message = data["message"]
    except KeyError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Missing field: {e.args[0]}"
        )

    try:
        send_email(to_email, subject, message)
        return {"message": "Email sent successfully"}
    except Exception as e:
        print("Error sending email:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
