import axios from "axios";

// ✅ Backend URL (correct)
const API_BASE_URL = "http://127.0.0.1:8000";

// ✅ Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request body type
export interface SendReminderData {
  task_id: number;
  to_email: string;
  remind_at: string;
}

// ✅ FIXED reminder API call
export const triggerEmailReminder = async (data: SendReminderData) => {
  const response = await api.post("/email/reminder", data);
  return response; // return full axios response
};

export default api;
