
import React, { useState } from 'react';
import { UserProgress, Task, TaskType, Subject } from '../types';
import Icon from './Icon';
import { View } from '../App';

interface HomeViewProps {
  userProgress: UserProgress;
  tasks: Task[];
  subjects: Subject[];
  onNavigate: (view: View) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (date: Date) => void;
  onToggleTaskCompletion: (taskId: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ userProgress, tasks, subjects, onNavigate, onTaskClick, onAddTask, onToggleTaskCompletion }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.date === today);
  const completedCount = todaysTasks.filter(t => t.isCompleted).length;
  
  // 最初は3件だけ表示し、展開時はすべて表示する
  const displayedTasks = isExpanded ? todaysTasks : todaysTasks.slice(0, 3);
  
  const upcomingDeadlines = tasks
    .filter(t => t.type === TaskType.DEADLINE && !t.isCompleted && t.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      {/* Welcome Card */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">こんにちは！今日も頑張りましょう</h2>
          <p className="opacity-90 text-lg mb-6">
            {todaysTasks.length > 0 ? (
              <>
                今日は <span className="font-bold underline">{todaysTasks.length}件</span> の予定があります。
                {completedCount > 0 && ` (${completedCount}件 完了済み)`}
              </>
            ) : (
              "今日は予定がありません。"
            )}
          </p>
          <div className="flex flex-wrap gap-4">
             <button 
                onClick={() => onNavigate('calendar')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"
             >
                <Icon name="calendar" className="w-5 h-5" />
                カレンダーを見る
             </button>
             <button 
                onClick={() => onNavigate('review')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"
             >
                <Icon name="play" className="w-5 h-5" />
                復習をする
             </button>
             <button 
                onClick={() => onNavigate('search')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"
             >
                <Icon name="search" className="w-5 h-5" />
                学習検索
             </button>
             <button 
                onClick={() => onNavigate('articles')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"
             >
                <Icon name="book-open" className="w-5 h-5" />
                学習記事
             </button>
             <button 
                onClick={() => onNavigate('subjects')}
                className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold transition-all hover:bg-indigo-50 active:scale-95"
             >
                新しい教科を追加
             </button>
          </div>
        </div>
        <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] left-[10%] w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Today's Tasks */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col h-full min-h-[400px]">
           <div className="flex items-center justify-between mb-4 flex-shrink-0">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <Icon name="check" className="w-6 h-6 text-green-500" />
                 今日のタスク
               </h3>
               <div className="flex items-center gap-3">
                 <button 
                  onClick={() => onAddTask(new Date())}
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1.5 text-xs font-black border border-indigo-100 active:scale-95"
                  title="タスクを追加"
                 >
                   <Icon name="plus" className="w-4 h-4" />
                   追加
                 </button>
                 {todaysTasks.length > 3 && (
                   <button 
                     onClick={() => setIsExpanded(!isExpanded)} 
                     className="text-sm text-indigo-600 hover:underline font-bold transition-all"
                   >
                     {isExpanded ? '閉じる' : 'すべて表示'}
                   </button>
                 )}
               </div>
           </div>
           
           <div className="flex-grow space-y-3 transition-all duration-300">
              {todaysTasks.length > 0 ? (
                displayedTasks.map(task => {
                  const sub = getSubject(task.subjectId);
                  return (
                    <div 
                        key={task.id} 
                        className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer animate-fade-in ${task.isCompleted ? 'bg-slate-50 border-slate-100 opacity-60' : task.isImportant ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-400'}`}
                        onClick={() => onTaskClick(task)}
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); onToggleTaskCompletion(task.id); }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : task.isImportant ? 'bg-amber-100 border-amber-400 text-amber-600' : 'border-slate-300 group-hover:border-indigo-400'}`}
                      >
                        {task.isCompleted ? <Icon name="check" className="w-4 h-4" /> : task.isImportant ? <Icon name="sparkles" className="w-3.3 h-3.3" /> : null}
                      </button>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                           <p className={`font-bold truncate ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</p>
                           {task.isImportant && (
                              <span className="flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[8px] font-black">
                                重要
                              </span>
                           )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-5 h-5 rounded-md flex items-center justify-center text-white" style={{ backgroundColor: sub?.color || '#ccc' }}>
                                <Icon name={sub?.icon || 'book'} className="w-3 h-3" />
                            </div>
                            <span className="text-xs text-slate-500">{sub?.name}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium text-center px-4">今日はタスクがありません<br/><span className="text-xs">ゆっくり休むか、新しい予定を追加しましょう</span></p>
                </div>
              )}
           </div>
           
           {!isExpanded && todaysTasks.length > 3 && (
              <p className="text-center text-xs text-slate-400 font-medium pt-4 flex-shrink-0">
                ほか {todaysTasks.length - 3} 件の予定があります
              </p>
           )}
        </section>

        {/* Right Column: Status & Deadlines */}
        <div className="flex flex-col gap-6">
          {/* Level Progress */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200 flex-1 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Icon name="sparkles" className="w-6 h-6 text-amber-500" />
              ステータス
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl font-black text-indigo-600">Lv.{userProgress.level}</span>
              <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">XP {Math.round(userProgress.xp)} / {userProgress.level * 100}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
               <div 
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(userProgress.xp / (userProgress.level * 100)) * 100}%` }}
               ></div>
            </div>
          </section>

          {/* Deadlines */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200 flex-1 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Icon name="check" className="w-6 h-6 text-rose-500" />
                直近の締め切り
              </h3>
              <button 
                onClick={() => onAddTask(new Date())}
                className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-1.5 text-xs font-black border border-rose-100 active:scale-95"
                title="締め切りを追加"
              >
                <Icon name="plus" className="w-4 h-4" />
                追加
              </button>
            </div>
            <div className="flex-grow space-y-3">
               {upcomingDeadlines.length > 0 ? (
                 upcomingDeadlines.map(task => {
                   const daysLeft = Math.ceil((new Date(task.date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
                   return (
                     <div 
                        key={task.id}
                        className={`flex items-center justify-between p-3.5 border rounded-2xl cursor-pointer transition-all active:scale-[0.98] ${task.isImportant ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-rose-50/50 border-rose-100 hover:border-rose-300'}`}
                        onClick={() => onTaskClick(task)}
                     >
                        <div className="min-w-0">
                           <div className="flex items-center gap-1.5 flex-wrap">
                             <p className="font-bold text-slate-700 truncate">{task.title}</p>
                             {task.isImportant && <Icon name="sparkles" className="w-3.5 h-3.5 text-amber-500" />}
                           </div>
                           <p className={`text-xs font-bold flex items-center gap-1 ${task.isImportant ? 'text-amber-600' : 'text-rose-600'}`}>
                             <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${task.isImportant ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                             あと {daysLeft === 0 ? '今日中' : `${daysLeft}日`}
                           </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <span className={`text-[10px] bg-white px-2 py-1 rounded-lg border font-black ${task.isImportant ? 'text-amber-500 border-amber-200' : 'text-slate-400 border-rose-100'}`}>{task.date.replace(/^\d{4}-/, '')}</span>
                        </div>
                     </div>
                   );
                 })
               ) : (
                 <div className="h-full flex items-center justify-center py-6">
                    <p className="text-center text-slate-400 text-sm font-medium">期限の迫った課題はありません</p>
                 </div>
               )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
