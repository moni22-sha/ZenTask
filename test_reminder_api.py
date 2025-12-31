#!/usr/bin/env python3

import requests
import json
from datetime import datetime, timedelta

# Assuming the Flask app is running on localhost:5000
url = "http://localhost:5000/reminder"

# Schedule a reminder for 10 seconds from now
reminder_time = datetime.now() + timedelta(seconds=10)
data = {
    "email": "monisha612003@gmail.com",
    "title": "Test Reminder from Flask App",
    "reminderTime": reminder_time.isoformat()
}

print(f"Sending POST request to {url} with data: {data}")

try:
    response = requests.post(url, json=data)
    print(f"Response status: {response.status_code}")
    print(f"Response body: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
    print("Make sure the Flask app is running first!")