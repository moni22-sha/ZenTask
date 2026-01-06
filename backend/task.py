from database.db import SessionLocal
from database.models import Task
from fastapi import APIRouter

task_router = APIRouter()
def create_task(data):
    db = SessionLocal()

    task = Task(
        title=data["title"],
        due_date=data["due_date"],
        reminder_time=data["reminder_time"],
        priority=data.get("priority"),
        user_id=data["user_id"],
    )


@task_router.get("/")
def get_tasks():
    return {"message": "Tasks working"}



    return task
