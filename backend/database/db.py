from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import sqlite3

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

DATABASE_URL = "sqlite:///./tasks.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# ✅ THIS FUNCTION MUST EXIST
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
