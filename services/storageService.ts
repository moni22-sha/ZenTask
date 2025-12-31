
import { Task } from '../types';

const TASKS_KEY = 'zentask_tasks';
const AUTH_KEY = 'zentask_auth';

export const storageService = {
  getTasks: (): Task[] => {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  getAuth: () => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  setAuth: (user: any) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  clearAuth: () => {
    localStorage.removeItem(AUTH_KEY);
  }
};
