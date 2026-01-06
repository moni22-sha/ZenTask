from fastapi import FastAPI
from admin import admin_router
from task import task_router
from reminder_service import reminder_router   # 👈 ADD THIS
from task import router as task_router

app = FastAPI()

app.include_router(admin_router, prefix="/admin")
app.include_router(task_router, prefix="/tasks")
app.include_router(reminder_router, prefix="/reminder")  # 👈 ADD THIS
