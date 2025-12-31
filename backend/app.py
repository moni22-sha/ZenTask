from pickle import APPEND
from flask import Flask, request, jsonify
from flask_cors import CORS
from database.db import SessionLocal
from database.models import Task, User, create_tables
from reminder_service import create_reminder
from flask import request, jsonify
from email_service import send_email # Assuming your provided code is in email_service.py

@APPEND.route('/send-reminder', methods=['POST'])
def handle_reminder():
    data = request.json
    
    # 1. Get the email from the frontend request
    user_email = data.get('email') 
    task_name = data.get('taskName', 'a task')

    # 2. Validation check
    if not user_email:
        return jsonify({"error": "No user email found to send reminder."}), 400

    # 3. Call your updated email function
    subject = f"Reminder: {task_name}"
    body = f"Hello, this is a reminder for your task: {task_name}."
    
    send_email(user_email, subject, body)
    
    return jsonify({"message": "Reminder sent successfully!"}), 200
app = Flask(__name__)
CORS(app)

# ✅ Create DB tables
create_tables()

# ✅ Health check
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend running"})

# ✅ Create task (FIXED)
@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.json
    db = SessionLocal()

    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id missing"}), 400

    task = Task(
        title=data["title"],
        due_date=data["due_date"],
        reminder_time=data["reminder_time"],
        user_id=user_id  # ✅ THIS FIXES YOUR ERROR
    )

    db.add(task)
    db.commit()
    db.refresh(task)
    db.close()

    return jsonify({"message": "Task created", "task_id": task.id})

# ✅ Reminder trigger (optional manual test)
@app.route("/reminder", methods=["POST"])
def reminder():
    return create_reminder()

if __name__ == "__main__":
    app.run(port=5000, debug=True)
