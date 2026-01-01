from flask import Flask, request, jsonify
from flask_cors import CORS

from database.db import get_db
from database.models import create_tables
from email_service import send_email
from reminder_service import create_reminder
from db import create_tables
from users import add_user

# Step 1: Create tables
create_tables()

# Step 2: Add a sample user
add_user("John Doe", "john@example.com", "password123")

app = Flask(__name__)
CORS(app)

# ✅ Create DB tables
create_tables()

# -------------------------
# ✅ SAVE USER ON LOGIN
# -------------------------
def save_user(name, email):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO users (name, email, role, is_active)
        VALUES (?, ?, 'user', 1)
        ON CONFLICT(email) DO UPDATE SET is_active = 1
    """, (name, email))

    db.commit()
    db.close()

# -------------------------
# ✅ HEALTH CHECK
# -------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend running"})

# -------------------------
# ✅ CREATE TASK (SQLITE)
# -------------------------
@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.json

    if not data.get("user_id"):
        return jsonify({"error": "user_id missing"}), 400

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO tasks (title, due_date, reminder_time, user_id)
        VALUES (?, ?, ?, ?)
    """, (
        data["title"],
        data["due_date"],
        data["reminder_time"],
        data["user_id"]
    ))

    db.commit()
    db.close()

    return jsonify({"message": "Task created successfully"})

# -------------------------
# ✅ SEND REMINDER EMAIL
# -------------------------
@app.route("/send-reminder", methods=["POST"])
def handle_reminder():
    data = request.json

    user_email = data.get("email")
    task_name = data.get("taskName", "a task")

    if not user_email:
        return jsonify({"error": "Email missing"}), 400

    subject = f"Reminder: {task_name}"
    body = f"Hello, this is a reminder for your task: {task_name}."

    send_email(user_email, subject, body)

    return jsonify({"message": "Reminder sent successfully"})

# -------------------------
# ✅ MANUAL REMINDER TEST
# -------------------------
@app.route("/reminder", methods=["POST"])
def reminder():
    return create_reminder()

# -------------------------
# ✅ RUN SERVER
# -------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
