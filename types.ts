
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum TaskStatus {
  ALL = 'All Tasks',
  TODAY = 'Today',
  UPCOMING = 'Upcoming',
  IMPORTANT = 'Important',
  COMPLETED = 'Completed'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
  isImportant: boolean;
  createdAt: string;
   user_id: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  name: string;
  avatar: string;
   isActive: boolean;      // ✅ activation status
  lastLogin?: string;
   reminderTime: string;
  // Add this to your types file
 // Add this line to your User interface
}

export interface Todo {
  id: number;
  title: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  otpSent: boolean;
}
export interface Task {
  id: string;
  title: string;
  email: string;
  reminderTime: number;
  completed: boolean;
    isCompleted: boolean;
  isImportant: boolean;
  dueDate: string;
  description?: string;



}
// services/reminderService.ts

export interface Reminder {
  id: string;
  taskId: string;
  time: string;
  repeat?: boolean;
}

export const scheduleReminder = (reminder: Reminder) => {
  console.log('Reminder scheduled:', reminder);
};

export const cancelReminder = (reminderId: string) => {
  console.log('Reminder cancelled:', reminderId);
};

