import React from 'react';
import { Task, Priority, User } from '../types'; // 1. Added User import
import { ICONS } from '../constants';
import { triggerEmailReminder } from '../services/api'; // 2. Import the real service

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
  index 
}) => {
  
  // 3. Implemented the reminder trigger logic
  const handleSendReminder = async () => {
    if (user?.email) {
      try {
        await triggerEmailReminder(user.email, task.title, task.dueDate);
        alert("Reminder sent successfully!");
      } catch (error) {
        console.error("Failed to send reminder:", error);
      }
    } else {
      alert("No user email found to send reminder.");
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'bg-red-50 text-red-600 border-red-100';
      case Priority.MEDIUM: return 'bg-orange-50 text-orange-600 border-orange-100';
      case Priority.LOW: return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-4 mb-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-xs font-bold shrink-0">
        {index + 1}
      </div>

      <button 
        onClick={() => onToggleComplete(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
          task.isCompleted 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        {task.isCompleted && <ICONS.Check className="w-4 h-4" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-semibold truncate ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <ICONS.Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* 4. Added the Reminder Button to the UI */}
        <button 
          onClick={handleSendReminder}
          title="Send Email Reminder"
          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ICONS.Calendar className="w-5 h-5" /> 
        </button>

        <button 
          onClick={() => onToggleImportant(task.id)}
          className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${task.isImportant ? 'text-amber-500' : 'text-gray-400'}`}
        >
          <ICONS.Star className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onEdit(task)}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ICONS.Edit className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ICONS.Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;