
import React from 'react';
import { AppNotification, NotificationAction } from '../types';

interface NotificationToastProps {
  notification: AppNotification;
  onAction: (action: NotificationAction, taskId: string, notificationId: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onAction }) => {
  return (
    <div className="flex flex-col bg-white border border-indigo-100 shadow-xl rounded-2xl p-4 min-w-[320px] animate-in slide-in-from-right duration-300">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
          {notification.type === 'REMINDER' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {notification.type === 'AI' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-900">{notification.title}</h4>
          <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
        </div>
        <button 
          onClick={() => onAction('DISMISS', notification.taskId, notification.id)}
          className="text-slate-300 hover:text-slate-500 p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {notification.type === 'REMINDER' && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50">
          <button
            onClick={() => onAction('COMPLETE', notification.taskId, notification.id)}
            className="flex-1 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Mark Done
          </button>
          <button
            onClick={() => onAction('SNOOZE', notification.taskId, notification.id)}
            className="flex-1 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Snooze 10m
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationToast;