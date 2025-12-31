from apscheduler.schedulers.background import BackgroundScheduler
from email_service import send_email
from datetime import datetime, timedelta
import pytz # type: ignore
from reminder_service import process_reminders

def start_scheduler():
    scheduler.add_job(process_reminders, "interval", minutes=1)

ist = pytz.timezone("Asia/Kolkata")

def check_and_send_reminders():
    now = datetime.now(ist)   # ✅ HERE

    tasks = get_tasks_from_db()  # type: ignore # your DB function

    for task in tasks:
        reminder_time = task["reminder_time"]  # must be IST datetime

        if reminder_time <= now:
            send_reminder_email(task) # pyright: ignore[reportUndefinedVariable]

scheduler = BackgroundScheduler()
scheduler.start()

def schedule_reminder(email, title, reminder_time):
    scheduler.add_job(
        send_email,
        "date",
        run_date=reminder_time,
        args=[
            email,
            "⏰ Task Reminder",
            f"Reminder: {title}"
        ]
    )
