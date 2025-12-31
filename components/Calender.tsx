import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  isDarkMode: boolean;
  tasks?: { dueDate: string }[];
  onDateClick?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ isDarkMode, tasks = [], onDateClick }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(today.toISOString().split("T")[0]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handleMonthChange = (step: number) => {
    const newDate = new Date(currentYear, currentMonth + step, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const formatDate = (day: number) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const hasTask = (dateStr: string) => tasks.some(task => task.dueDate === dateStr);

  return (
    <div className={`p-6 rounded-3xl shadow-sm border border-slate-100 ${isDarkMode ? "bg-slate-800 text-white" : "bg-white"}`}>
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">
          {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-1">
          <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-slate-100 rounded-md">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-slate-100 rounded-md">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-slate-300">{d}</span>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(day);
          const isToday = dateStr === today.toISOString().split("T")[0];
          const isSelected = dateStr === selectedDate;
          const taskExists = hasTask(dateStr);

          return (
            <div
              key={day}
              onClick={() => {
                const clickedDate = new Date(currentYear, currentMonth, day);
                setSelectedDate(dateStr);
                if (onDateClick) onDateClick(clickedDate);
              }}
              className={`aspect-square flex items-center justify-center text-[11px] font-bold rounded-xl cursor-pointer transition-all
                ${isSelected ? "bg-blue-600 text-white shadow-lg scale-110" : "text-slate-600 hover:bg-blue-50"}
                ${isToday && !isSelected ? "text-blue-600 ring-1 ring-blue-100" : ""}
              `}
            >
              {day}
              {taskExists && !isSelected && <span className="ml-1 w-2 h-2 bg-red-500 rounded-full inline-block"></span>}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Calendar;
