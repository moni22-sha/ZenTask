from flask import Blueprint
from database.db import get_db

admin_bp = Blueprint("admin", __name__)
from flask import Blueprint, jsonify
from database.db import get_db

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/admin/users", methods=["GET"])
def get_users():
    db = get_db()
    users = db.execute(
        "SELECT id, name, email, role, is_active FROM users"
    ).fetchall()

    return jsonify([dict(user) for user in users])

@admin_bp.route("/admin/active-users")
def active_users():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT email FROM users WHERE is_active = 1
    """)
    users = cursor.fetchall()

    conn.close()
    return {"users": [u["email"] for u in users]}
@admin_bp.route("/admin/reminders")
def get_reminders():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT user_email, title, reminder_time FROM reminders
    """)
    reminders = cursor.fetchall()

    conn.close()
    return {"reminders": [{"user_email": r["user_email"], "title": r["title"], "reminder_time": r["reminder_time"]} for r in reminders]}