import sqlite3

conn = sqlite3.connect("zentask.db")
cursor = conn.cursor()

# Insert test user
cursor.execute('''
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
''', ("John Doe", "john@example.com", "password123"))

conn.commit()
conn.close()
print("User inserted successfully!")
