from fastapi import APIRouter
from database.db import conn

router = APIRouter()

@router.post("/auth/login")
def login_user(data: dict):
    email = data["email"]

    cursor = conn.cursor()

    user = cursor.execute(
        "SELECT * FROM users WHERE email = ?", (email,)
    ).fetchone()

    if not user:
        cursor.execute(
            "INSERT INTO users (email) VALUES (?)", (email,)
        )
        conn.commit()

    return {"message": "Login successful"}
