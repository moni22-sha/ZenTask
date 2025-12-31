from anyio import get_running_tasks
from flask import request, jsonify
from datetime import datetime
from scheduler import schedule_reminder
from email_service import send_email

def create_reminder():
    data = request.json

    email = data["email"]
    title = data["title"]
    reminder_time = datetime.fromisoformat(data["reminderTime"])

    schedule_reminder(email, title, reminder_time)

    return jsonify({"message": "Reminder scheduled successfully"})
def process_reminders():
    tasks = get_running_tasks()

    for task in tasks:
        user = get_user_by_id(task.user_id)  # type: ignore # ✅ VALID PYTHON

        if not user:
            print("No user found")
            continue

        send_email(user.email, "Task Reminder", "Your task is due")
