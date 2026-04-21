
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Subject, Task, TaskType, UserProgress, Badge } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Calendar from './components/Calendar';
import TaskModal from './components/TaskModal';
import Header from './components/Header';
import SettingsMenu from './components/SettingsMenu';
import Sidebar from './components/Sidebar';
import ProgressView from './components/ProgressView';
import SubjectManager from './components/SubjectManager';
import HomeView from './components/HomeView';
import ReviewView from './components/ReviewView';
import StudySearchView from './components/StudySearchView';
import { ReviewResult } from './types';

const SIDEBAR_COLORS = [
  '#F87171', '#FB923C', '#FBBF24', '#A3E635', '#4ADE80', '#34D399', '#2DD4BF', '#60A5FA', '#818CF8', '#A78BFA', '#F472B6'
];

const INITIAL_BADGES: Badge[] = [
  { id: 'first_step', name: 'はじめの一歩', description: '最初のタスクを完了', icon: 'check', achieved: false, xpReward: 50 },
  { id: 'study_10h', name: '勉強家', description: '合計10時間勉強', icon: 'book', achieved: false, xpReward: 100 },
  { id: 'study_50h', name: '努力家', description: '合計50時間勉強', icon: 'book', achieved: false, xpReward: 500 },
  { id: 'perfect_week', name: 'パーフェクトウィーク', description: '1週間の全タスクを完了', icon: 'calendar', achieved: false, xpReward: 300 },
  { id: 'deadline_master', name: '締切マスター', description: '5つの提出タスクを完了', icon: 'flag', achieved: false, xpReward: 200 },
];

const XP_PER_HOUR = 20;
const XP_PER_DEADLINE = 50;
const LEVEL_UP_BASE_XP = 100;

const MATH_SUBJECTS: Subject[] = [
  { id: 'math_1', name: '正負の数', color: '#F87171', goal: '正負の数の計算をマスターする', icon: 'plus-minus' },
  { id: 'math_2', name: '文字の式', color: '#FB923C', goal: '文字式の計算をマスターする', icon: 'algebra' },
  { id: 'math_3', name: '一次方程式', color: '#FBBF24', goal: '一次方程式を解けるようにする', icon: 'equal' },
  { id: 'math_4', name: '比例と反比例', color: '#A3E635', goal: '比例・反比例のグラフと式を理解する', icon: 'trending-up' },
  { id: 'math_5', name: '平面図形', color: '#4ADE80', goal: '図形の性質と作図をマスターする', icon: 'shapes' },
  { id: 'math_6', name: '空間図形', color: '#34D399', goal: '立体の表面積と体積を計算できるようにする', icon: 'box' },
  { id: 'math_7', name: 'データの活用', color: '#2DD4BF', goal: 'データの整理と代表値を理解する', icon: 'bar-chart' },
];

export type View = 'home' | 'calendar' | 'progress' | 'subjects' | 'review' | 'search';

const App: React.FC = () => {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', MATH_SUBJECTS);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [reviewResults, setReviewResults] = useLocalStorage<ReviewResult[]>('reviewResults', []);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('userProgress', {
    level: 1,
    xp: 0,
    badges: INITIAL_BADGES,
  });
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini_api_key', '');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [activeView, setActiveView] = useState<View>('home');
  
  const notificationTimeouts = useRef<number[]>([]);

  const handleRequestNotificationPermission = useCallback(() => {
    Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
    });
  }, []);

  useEffect(() => {
    notificationTimeouts.current.forEach(clearTimeout);
    notificationTimeouts.current = [];

    if (notificationPermission === 'granted') {
      const now = new Date();
      tasks.forEach(task => {
        if (task.notificationEnabled && task.startTime && !task.isCompleted) {
          const [hours, minutes] = task.startTime.split(':').map(Number);
          const notificationDate = new Date(task.date);
          notificationDate.setHours(hours, minutes, 0, 0);

          if (notificationDate > now) {
            const timeout = window.setTimeout(() => {
              new Notification('学習の時間です！', {
                body: `${task.title}`,
                icon: '/favicon.ico' 
              });
            }, notificationDate.getTime() - now.getTime());
            notificationTimeouts.current.push(timeout);
          }
        }
      });
    }
    
    return () => {
      notificationTimeouts.current.forEach(clearTimeout);
    };
  }, [tasks, notificationPermission]);

  const xpForNextLevel = LEVEL_UP_BASE_XP * userProgress.level;

  const checkAchievements = useCallback(() => {
    let newProgress = { ...userProgress };
    let newBadges = [...newProgress.badges];
    let changed = false;
    let totalXpGained = 0;

    const updateBadge = (id: string, condition: boolean) => {
        const badge = newBadges.find(b => b.id === id);
        if (badge && !badge.achieved && condition) {
            badge.achieved = true;
            totalXpGained += (badge.xpReward || 0);
            changed = true;
        }
    };

    updateBadge('first_step', tasks.some(t => t.isCompleted));

    const totalStudyHours = tasks
      .filter(t => t.type === TaskType.STUDY && t.isCompleted && t.duration)
      .reduce((sum, task) => sum + (task.duration || 0), 0);
    
    updateBadge('study_10h', totalStudyHours >= 10);
    updateBadge('study_50h', totalStudyHours >= 50);

    const completedDeadlines = tasks.filter(t => t.type === TaskType.DEADLINE && t.isCompleted).length;
    updateBadge('deadline_master', completedDeadlines >= 5);
    
    let currentXp = newProgress.xp + totalXpGained;
    let currentLevel = newProgress.level;
    let requiredXp = LEVEL_UP_BASE_XP * currentLevel;
    while (currentXp >= requiredXp) {
        currentXp -= requiredXp;
        currentLevel += 1;
        requiredXp = LEVEL_UP_BASE_XP * currentLevel;
        changed = true;
    }
    newProgress.level = currentLevel;
    newProgress.xp = currentXp;

    if (changed) {
      newProgress.badges = newBadges;
      setUserProgress(newProgress);
    }
  }, [tasks, userProgress, setUserProgress]);

  useEffect(() => {
    checkAchievements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedDate(new Date(task.date));
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    if(taskData.notificationEnabled && notificationPermission !== 'granted') {
        handleRequestNotificationPermission();
    }

    if (taskToEdit) {
      setTasks(tasks.map(t => t.id === taskToEdit.id ? { ...taskToEdit, ...taskData } : t));
    } else {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        isCompleted: false,
      };
      setTasks([...tasks, newTask]);
    }
    setTaskToEdit(null);
  };

  const handleToggleTaskCompletion = (taskId: string) => {
    let xpGained = 0;
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const wasCompleted = t.isCompleted;
        if (!wasCompleted) {
            if (t.type === TaskType.STUDY && t.duration) xpGained = t.duration * XP_PER_HOUR;
            else if (t.type === TaskType.DEADLINE) xpGained = XP_PER_DEADLINE;
        } else {
             if (t.type === TaskType.STUDY && t.duration) xpGained = -(t.duration * XP_PER_HOUR);
             else if (t.type === TaskType.DEADLINE) xpGained = -XP_PER_DEADLINE;
        }
        return { ...t, isCompleted: !t.isCompleted };
      }
      return t;
    });

    setUserProgress(prev => ({...prev, xp: Math.max(0, prev.xp + xpGained)}));
    setTasks(updatedTasks);
  };
  
  const handleAddSuggestedTasks = (newTasks: Omit<Task, 'id' | 'isCompleted'>[]) => {
      const tasksToAdd: Task[] = newTasks.map(t => ({
          ...t,
          id: crypto.randomUUID(),
          isCompleted: false
      }));
      setTasks(prevTasks => [...prevTasks, ...tasksToAdd]);
      setActiveView('calendar');
  };

  const renderContent = () => {
    switch(activeView) {
      case 'home':
        return (
          <HomeView 
            userProgress={userProgress}
            tasks={tasks}
            subjects={subjects}
            onNavigate={setActiveView}
            onTaskClick={handleTaskClick}
            onAddTask={handleDateClick}
            onToggleTaskCompletion={handleToggleTaskCompletion}
          />
        );
      case 'calendar':
        return (
          <Calendar
            currentDate={currentDate} tasks={tasks} subjects={subjects}
            onDateClick={handleDateClick} onTaskClick={handleTaskClick}
            onPrevMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            onNextMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
          />
        );
      case 'progress':
        return <ProgressView userProgress={userProgress} xpForNextLevel={xpForNextLevel} />;
      case 'subjects':
        return (
          <SubjectManager 
            subjects={subjects}
            setSubjects={setSubjects}
            tasks={tasks}
            setTasks={setTasks}
            SIDEBAR_COLORS={SIDEBAR_COLORS}
            onAddSuggestedTasks={handleAddSuggestedTasks}
            apiKey={apiKey}
          />
        );
      case 'review':
        return (
          <ReviewView 
            subjects={subjects}
            apiKey={apiKey}
            reviewResults={reviewResults}
            onSaveResult={(result) => setReviewResults([...reviewResults, result])}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        );
      case 'search':
        return <StudySearchView />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 relative overflow-hidden">
      <style>{`
        @keyframes modal-enter { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-modal-enter { animation: modal-enter 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        @keyframes settings-enter { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-settings-enter { animation: settings-enter 0.2s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        @keyframes overlay-enter { from { opacity: 0; } to { opacity: 1; } }
        .animate-overlay-enter { animation: overlay-enter 0.3s ease-out forwards; }
      `}</style>

      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavigate={setActiveView}
      />
      
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onNavigate={(view: View) => {
          setActiveView(view);
          setIsSidebarOpen(false);
        }}
      />
      
      {isSidebarOpen && (
          <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-overlay-enter md:hidden"
              onClick={() => setIsSidebarOpen(false)}
          ></div>
      )}

      <main className={`flex-1 overflow-hidden ${activeView === 'search' ? 'p-0' : 'p-4 lg:p-6'}`}>
        <div className={`h-full w-full overflow-y-auto ${activeView === 'search' ? 'scrollbar-hide' : ''}`}>
          {renderContent()}
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTask}
        subjects={subjects} selectedDate={selectedDate} taskToEdit={taskToEdit}
      />

      <SettingsMenu
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        notificationPermission={notificationPermission}
        onRequestNotificationPermission={handleRequestNotificationPermission}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
};

export default App;
