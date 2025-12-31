#!/usr/bin/env python3

import sys
import os
from datetime import datetime, timedelta

# Add the backend directory to the path
sys.path.append(os.path.dirname(__file__))

from backend.scheduler import schedule_reminder

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_reminder.py <email_address>")
        sys.exit(1)

    email = sys.argv[1]
    title = "Test Reminder Task"
    # Schedule for 10 seconds from now
    reminder_time = datetime.now() + timedelta(seconds=10)

    print(f"Scheduling reminder for {email} at {reminder_time}")
    schedule_reminder(email, title, reminder_time)

    print("Reminder scheduled. Waiting for it to trigger...")
    # Keep the script running for a minute to let the scheduler work
    import time
    time.sleep(60)
    print("Test complete.")