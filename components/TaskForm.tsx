import React, { useState, useEffect } from "react";
import { Task, Priority } from "../types";
import sendReminder from "../services/reminderservice";


interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => void;
  initialData?: Task | null;
}


const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [email, setEmail] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDueDate(initialData.dueDate);
      setPriority(initialData.priority);
      setEmail(initialData.email ?? "");
      setReminderTime(initialData.reminderTime ?? "");
    } else {
      setTitle("");
      setDueDate("");
      setPriority(Priority.MEDIUM);
      setEmail("");
      setReminderTime("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !dueDate || !email || !reminderTime) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      dueDate,
      priority,
      email,
      reminderTime,
      completed: false,
      isCompleted: false,
      isImportant: false,
      createdAt: new Date().toISOString(),
      user_id: ""
    };

    // Update app state
    onSubmit(task);

    // Schedule email reminder
    try {
      await sendReminder(task);
    } catch (err) {
      console.error("Reminder failed:", err);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "Edit Task" : "New Task"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Title */}
          <input
            type="text"
            placeholder="Task title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border"
          />

          {/* Due Date */}
          <input
            type="datetime-local"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Reminder email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border"
          />

          {/* Reminder Time */}
          <input
            type="datetime-local"
            required
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border"
          />

          {/* Priority */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-4 py-3 rounded-xl border"
          >
            <option value={Priority.LOW}>Low</option>
            <option value={Priority.MEDIUM}>Medium</option>
            <option value={Priority.HIGH}>High</option>
          </select>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white"
            >
              {initialData ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
