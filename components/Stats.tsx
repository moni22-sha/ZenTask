
import React, { useEffect, useState } from 'react';
import { Task, Priority } from '../types';
import { geminiService } from '../services/geminiService';
import Calendar from './Calender';

interface StatsProps {
  tasks: Task[];
}

const Stats: React.FC<StatsProps> = ({ tasks }) => {
  const [aiTip, setAiTip] = useState("Analyzing your productivity...");
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const pendingCount = tasks.filter(t => !t.isCompleted).length;
  const highPriorityCount = tasks.filter(t => t.priority === Priority.HIGH && !t.isCompleted).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  useEffect(() => {
    const fetchSummary = async () => {
      if (tasks.length > 0) {
        const tip = await geminiService.getSmartSummary(tasks);
        setAiTip(tip);
      } else {
        setAiTip("Start by adding some tasks to your list!");
      }
    };
    fetchSummary();
  }, [tasks.length]);

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full p-6 hidden lg:flex flex-col gap-8">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-6">Productivity</h3>
        <div className="relative flex items-center justify-center mb-8">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-100"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * completionRate) / 100}
              strokeLinecap="round"
              className="text-blue-600 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-800">{completionRate}%</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Done</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <span className="text-xs font-medium text-gray-500 block mb-1">Pending</span>
            <span className="text-2xl font-bold text-gray-800">{pendingCount}</span>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <span className="text-xs font-medium text-red-500 block mb-1">High Priority</span>
            <span className="text-2xl font-bold text-red-600">{highPriorityCount}</span>
          </div>
        </div>
      </div>

      


      <Calendar />
      
        </div>
    
    
  );
};

export default Stats;
