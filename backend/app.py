from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from database.db import get_db
from database.models import create_tables
from email_service import send_email
from reminder_service import create_reminder
from users import add_user  # type: ignore

from admin import admin_router
from task import task_router

app = FastAPI()

# Allow CORS (optional, useful for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# -------------------------
# ✅ INCLUDE ROUTERS
# -------------------------
app.include_router(admin_router, prefix="/admin")
app.include_router(task_router, prefix="/tasks")

# -------------------------
# ✅ CREATE DB TABLES
# -------------------------
create_tables()

# -------------------------
# ✅ HEALTH CHECK
# -------------------------
@app.get("/")
async def home():
    return {"status": "Backend running"}

# -------------------------
# ✅ CREATE TASK
# -------------------------
@app.post("/tasks")
async def create_task(request: Request):
    data = await request.json()

    if not data.get("user_id"):
        raise HTTPException(status_code=400, detail="user_id missing")

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

    return {"message": "Task created successfully"}

# -------------------------
# ✅ SEND REMINDER EMAIL
# -------------------------
@app.post("/send-reminder")
async def handle_reminder(request: Request):
    data = await request.json()

    email = data.get("email")
    task_name = data.get("taskName")

    if not email:
        raise HTTPException(status_code=400, detail="No user email found")

    subject = f"⏰ Reminder: {task_name}"
    body = f"Hello,\n\nThis is a reminder for your task:\n\n{task_name}"

    send_email(email, subject, body)

    return {"message": "Reminder email sent successfully"}

# -------------------------
# ✅ MANUAL REMINDER TEST
# -------------------------
@app.post("/reminder")
async def reminder():
    return create_reminder()
