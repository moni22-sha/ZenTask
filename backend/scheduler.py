# scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from email_service import send_email
import sqlite3
from datetime import datetime

scheduler = BackgroundScheduler()

DB_PATH = "backend/database/zentask.db"  # adjust if your DB path is different

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # access columns by name
    return conn

def check_reminders():
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        SELECT user_email, title
        FROM reminders
        WHERE reminder_time <= datetime('now')
        AND sent = 0
    """)
    reminders = cursor.fetchall()

    for r in reminders:
        send_email(
            r["user_email"],
            "Task Reminder",
            f"Reminder: {r['title']}"
        )

        cursor.execute(
            "UPDATE reminders SET sent = 1 WHERE user_email = ? AND title = ?",
            (r["user_email"], r["title"])
        )

    db.commit()
    db.close()

def start_scheduler():
    scheduler.add_job(check_reminders, "interval", minutes=1)
    scheduler.start()
    print("✅ Reminder scheduler started.")
