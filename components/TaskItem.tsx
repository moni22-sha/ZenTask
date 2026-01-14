import React, { useState } from 'react';
import { Task, Priority, User } from '../types';
import { ICONS } from '../constants';
import { toast } from 'react-toastify';

interface TaskItemProps {
  task: Task;
  user: User | null;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  index: number;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  user,
  onToggleComplete,
  onToggleImportant,
  onDelete,
  onEdit,
  index,
}) => {
  const [loading, setLoading] = useState(false);

  const handleReminder = async () => {
    if (!task.id) {
      toast.error("Task ID missing");
      return;
    }

    if (!user?.email) {
      toast.error("User email not found");
      return;
    }

    if (!task.dueDate) {
      toast.error("Task due date missing");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/email/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          email: user.email,
          title: task.title,
          reminderTime: new Date(task.dueDate).toISOString(), // send ISO string
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Reminder sent!");
      } else {
        toast.error(data.detail || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      toast.error("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH:
        return 'bg-red-50 text-red-600 border-red-100';
      case Priority.MEDIUM:
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case Priority.LOW:
        return 'bg-green-50 text-green-600 border-green-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-4 mb-3">
      
      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
        {index + 1}
      </div>

      <button
        onClick={() => onToggleComplete(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          task.isCompleted
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'border-gray-300'
        }`}
      >
        {task.isCompleted && <ICONS.Check className="w-4 h-4" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`text-lg font-semibold truncate ${
            task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
          }`}>
            {task.title}
          </h3>

          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <ICONS.Calendar className="w-3 h-3" />
          {new Date(task.dueDate).toLocaleString()}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        
        <button
          type="button"
          onClick={handleReminder}
          disabled={loading}
          title="Send Email Reminder Now"
          className={`p-1.5 rounded-lg ${
            loading
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-400 hover:text-green-600 hover:bg-gray-100"
          }`}
        >
          <ICONS.Calendar className="w-5 h-5 pointer-events-none" />
        </button>

        <button
          onClick={() => onToggleImportant(task.id)}
          className={`p-1.5 rounded-lg ${task.isImportant ? 'text-amber-500' : 'text-gray-400'}`}
        >
          <ICONS.Star className="w-5 h-5" />
        </button>

        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
        >
          <ICONS.Edit className="w-5 h-5" />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg"
        >
          <ICONS.Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
