

from database.db import get_db

def activate_user(email):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO users (email, is_active)
    VALUES (?, 1)
    ON CONFLICT(email) DO UPDATE SET is_active=1
    """, (email,))

    conn.commit()
    conn.close()
    return {"success": True, "message": "User activated successfully"}


