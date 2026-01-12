
import React, { useState, useEffect } from "react";
import { Task, Priority } from "../types";
import { getAIPrioritySuggestion } from "../services/geminiService";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Task) => void;
  initialData?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [email, setEmail] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setDueDate(initialData.dueDate);
      setPriority(initialData.priority);
      setEmail(initialData.email || "");
      setReminderTime(initialData.reminderTime);
    } else if (isOpen) {
      // Default new task values
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      const isoNow = now.toISOString().slice(0, 16);
      const isoNext = nextHour.toISOString().slice(0, 16);
      
      setTitle("");
      setDescription("");
      setDueDate(isoNext);
      setPriority(Priority.MEDIUM);
      setEmail("");
      setReminderTime(isoNow);
    }
  }, [initialData, isOpen]);

  const handleAiSuggest = async () => {
    if (!title) return;
    setIsAiLoading(true);
    const suggested = await getAIPrioritySuggestion(title, description);
    setPriority(suggested);
    setIsAiLoading(false);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate || !reminderTime) return;

    const task: Task = {
      id: initialData?.id || crypto.randomUUID(),
      title,
      
      dueDate,
      priority,
      email,
      reminderTime,
      isUpcoming: false,
      completed: initialData?.completed || false,
      isImportant: initialData?.isImportant || false,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      notified: initialData?.notified || false,
      isCompleted: false,
      user_id: ""
    };

    onSubmit(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="px-8 py-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              {initialData ? "Edit Task" : "New Journey"}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              {initialData ? "Refine your objectives" : "Set your next big goal"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Title</label>
              <input
                type="text"
                placeholder="What needs to be done?"
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

        

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
                <input
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reminder Notification</label>
                <input
                  type="datetime-local"
                  required
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm appearance-none bg-white"
                >
                  <option value={Priority.LOW}>Low Priority</option>
                  <option value={Priority.MEDIUM}>Medium Priority</option>
                  <option value={Priority.HIGH}>High Priority</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={!title || isAiLoading}
                className={`mt-6 px-4 py-3 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-medium flex items-center gap-2 hover:bg-indigo-50 transition-colors ${isAiLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isAiLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 100-2h-1a1 1 0 100 2h1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 100-2H4a1 1 0 100 2h1zM8 16v-1a1 1 0 10-2 0v1a1 1 0 102 0zM12.93 11.515a1 1 0 011.414 0L15 12.121a1 1 0 01-1.414 1.414l-.657-.656a1 1 0 010-1.414zM12 18v-1a1 1 0 10-2 0v1a1 1 0 102 0z" />
                  </svg>
                )}
                AI Suggest
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              {initialData ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
