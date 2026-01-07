# scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from email_service import send_email
import sqlite3
from datetime import datetime
import os

scheduler = BackgroundScheduler()

# ✅ ABSOLUTE DATABASE PATH (CRITICAL FIX)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database", "zentask.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def check_reminders():
    try:
        db = get_db_connection()
        cursor = db.cursor()

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

                cursor.execute(
                    "UPDATE reminders SET sent = 1 WHERE id = ?",
                    (r["id"],)
                )

                print(f"✅ Reminder sent to {r['user_email']}")

            except Exception as e:
                print(f"❌ Email failed for {r['user_email']}: {e}")

        db.commit()
        db.close()

    except Exception as e:
        print(f"❌ Scheduler error: {e}")

def start_scheduler():
    if not scheduler.get_jobs():
        scheduler.add_job(
            check_reminders,
            "interval",
            minutes=1,
            id="reminder_job",
            replace_existing=True
        )
        scheduler.start()
        print("✅ Reminder scheduler started")
