# scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from email_service import send_email
import sqlite3
from datetime import datetime

scheduler = BackgroundScheduler()

DB_PATH = "backend/database/zentask.db"  # adjust your DB path

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # access columns by name
    return conn

def check_reminders():
    try:
        db = get_db_connection()
        cursor = db.cursor()

        # Select reminders that are due and not sent
        cursor.execute("""
            SELECT id, user_email, title, reminder_time
            FROM reminders
            WHERE reminder_time <= ?
            AND sent = 0
        """, (datetime.now().isoformat(),))
        reminders = cursor.fetchall()

        for r in reminders:
            try:
                send_email(
                    r["user_email"],
                    "Task Reminder",
                    f"Reminder: {r['title']}"
                )

                # Mark reminder as sent using ID (safer)
                cursor.execute(
                    "UPDATE reminders SET sent = 1 WHERE id = ?",
                    (r["id"],)
                )
            except Exception as e:
                print(f"❌ Failed to send reminder to {r['user_email']}: {e}")

        db.commit()
        db.close()
    except Exception as e:
        print(f"❌ Scheduler error: {e}")

def start_scheduler():
    # Prevent adding duplicate jobs
    if not scheduler.get_jobs():
        scheduler.add_job(check_reminders, "interval", minutes=1, id="reminder_job")
        scheduler.start()
        print("✅ Reminder scheduler started.")
