from typing import Counter


@Counter.get("/admin/users")
def get_active_users():
    cursor = conn.cursor() # type: ignore
    users = cursor.execute("""
        SELECT id, email, role, status
        FROM users
        WHERE status = 'ACTIVE'
    """).fetchall()

    return {
        "users": [
            {
                "id": u[0],
                "email": u[1],
                "role": u[2],
                "status": u[3]
            }
            for u in users
        ]
    }
