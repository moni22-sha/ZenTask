from pydantic import BaseModel, EmailStr
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    email: EmailStr
    dueDate: datetime
    reminderMinutes: int

