from database.db import SessionLocal
from database.models import Task

def create_task(data):
    db = SessionLocal()

    task = Task(
        title=data["title"],
        due_date=data["due_date"],
        reminder_time=data["reminder_time"],
        priority=data.get("priority"),
        user_id=data["user_id"],
    )

    db.add(task)
    db.commit()
    db.refresh(task)
    db.close()

    return task
