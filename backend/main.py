from fastapi import FastAPI
from admin import admin_router
from task import task_router
from scheduler import start_scheduler
from reminder_service import router as reminder_router  # <-- alias here

app = FastAPI()

app.include_router(reminder_router)
app.include_router(admin_router)
app.include_router(task_router)

@app.on_event("startup")
def startup_event():
    start_scheduler()

@app.get("/")
def root():
    return {"status": "API running"}







