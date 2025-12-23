
import React, { useState } from 'react';
import { Subject, Task, TaskType } from '../types';
import Icon from './Icon';

interface CalendarProps {
  currentDate: Date;
  tasks: Task[];
  subjects: Subject[];
  onDateClick: (date: Date) => void;
  onTaskClick: (task: Task) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToggleTaskCompletion: (taskId: string) => void;
}

// Simplified holiday check for 2024-2025
const isJapaneseHoliday = (date: Date): boolean => {
  const year = date.getFullYear();
  const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  const holidays2024 = new Set([
    '01-01', '01-08', '02-11', '02-12', '02-23', '03-20', '04-29', 
    '05-03', '05-04', '05-05', '05-06', '07-15', '08-11', '08-12', 
    '09-16', '09-22', '09-23', '10-14', '11-03', '11-04', '11-23'
  ]);

  const holidays2025 = new Set([
    '01-01', '01-13', '02-11', '02-23', '02-24', '03-20', '04-29', 
    '05-03', '05-04', '05-05', '05-06', '07-21', '08-11', '09-15', 
    '09-23', '10-13', '11-03', '11-23', '11-24'
  ]);
  
  if (year === 2024) {
    return holidays2024.has(monthDay);
  }
  if (year === 2025) {
    return holidays2025.has(monthDay);
  }
  
  return false;
};


const Calendar: React.FC<CalendarProps> = ({ currentDate, tasks, subjects, onDateClick, onTaskClick, onPrevMonth, onNextMonth, onToggleTaskCompletion }) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startingDayIndex = firstDayOfMonth.getDay();
  const daysInMonthCount = lastDayOfMonth.getDate();
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  
  const calendarCells = [];

  for (let i = 0; i < startingDayIndex; i++) {
    calendarCells.push({ type: 'empty', key: `empty-start-${i}` });
  }

  for (let date = 1; date <= daysInMonthCount; date++) {
    const day = new Date(year, month, date);
    calendarCells.push({ type: 'day', day: day, key: day.toISOString().split('T')[0] });
  }

  const totalCellsFilled = calendarCells.length;
  if (totalCellsFilled < 42) {
    const remainingCells = 42 - totalCellsFilled;
    for (let i = 0; i < remainingCells; i++) {
        calendarCells.push({ type: 'empty', key: `empty-end-${i}` });
    }
  }

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border border-slate-200 flex flex-col h-full">
      <style>{`
        @keyframes popover-enter {
            from { opacity: 0; transform: scale(0.95) translateY(5px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-popover { animation: popover-enter 0.2s ease-out forwards; }
      `}</style>

      <div className="flex justify-between items-center mb-6 flex-shrink-0 px-2">
        <button onClick={onPrevMonth} className="p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-indigo-600 active:scale-90">
          <Icon name="chevronLeft" className="w-5 h-5" />
        </button>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          {year}年 {month + 1}月
        </h2>
        <button onClick={onNextMonth} className="p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-indigo-600 active:scale-90">
          <Icon name="chevronRight" className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-black text-slate-400 text-[10px] sm:text-xs flex-shrink-0 mb-3 px-1">
        {days.map((day, index) => <div key={day} className={`py-1 ${index === 0 ? 'text-rose-400' : ''} ${index === 6 ? 'text-blue-400' : ''}`}>{day}</div>)}
      </div>

      {/* Grid Container: パディングを追加してリングが切れないように */}
      <div className="grid grid-cols-7 grid-rows-6 gap-1 sm:gap-2 flex-grow bg-slate-50 p-2 sm:p-3 rounded-[2rem] border border-slate-100">
        {calendarCells.map((cell) => {
          if (cell.type === 'day') {
            const day = cell.day;
            const dateStr = day.toISOString().split('T')[0];
            const tasksForDay = tasks.filter(task => task.date === dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            const dayOfWeek = day.getDay();
            const isHoliday = isJapaneseHoliday(day);
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            const dateTextColor = isSunday || isHoliday ? 'text-rose-500' : isSaturday ? 'text-blue-500' : 'text-slate-600';

            return (
              <div
                key={dateStr}
                className={`bg-white rounded-2xl p-1 sm:p-2 flex flex-col relative group cursor-pointer transition-all duration-200 min-h-0 border ${isToday ? 'ring-[3px] ring-indigo-500 ring-offset-2 z-10' : 'border-slate-100 hover:border-indigo-300 shadow-sm'} ${hoveredDate === dateStr ? 'bg-indigo-50/30' : ''}`}
                onClick={() => onDateClick(day)}
                onMouseEnter={() => setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <div className="flex justify-between items-start">
                    <span className={`text-xs sm:text-sm font-black flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full transition-colors ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : dateTextColor}`}>
                      {day.getDate()}
                    </span>
                    {tasksForDay.length > 0 && (
                        <div className="flex gap-0.5 sm:hidden mt-1 mr-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        </div>
                    )}
                </div>
                
                <div className="mt-1.5 space-y-1 overflow-y-auto flex-grow hidden sm:block">
                  {tasksForDay.slice(0, 3).map(task => {
                    const sub = getSubject(task.subjectId);
                    return (
                      <div
                        key={task.id}
                        className={`px-1.5 py-1 rounded-lg text-[9px] lg:text-[10px] truncate border-l-[3px] shadow-sm mb-1 ${task.isCompleted ? 'opacity-40 grayscale' : 'bg-white'}`}
                        style={{ borderLeftColor: sub?.color || '#ccc' }}
                      >
                        <span className={`truncate block ${task.isCompleted ? 'line-through' : 'text-slate-700 font-bold'}`}>
                          {task.title}
                        </span>
                      </div>
                    );
                  })}
                  {tasksForDay.length > 3 && (
                      <div className="text-[9px] text-center text-slate-400 font-black pt-0.5">+ {tasksForDay.length - 3}</div>
                  )}
                </div>

                {/* Hover Popover */}
                {hoveredDate === dateStr && tasksForDay.length > 0 && (
                    <div className="absolute top-0 left-full ml-3 z-[60] w-64 bg-white/95 backdrop-blur-md rounded-[1.5rem] shadow-2xl border border-slate-200 p-4 animate-popover pointer-events-none md:pointer-events-auto">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                            <h4 className="font-black text-slate-800 flex items-center gap-2">
                                <Icon name="calendar" className="w-4 h-4 text-indigo-500" />
                                {day.getMonth() + 1}月{day.getDate()}日
                            </h4>
                        </div>
                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {tasksForDay.map(task => {
                                const sub = getSubject(task.subjectId);
                                return (
                                    <div key={task.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white transition-colors">
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 shadow-sm" style={{ backgroundColor: sub?.color || '#ccc' }}></div>
                                            <div className="min-w-0 flex-1">
                                                <p className={`text-sm font-bold leading-tight ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase ${task.type === TaskType.STUDY ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'}`}>
                                                      {task.type === TaskType.STUDY ? '学習' : '提出'}
                                                    </span>
                                                    {task.duration && <span className="text-[9px] text-slate-400 font-bold">{task.duration}h</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="mt-4 text-[9px] text-center text-slate-400 font-black tracking-widest uppercase">Click to Edit</p>
                    </div>
                )}
              </div>
            );
          }
          return <div key={cell.key} className="rounded-xl"></div>;
        })}
      </div>
    </div>
  );
};

export default Calendar;
