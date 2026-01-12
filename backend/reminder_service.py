from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from database.db import get_db, init_db
from email_service import send_email
from datetime import datetime

# Initialize database
init_db()

router = APIRouter()

# Scheduler
scheduler = BackgroundScheduler()
scheduler.start()

# ✅ FIXED schema (MATCHES FRONTEND)
class ReminderCreate(BaseModel):
    task_id: int
    to_email: EmailStr
    remind_at: datetime


# ---------------- GET reminders ----------------
@router.get("/reminders")
def get_reminders():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT id, task_id, user_email, title, reminder_time, sent
        FROM reminders
    """)

    rows = cursor.fetchall()
    db.close()

    return {"reminders": rows}


# ---------------- POST reminder (ONLY ONE) ----------------
@router.post("/reminders")
def create_reminder(reminder: ReminderCreate):
    try:
        db = get_db()
        cursor = db.cursor()

        # 🔹 Fetch task title using task_id
        cursor.execute("SELECT title FROM tasks WHERE id = ?", (reminder.task_id,))
        task = cursor.fetchone()

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        title = task[0]

        cursor.execute(
            """
            INSERT INTO reminders (task_id, user_email, title, reminder_time, sent)
            VALUES (?, ?, ?, ?, 0)
            """,
            (
                reminder.task_id,
                reminder.to_email,
                title,
                reminder.remind_at.isoformat(),
            ),
        )

        db.commit()
        db.close()

        return {"message": "Reminder scheduled successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- Scheduler job ----------------
def check_reminders():
    db = get_db()
    cursor = db.cursor()

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
                r[1],
                "Task Reminder",
                f"Reminder: {r[2]}"
            )
            cursor.execute(
                "UPDATE reminders SET sent = 1 WHERE id = ?",
                (r[0],)
            )
        except Exception as e:
            print("Email failed:", e)

    db.commit()
    db.close()


# ---------------- Start scheduler ----------------
def start_scheduler():
    if not scheduler.get_jobs():
        scheduler.add_job(check_reminders, "interval", minutes=1)
        print("✅ Reminder scheduler started")


start_scheduler()
