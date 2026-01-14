import os
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import sqlite3

# -------------------------------------------------
# Load ENV
# -------------------------------------------------
load_dotenv()

from database.db import get_db, init_db
from email_service import send_email  # Must return True/False

# -------------------------------------------------
# Initialize DB
# -------------------------------------------------
init_db()

# -------------------------------------------------
# Logging setup
# -------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# -------------------------------------------------
# FastAPI Router
# -------------------------------------------------
router = APIRouter()

# -------------------------------------------------
# Scheduler
# -------------------------------------------------
scheduler = BackgroundScheduler()

def start_scheduler():
    if not scheduler.get_jobs():
        # Check reminders every minute
        scheduler.add_job(check_reminders, "interval", minutes=1, next_run_time=datetime.now())
        scheduler.start()
        logging.info("🕒 Reminder scheduler started")


# -------------------------------------------------
# Request Schema
# -------------------------------------------------
class ReminderCreate(BaseModel):
    task_id: int
    to_email: EmailStr
    remind_at: datetime


# -------------------------------------------------
# POST: Instant Reminder
# -------------------------------------------------
@router.post("/reminders")
def create_reminder(reminder: ReminderCreate):
    db = get_db()
    cursor = db.cursor()

    try:
        # Verify task exists
        cursor.execute("SELECT title FROM tasks WHERE id = ?", (reminder.task_id,))
        task = cursor.fetchone()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        title = task[0]

        # Save reminder in DB
        cursor.execute(
            """
            INSERT INTO reminders (task_id, user_email, title, reminder_time, sent, retry_count)
            VALUES (?, ?, ?, ?, 0, 0)
            """,
            (reminder.task_id, reminder.to_email, title, reminder.remind_at.isoformat())
        )
        db.commit()

        # Send email instantly
        logging.info(f"📧 Sending instant reminder to {reminder.to_email}")
        success = send_email(
            reminder.to_email,
            "ZenTask Reminder",
            f"""
Hello 👋

This is a reminder for your task:

📝 Task: {title}
⏰ Time: {reminder.remind_at.strftime('%Y-%m-%d %H:%M')}

Stay productive!
— ZenTask
            """.strip()
        )

        if success:
            cursor.execute(
                "UPDATE reminders SET sent = 1 WHERE task_id = ? AND user_email = ? AND sent = 0",
                (reminder.task_id, reminder.to_email)
            )
            db.commit()
            return {"success": True, "message": "📧 Reminder email sent successfully!"}

        return {"success": False, "message": "Email could not be sent now. It will retry automatically."}

    except Exception as e:
        logging.error(f"❌ Error creating reminder: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

    finally:
        db.close()


# -------------------------------------------------
# Background Scheduler Job
# -------------------------------------------------
def check_reminders():
    db = get_db()
    cursor = db.cursor()

    try:
        # Select unsent reminders due now
        cursor.execute("""
            SELECT id, user_email, title, retry_count
            FROM reminders
            WHERE reminder_time <= datetime('now', 'localtime')
            AND sent = 0
        """)
        reminders = cursor.fetchall()

        for r in reminders:
            reminder_id, to_email, title, retry_count = r
            logging.info(f"⏳ Sending scheduled reminder → {to_email}")

            success = send_email(
                to_email,
                "ZenTask Scheduled Reminder",
                f"⏰ Scheduled Reminder:\n\nTask: {title}"
            )

            if success:
                cursor.execute("UPDATE reminders SET sent = 1 WHERE id = ?", (reminder_id,))
            else:
                # Retry logic: increase retry count, max 3 attempts
                if retry_count < 3:
                    cursor.execute(
                        "UPDATE reminders SET retry_count = retry_count + 1 WHERE id = ?",
                        (reminder_id,)
                    )
                    logging.warning(f"⚠️ Retry scheduled for reminder ID {reminder_id}")
                else:
                    logging.error(f"❌ Failed to send reminder ID {reminder_id} after 3 attempts")

        db.commit()

    except Exception as e:
        logging.error(f"❌ Scheduler error: {e}")

    finally:
        db.close()

