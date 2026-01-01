import sqlite3
import os

# Ensure the database file path exists
BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, 'zentask.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Example: create a table if it doesn't exist
def create_table():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            due_date TEXT,
            reminder_time TEXT,
            email TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Example: insert data into table
def add_task(title, due_date, reminder_time, email):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO tasks (title, due_date, reminder_time, email)
        VALUES (?, ?, ?, ?)
    ''', (title, due_date, reminder_time, email))
    conn.commit()  # 🔑 Important! Without this, nothing is saved
    conn.close()
    print("Task saved successfully!")

# Example usage
if __name__ == "__main__":
    create_table()
    add_task("Finish report", "2026-01-02", "2026-01-02 10:00", "user@example.com")
    print(" Task added to the database.")
 