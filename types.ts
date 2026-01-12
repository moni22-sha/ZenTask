
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum TaskStatus {
  ALL = 'All',
  TODAY = 'Today',
  UPCOMING = 'Upcoming',
  IMPORTANT = 'Important',
  COMPLETED = 'Completed',
}
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "task" | "reminder" | "system";
  createdAt: string;
  isRead: boolean;
}
export enum NotificationAction {
  VIEW = "view",
  DISMISS = "dismiss",
  COMPLETE_TASK = "complete_task"
}

export enum ReminderTone {
  SOFT = "soft",
  NORMAL = "normal",
  LOUD = "loud",
  PROFESSIONAL = "PROFESSIONAL",
  FRIENDLY = "FRIENDLY",
  URGENT = "URGENT",
  CASUAL = "CASUAL"
}


export interface Task {
  isUpcoming: any;
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;

  isCompleted: boolean;
  isImportant: boolean;
  createdAt: string;
   user_id: string;
   notified?: boolean;
}

export interface User {
  user(user: any, title: string, reminderTime: string): unknown;
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



export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  otpSent: boolean;
}
export interface Task {
  id: string;
  title: string;
  email: string;
  reminderTime: string;
  completed: boolean;
    isCompleted: boolean;
  isImportant: boolean;
  dueDate: string;
  description?: string;



}
export interface Todo{
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}
export interface UserRole {
  id: number;
  username: string;
  role: UserRole;
  email?: string;
  name: string;
  avatar: string;
  isActive: boolean;
  reminderTime: string;




}
export interface AuthResponse{
  token: string;
  user: User;
  
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

