# backend/reminder_service.py
from apscheduler.schedulers.background import BackgroundScheduler
from email_service import send_email  # Your email sending function
from database.db import get_db  # Function to get SQLite connection
from datetime import datetime
from fastapi import APIRouter

# FastAPI router
router = APIRouter()

@router.get("/reminders")
def get_reminders():
    """
    Simple test endpoint to ensure the router works.
    """
    return {"message": "Reminder endpoint active"}

# Scheduler instance
scheduler = BackgroundScheduler()

def check_reminders():
    """
    Check the database every minute for pending reminders
    and send emails.
    """
    db = get_db()
    cursor = db.cursor()

    # Ensure the cursor returns dict-like rows for easier access
    cursor.row_factory = lambda cursor, row: {
        "user_email": row[0],
        "title": row[1]
    }

    # Fetch reminders that are due and not yet sent
    cursor.execute("""
        SELECT user_email, title
        FROM reminders
        WHERE reminder_time <= datetime('now')
        AND sent = 0
    """)
    reminders = cursor.fetchall()

    for r in reminders:
        try:
            send_email(
                r["user_email"],
                "Task Reminder",
                f"Reminder: {r['title']}"
            )
            # Mark reminder as sent
            cursor.execute(
                "UPDATE reminders SET sent = 1 WHERE user_email = ? AND title = ?",
                (r["user_email"], r["title"])
            )
        except Exception as e:
            print(f"Failed to send reminder to {r['user_email']}: {e}")

    db.commit()
    db.close()

def start_scheduler():
    """
    Start APScheduler to run check_reminders every minute.
    """
    # Prevent duplicate jobs if called multiple times
    if not scheduler.get_jobs():
        scheduler.add_job(check_reminders, "interval", minutes=1, id="reminder_job")
        scheduler.start()
        print("Reminder scheduler started.")
