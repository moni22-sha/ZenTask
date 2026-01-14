import React from 'react';
import { AppNotification, NotificationAction } from '../types';
import { sendReminder } from '../services/api'; // Make sure you have this function

interface NotificationToastProps {
  notification: AppNotification;
  userEmail: string; // Needed to send reminder
  onAction: (
    action: NotificationAction,
    taskId: string | undefined,
    notificationId: string
  ) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  userEmail,
  onAction,
}) => {
  // Helper to safely call onAction
  const handleAction = (action: NotificationAction) => {
    if (!notification.id) return;
    onAction(action, notification.taskId, notification.id);
  };

  // Send reminder via API (e.g., on Snooze)
  const handleSnooze = async () => {
    if (!notification.taskId) return; // only reminders with taskId
    try {
      await sendReminder({
        email: userEmail,
        title: notification.title,
        reminderTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min snooze
      });
      console.log('Reminder sent successfully!');
      handleAction('SNOOZE');
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  };

  return (
    <div className="flex flex-col bg-white border border-indigo-100 shadow-xl rounded-2xl p-4 min-w-[320px] animate-in slide-in-from-right duration-300">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
          {notification.type === 'reminder' && (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-900">
            {notification.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
        </div>
      </div>

      {notification.type === 'reminder' && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50">
          <button
            onClick={() => handleAction('COMPLETE')}
            className="flex-1 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg"
          >
            Mark Done
          </button>

          <button
            onClick={handleSnooze}
            className="flex-1 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg"
          >
            Snooze 10m
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationToast;

