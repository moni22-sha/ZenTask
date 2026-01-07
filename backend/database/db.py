# import sqlite3
# import os

# # Absolute path to database file
# DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

# def get_db():
#     """
#     Returns a real sqlite3.Connection object.
#     """
#     conn = sqlite3.connect(DB_PATH)
#     conn.row_factory = sqlite3.Row  # allows dict-like access to rows
#     return conn


# # Optional: create reminders table if not exists
# def init_db():
#     db = get_db()
#     cursor = db.cursor()
#     cursor.execute("""
#         CREATE TABLE IF NOT EXISTS reminders (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             user_email TEXT NOT NULL,
#             title TEXT NOT NULL,
#             reminder_time TEXT NOT NULL,
#             sent INTEGER DEFAULT 0
#         )
#     """)
#     db.commit()
#     db.close()
import os
import sqlite3

# Absolute path to database in project root
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "database.db"))

# Ensure folder exists
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def get_db():
    """
    Returns a sqlite3 connection that can be used in threads.
    """
    return sqlite3.connect(DB_PATH, check_same_thread=False)

def init_db():
    """
    Create reminders table if it doesn't exist.
    """
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            title TEXT NOT NULL,
            reminder_time TEXT NOT NULL,
            sent INTEGER DEFAULT 0
        )
    """)
    db.commit()
    db.close()
