from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import APIRouter
from pydantic import BaseModel
from database.db import get_db, init_db
from email_service import send_email  # your email sending function
from datetime import datetime

# Initialize database table
init_db()

# FastAPI router
router = APIRouter()

# Scheduler instance
scheduler = BackgroundScheduler()
scheduler.start()

# --- Pydantic model ---
class ReminderCreate(BaseModel):
    user_email: str
    title: str
    reminder_time: datetime  # ISO format string

# --- GET reminders ---
@router.get("/reminders")
def get_reminders():
    db = get_db()
    cursor = db.cursor()

    cursor.row_factory = lambda cursor, row: {
        "id": row[0],
        "user_email": row[1],
        "title": row[2],
        "reminder_time": row[3],
        "sent": row[4]
    }

    cursor.execute("SELECT id, user_email, title, reminder_time, sent FROM reminders")
    reminders = cursor.fetchall()
    db.close()
    return {"reminders": reminders}

# --- POST create reminder ---
@router.post("/reminders")
def create_reminder(reminder: ReminderCreate):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO reminders (user_email, title, reminder_time, sent) VALUES (?, ?, ?, 0)",
            (reminder.user_email, reminder.title, reminder.reminder_time.isoformat())
        )
        db.commit()
        db.close()
        return {"message": "Reminder created successfully", "reminder": reminder.dict()}
    except Exception as e:
        return {"error": str(e)}

# --- Scheduler job ---
def check_reminders():
    db = get_db()
    cursor = db.cursor()

    cursor.row_factory = lambda cursor, row: {
        "id": row[0],
        "user_email": row[1],
        "title": row[2]
    }

    cursor.execute("""
        SELECT id, user_email, title
        FROM reminders
        WHERE reminder_time <= datetime('now')
        AND sent = 0
    """)

    reminders_due = cursor.fetchall()

    for r in reminders_due:
        try:
            send_email(
                r["user_email"],
                "Task Reminder",
                f"Reminder: {r['title']}"
            )
            cursor.execute("UPDATE reminders SET sent = 1 WHERE id = ?", (r["id"],))
            print(f"Reminder sent to {r['user_email']} for task '{r['title']}'")
        except Exception as e:
            print(f"Failed to send reminder to {r['user_email']}: {e}")

    db.commit()
    db.close()

# --- Start scheduler ---
def start_scheduler():
    if not scheduler.get_jobs():
        scheduler.add_job(check_reminders, "interval", minutes=1, id="reminder_job")
        print("Reminder scheduler started.")

# Start scheduler automatically
start_scheduler()




