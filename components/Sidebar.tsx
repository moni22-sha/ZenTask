
import React from 'react';
import { TaskStatus } from '../types';
import { geminiService } from '../services/geminiService';
interface SidebarProps {
  currentFilter: TaskStatus;
  setFilter: (filter: TaskStatus) => void;
  taskCounts: Record<TaskStatus, number>;
}

const Sidebar: React.FC<SidebarProps> = ({ currentFilter, setFilter, taskCounts }) => {
  const menuItems = [
    { label: TaskStatus.ALL, icon: 'grid-view' },
    { label: TaskStatus.TODAY, icon: 'access-time' },
    { label: TaskStatus.UPCOMING, icon: 'calendar' },
    { label: TaskStatus.IMPORTANT, icon: 'star' },
    { label: TaskStatus.COMPLETED, icon: 'check-circle' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">ZenTask</span>
      </div>

      <nav className="flex-1 px-4 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setFilter(item.label)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all mb-1 ${
              currentFilter === item.label
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-black font-semibold text-3xl'
            }`}
          >
            <div className="flex items-center gap-3">
               <span className="material-icons-outlined text-xl">
                 {item.icon === 'grid-view' && '🔲'}
                 {item.icon === 'access-time' && '🕒'}
                 {item.icon === 'calendar' && '📅'}
                 {item.icon === 'star' && '⭐'}
                 {item.icon === 'check-circle' && '✅'}
               </span>
               <span className="text-sm">{item.label}</span>
            </div>
            {taskCounts[item.label] > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                currentFilter === item.label ? 'bg-blue-200' : 'bg-gray-100'
              }`}>
                {taskCounts[item.label]}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mx-4 mb-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl shadow-blue-100 text-white relative overflow-hidden group">
        <div className="relative z-10">
         
        
          <span className="text-2xs font-bold text-white block mb-1">AI Tip</span>
          <p className="text-sm text-white">"Success is never getting to the bottom of your to-do list."</p>
        
        </div>
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
      </div>
    </div>
  );
};

export default Sidebar;
