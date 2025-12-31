import { Task } from "../types";
import API_URL from "./api";

export async function sendReminder(task: Task) {
  // 1. Get the logged-in user data from localStorage
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const userEmail = userData?.email;

  // 2. Check if the email exists before making the request
  if (!userEmail) {
    alert("No user email found to send reminder. Please log in again.");
    throw new Error("User email is missing");
  }

  // 3. Send both the task AND the user email to the backend
  const response = await fetch(`${API_URL}/reminder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...task,        // Spreads existing task details (title, date, etc.)
      email: userEmail // Adds the recipient email to the request
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to schedule reminder");
  }

  return response.json();
}