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
}

// Simplified holiday check for 2024-2026
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

  const holidays2026 = new Set([
    '01-01', '01-12', '02-11', '02-23', '03-20', '04-29', 
    '05-03', '05-04', '05-05', '05-06', '07-20', '08-11', '09-21', 
    '09-22', '09-23', '10-12', '11-03', '11-23'
  ]);
  
  if (year === 2024) return holidays2024.has(monthDay);
  if (year === 2025) return holidays2025.has(monthDay);
  if (year === 2026) return holidays2026.has(monthDay);
  
  return false;
};

interface CalendarCell {
  type: 'current' | 'prev' | 'next';
  day: Date;
  key: string;
}

const Calendar: React.FC<CalendarProps> = ({ 
  currentDate, 
  tasks, 
  subjects, 
  onDateClick, 
  onTaskClick, 
  onPrevMonth, 
  onNextMonth 
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  
  // Usability state features: Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'study' | 'deadline' | 'important'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const startDateDay = monthStart.getDay(); // 0 (Sun) - 6 (Sat)
  const endDateCount = monthEnd.getDate();

  // 前月の日付計算用
  const prevMonthEnd = new Date(year, month, 0);
  const prevMonthEndDateCount = prevMonthEnd.getDate();

  const calendarCells: CalendarCell[] = [];

  // 前月分
  for (let i = 0; i < startDateDay; i++) {
    const day = new Date(year, month - 1, prevMonthEndDateCount - startDateDay + 1 + i);
    calendarCells.push({ type: 'prev', day, key: `prev-${day.toISOString()}` });
  }

  // 当月分
  for (let i = 1; i <= endDateCount; i++) {
    const day = new Date(year, month, i);
    calendarCells.push({ type: 'current', day, key: `curr-${day.toISOString()}` });
  }

  // 翌月分（42個になるまで埋める）
  const remaining = 42 - calendarCells.length;
  for (let i = 1; i <= remaining; i++) {
    const day = new Date(year, month + 1, i);
    calendarCells.push({ type: 'next', day, key: `next-${day.toISOString()}` });
  }

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  // Filter logic for daily tasks
  const filterTask = (task: Task) => {
    // Hide Completed filtering
    if (hideCompleted && task.isCompleted) return false;
    
    // Type filtering
    if (typeFilter === 'study' && task.type !== TaskType.STUDY) return false;
    if (typeFilter === 'deadline' && task.type !== TaskType.DEADLINE) return false;
    if (typeFilter === 'important' && !task.isImportant) return false;
    
    // Subject filtering
    if (subjectFilter !== 'all' && task.subjectId !== subjectFilter) return false;
    
    return true;
  };

  // Monthly stats calculations
  const textMonthFormat = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthlyTasks = tasks.filter(t => t.date.startsWith(textMonthFormat));
  const completedCount = monthlyTasks.filter(t => t.isCompleted).length;
  const pendingDeadlinesCount = monthlyTasks.filter(t => t.type === TaskType.DEADLINE && !t.isCompleted).length;

  return (
    <div className="bg-white p-4 sm:p-6 pb-8 rounded-3xl border border-slate-200 flex flex-col space-y-6 animate-fade-in w-full max-w-7xl mx-auto px-2 sm:px-4">
      <style>{`
        @keyframes popover-enter {
          from { opacity: 0; transform: scale(0.95) translateY(5px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-popover { animation: popover-enter 0.2s ease-out forwards; }
      `}</style>

      {/* Mini Stats and Title Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={onPrevMonth} className="p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-indigo-600 active:scale-95 border border-slate-100 bg-white">
            <Icon name="chevronLeft" className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-black tracking-widest text-slate-400 block uppercase">Calendar Explorer</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {year}年 {month + 1}月
            </h2>
          </div>
          <button onClick={onNextMonth} className="p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-indigo-600 active:scale-95 border border-slate-100 bg-white">
            <Icon name="chevronRight" className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-50 border border-slate-200/60 px-3.5 py-1.5 rounded-xl font-bold text-xs text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>今月予定: <strong className="text-indigo-600 font-extrabold">{monthlyTasks.length}件</strong></span>
          </div>
          <div className="bg-green-50/50 border border-green-200/50 px-3.5 py-1.5 rounded-xl font-bold text-xs text-green-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>完了済: <strong className="text-green-600 font-extrabold">{completedCount}件</strong></span>
          </div>
          <div className="bg-rose-50/50 border border-rose-200/50 px-3.5 py-1.5 rounded-xl font-bold text-xs text-rose-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>未提出: <strong className="text-rose-600 font-extrabold">{pendingDeadlinesCount}件</strong></span>
          </div>
        </div>
      </div>

      {/* Advanced Quick Filters Control Board */}
      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-4">
        {/* Filtering by Task Type */}
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                typeFilter === 'all' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              すべて表示
            </button>
            <button
              onClick={() => setTypeFilter('study')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                typeFilter === 'study' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white text-indigo-700 border border-indigo-200/50 hover:bg-indigo-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              学習のみ
            </button>
            <button
              onClick={() => setTypeFilter('deadline')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                typeFilter === 'deadline' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white text-rose-700 border border-rose-200/50 hover:bg-rose-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              提出・締め切りのみ
            </button>
            <button
              onClick={() => setTypeFilter('important')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                typeFilter === 'important' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
              }`}
            >
              <Icon name="sparkles" className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              重要のみ
            </button>
          </div>

          {/* Toggle show/hide completed tasks */}
          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black border transition-all flex items-center gap-2 ${
              hideCompleted 
                ? 'bg-indigo-100 border-indigo-400 text-indigo-700 font-extrabold' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Icon name={hideCompleted ? "check-circle" : "check"} className="w-3.5 h-3.5" />
            <span>完了した目標を非表示</span>
          </button>
        </div>

        {/* Filtering by specific School Subject */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-[10px] uppercase font-black text-slate-400 mr-2">教科別フィルター:</span>
          <button
            onClick={() => setSubjectFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
              subjectFilter === 'all' 
                ? 'bg-slate-800 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            全教科
          </button>
          {subjects.map(sub => {
            const hasTaskForThisSub = monthlyTasks.some(t => t.subjectId === sub.id);
            return (
              <button
                key={sub.id}
                onClick={() => setSubjectFilter(sub.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                  subjectFilter === sub.id 
                    ? 'text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
                style={subjectFilter === sub.id ? { backgroundColor: sub.color } : {}}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={subjectFilter === sub.id ? { backgroundColor: '#fff' } : { backgroundColor: sub.color }}></span>
                <span>{sub.name}</span>
                {hasTaskForThisSub && (
                  <span className="w-1 h-1 rounded-full bg-indigo-500/50 -top-[1px] -right-[1px]"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-2 text-center font-black text-slate-400 text-[10px] sm:text-xs flex-shrink-0 mb-1 px-1">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div key={day} className={`py-1 ${index === 0 ? 'text-rose-500 font-extrabold' : ''} ${index === 6 ? 'text-blue-500 font-extrabold' : ''}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Grid Canvas body */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2.5 bg-slate-100/60 p-2 sm:p-3 rounded-[2.5rem] border border-slate-200 min-h-[550px]">
        {calendarCells.map((cell) => {
          const day = cell.day;
          if (!day) return null;

          const dateStr = day.toISOString().split('T')[0];
          // Get tasks for this specific day & apply filters
          const tasksForDay = tasks.filter(task => task.date === dateStr);
          const filteredTasksForDay = tasksForDay.filter(filterTask);
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          const dayOfWeek = day.getDay();
          const isHoliday = isJapaneseHoliday(day);
          const isSunday = dayOfWeek === 0;
          const isSaturday = dayOfWeek === 6;

          // Adjust date colors
          let dateTextColor = 'text-slate-600';
          if (cell.type !== 'current') {
            dateTextColor = 'text-slate-300';
          } else if (isSunday || isHoliday) {
            dateTextColor = 'text-rose-500 font-black';
          } else if (isSaturday) {
            dateTextColor = 'text-blue-600 font-black';
          }

          // Card styles based on state
          let containerClass = "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-sm";
          if (cell.type !== 'current') {
            containerClass = "bg-slate-50/20 border-transparent text-slate-300 pointer-events-none sm:pointer-events-auto opacity-45";
          } else if (isToday) {
            containerClass = "bg-white ring-4 ring-indigo-500/80 ring-offset-2 z-10 shadow-md shadow-indigo-100/30";
          }

          const hoverClass = (cell.type === 'current' && hoveredDate === dateStr) ? 'bg-indigo-50/10' : '';

          return (
            <div
              key={cell.key}
              className={`rounded-2xl p-1 sm:p-2 sm:pb-3.5 flex flex-col relative group cursor-pointer transition-all duration-200 min-h-0 border ${containerClass} ${hoverClass}`}
              onClick={() => {
                if (cell.type === 'prev') onPrevMonth();
                else if (cell.type === 'next') onNextMonth();
                else onDateClick(day);
              }}
              onMouseEnter={() => cell.type === 'current' && setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {/* Day header */}
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[11px] sm:text-xs font-black flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full transition-all ${isToday ? 'bg-indigo-600 text-white font-black scale-105' : dateTextColor}`}>
                  {day.getDate()}
                </span>
                
                {/* Mobile dots indicator */}
                {filteredTasksForDay.length > 0 && cell.type === 'current' && (
                  <div className="flex gap-0.5 sm:hidden mt-2.5 mr-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  </div>
                )}

                {/* Quick Add text link */}
                {cell.type === 'current' && filteredTasksForDay.length === 0 && hoveredDate === dateStr && (
                  <div className="hidden sm:flex items-center gap-1 text-[8px] font-black text-indigo-500 animate-fade-in mr-1">
                    <Icon name="plus" className="w-3.5 h-3.5" />
                    <span>追加</span>
                  </div>
                )}
              </div>
              
              {/* Desktop events list */}
              <div className={`mt-1.5 space-y-1 overflow-y-auto flex-grow hidden sm:block ${cell.type !== 'current' ? 'opacity-30' : ''}`}>
                {filteredTasksForDay.slice(0, 3).map(task => {
                  const sub = getSubject(task.subjectId);
                  return (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                      className={`px-2 py-1.5 rounded-xl text-[9px] lg:text-[10px] truncate relative overflow-hidden transition-all duration-200 hover:scale-[1.02] ${
                        task.isCompleted 
                          ? 'opacity-40 line-through bg-slate-50 border border-slate-100 text-slate-400' 
                          : task.isImportant 
                            ? 'bg-amber-50 border border-amber-300 text-amber-900 shadow-sm font-black' 
                            : 'bg-white border border-slate-100 shadow-sm hover:border-slate-300'
                      }`}
                    >
                      {/* Left vertical color badge indicator bar */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-md" 
                        style={{ backgroundColor: sub?.color || '#ccc' }}
                      />
                      <div className="flex items-center gap-1 pl-1.5">
                        {task.isImportant && <Icon name="sparkles" className="w-2.5 h-2.5 text-amber-500 shrink-0" />}
                        <span className="truncate block font-black leading-none">
                          {task.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {filteredTasksForDay.length > 3 && (
                  <div className="text-[8px] tracking-tight bg-slate-50 border border-slate-100/50 py-0.5 rounded-md text-center text-slate-400 font-black">
                    他 {filteredTasksForDay.length - 3} 件 +
                  </div>
                )}
              </div>

              {/* Hover Popover detail card for desktop */}
              {hoveredDate === dateStr && cell.type === 'current' && filteredTasksForDay.length > 0 && (
                <div className="absolute top-0 left-full ml-3.5 z-[100] w-64 bg-white/95 backdrop-blur-md rounded-[2rem] border border-slate-200 p-4 shadow-xl animate-popover pointer-events-none md:pointer-events-auto">
                  <div className="flex items-center justify-between mb-3 border-b border-rose-50 pb-2">
                    <h4 className="font-black text-slate-800 flex items-center gap-2">
                      <Icon name="calendar" className="w-4 h-4 text-indigo-500" />
                      {day.getMonth() + 1}月{day.getDate()}日のタスク一覧
                    </h4>
                  </div>
                  
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {filteredTasksForDay.map(task => {
                      const sub = getSubject(task.subjectId);
                      return (
                        <div 
                          key={task.id} 
                          className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                            task.isImportant 
                              ? 'bg-amber-50 border-amber-200 shadow-sm ring-1 ring-amber-100' 
                              : 'bg-slate-50 border-slate-100 hover:bg-white'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick(task);
                          }}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: sub?.color || '#ccc' }}></div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {task.isImportant && (
                                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[8px] font-black uppercase">
                                    <Icon name="sparkles" className="w-2 h-2" />
                                    重要
                                  </span>
                                )}
                                <p className={`text-xs font-bold leading-snug ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</p>
                              </div>
                              
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] text-slate-400 font-black">{sub?.name}</span>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${task.type === TaskType.STUDY ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                                  {task.type === TaskType.STUDY ? '学習' : '提出/期限'}
                                </span>
                                {task.duration && (
                                  <span className="text-[8px] text-slate-400 font-bold bg-white px-1 py-0.5 rounded border border-slate-100">{task.duration}時間</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3.5 text-[8px] text-center text-slate-400 font-black tracking-widest uppercase">クリックして編集する</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
