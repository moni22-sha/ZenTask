from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db

task_router = APIRouter(prefix="/tasks", tags=["Tasks"])


@task_router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    return {"tasks": []}


@task_router.post("/")
def create_task(task: dict, db: Session = Depends(get_db)):
    return {"message": "Task created", "task": task}


