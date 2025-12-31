import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000",
});

// services/api.ts

export const triggerEmailReminder = async (email: string, taskTitle: string, dueDate: string) => {
  try {
    const response = await fetch('http://localhost:5000/api/send-reminder', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        email, 
        taskTitle, 
        dueDate 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send reminder');
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};