import requests # type: ignore
from typing import Dict, Any

API_URL = "http://your-api-url"

async def send_otp(email: str) -> Dict[str, Any]:
    res = requests.post(
        f"{API_URL}/otp/send",
        headers={"Content-Type": "application/json"},
        json={"email": email},
    )

    if res.status_code != 200:
        raise Exception("Failed to send OTP")

    return res.json()

async def verify_otp(otp: str) -> Dict[str, Any]:
    res = requests.post(
        f"{API_URL}/otp/verify",
        headers={"Content-Type": "application/json"},
        json={"otp": otp},
    )

    if res.status_code != 200:
        raise Exception("Invalid OTP")

    return res.json()
