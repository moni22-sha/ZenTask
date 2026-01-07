from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from database.db import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    email = Column(String, nullable=False)

    due_date = Column(DateTime, nullable=False)
    reminder_minutes = Column(Integer, nullable=False)

    reminder_sent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
