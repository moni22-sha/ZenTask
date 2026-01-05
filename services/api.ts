import axios from "axios";
import { Todo, User, UserRole } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';
export const triggerEmailReminder = async (data: {
  email: string;
  title: string;
  reminderTime: string;
}, title: any, dueDate: any) => {
  const res = await fetch("/api/reminder/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to trigger email reminder");
  }

  return res.json();
};

// Create a single axios instance for all calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach the JWT token to every request for the Admin
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // --- ADMIN PANEL METHODS ---

  /** Fetch all users in the system */
  getAllUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get('/admin/users');
    return data;
  },

  /** Fetch every todo from every user */
  getAllSystemTodos: async (): Promise<Todo[]> => {
    const { data } = await apiClient.get('/admin/todos');
    return data;
  },

  /** Delete any user (Admin only) */
  adminDeleteUser: async (userId: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${userId}`);
  },

  // --- EXISTING METHODS ---
  triggerEmailReminder: async (email: string, taskTitle: string, dueDate: string) => {
    const { data } = await apiClient.post('/send-reminder', { email, taskTitle, dueDate });
    return data;
  }
};

export default apiClient;