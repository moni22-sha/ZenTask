#!/usr/bin/env python3

import sys
import os

# Add backend folder to Python path FIRST
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from email_service import send_email

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_email.py <email_address>")
        sys.exit(1)

    email = sys.argv[1]
    subject = "Test Email from ZenTask Pro"
    body = "This is a test email to verify the email service is working."

    send_email(email, subject, body)
    print(f"Test email sent to {email}")