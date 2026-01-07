from fastapi import APIRouter, Depends
from database.db import get_db

admin_router = APIRouter(prefix="/admin", tags=["Admin"])

@admin_router.get("/reminders")
def get_reminders(db = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT user_email, title, reminder_time FROM reminders
    """)
    reminders = cursor.fetchall()

    return {
        "reminders": [
            {
                "user_email": r["user_email"],
                "title": r["title"],
                "reminder_time": r["reminder_time"]
            }
            for r in reminders
        ]
    }
