from database.db import get_db

db = get_db()
cursor = db.cursor()

cursor.execute("SELECT * FROM users;")
rows = cursor.fetchall()

if not rows:
    print("❌ No users found in database")
else:
    print("✅ Users found:")
    for row in rows:
        print(dict(row))

db.close()
