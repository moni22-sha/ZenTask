// services/reminderservice.ts
import API_URL from "./api";

export const triggerEmailReminder = async (
  email: string,
  title: string,
  reminderTime: string
) => {
  
  const res = await fetch(`${API_URL}/reminder/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,          // 🔥 MUST BE SENT
      title,
      reminderTime,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to send reminder");
  }

  return res.json();
};
const sendReminder = async (data: any) => {
  // logic
};

export default sendReminder;
