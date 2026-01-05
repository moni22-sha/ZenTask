from fastapi import FastAPI
from admin import admin_router
from task import task_router

app = FastAPI()

app.include_router(admin_router, prefix="/admin")
app.include_router(task_router, prefix="/tasks")
