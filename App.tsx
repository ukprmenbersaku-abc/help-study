
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Subject, Task, TaskType, UserProgress, Badge } from './types';
import useCookieState, { getRawCookie, setCookie, deleteCookie } from './hooks/useCookieState';
import Icon from './components/Icon';
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
import ArticlesView from './components/ArticlesView';
import AboutView from './components/AboutView';
import MeshBackground from './components/MeshBackground';
import SyncView from './components/SyncView';
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

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'math', name: '数学', color: '#60A5FA', goal: '数学をマスターする', icon: 'math-x' },
  { id: 'japanese', name: '国語', color: '#F87171', goal: '国語をマスターする', icon: 'book' },
  { id: 'english', name: '英語', color: '#FBBF24', goal: '英語をマスターする', icon: 'alphabet' },
  { id: 'science', name: '理科', color: '#4ADE80', goal: '理科をマスターする', icon: 'flask' },
  { id: 'social', name: '社会', color: '#FB923C', goal: '社会をマスターする', icon: 'globe' },
  { id: 'music', name: '音楽', color: '#A78BFA', goal: '音楽を楽しむ', icon: 'music' },
  { id: 'art', name: '美術', color: '#F472B6', goal: '創作を楽しむ', icon: 'brush' },
  { id: 'pe', name: '保健体育', color: '#A3E635', goal: '健康を保つ', icon: 'ball' },
  { id: 'tech', name: '技術', color: '#2DD4BF', goal: '技術を学ぶ', icon: 'settings' },
  { id: 'home_ec', name: '家庭', color: '#818CF8', goal: '生活を学ぶ', icon: 'home' },
  { id: 'school', name: '校内行事', color: '#6366F1', goal: '学校行事', icon: 'calendar' },
];

const MAY_2026_TASKS: Omit<Task, 'id' | 'isCompleted'>[] = [
  { subjectId: 'school', date: '2026-05-01', title: 'メディアリテラシー講話（6時間目）', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-03', title: '憲法記念日', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-04', title: 'みどりの日', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-05', title: 'こどもの日', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-06', title: '振替休日', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-07', title: '生徒総会（6時間目 校内体育館）', type: TaskType.STUDY, isImportant: true },
  { subjectId: 'school', date: '2026-05-07', title: '検尿二次', type: TaskType.DEADLINE, isImportant: true },
  { subjectId: 'school', date: '2026-05-08', title: '1学年部活動発足会', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-11', title: '前期人権週間（～22日）/教育相談', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-12', title: '鑑賞音楽会（近隣施設）', type: TaskType.STUDY, isImportant: true },
  { subjectId: 'school', date: '2026-05-13', title: '運動器検診（1年）', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-14', title: '復習テスト（3年）', type: TaskType.DEADLINE, isImportant: true },
  { subjectId: 'school', date: '2026-05-15', title: '教育相談', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-16', title: '市民スポーツ大会', type: TaskType.STUDY, isImportant: true },
  { subjectId: 'school', date: '2026-05-17', title: '市民スポーツ大会', type: TaskType.STUDY, isImportant: true },
  { subjectId: 'school', date: '2026-05-18', title: '眼科検診1,3年', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-19', title: '耳鼻科検診', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-20', title: '内科検診（3年）', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-21', title: '全校応援練習（生徒集会①）', type: TaskType.STUDY, isImportant: true },
  { subjectId: 'school', date: '2026-05-25', title: '教育相談', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-26', title: '教育相談/CS運営委', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-27', title: '内科検診（2年）', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-28', title: '中信大会壮行会', type: TaskType.STUDY, isImportant: true },
  { subjectId: 'school', date: '2026-05-28', title: '部活動保護者公開日①', type: TaskType.STUDY, isImportant: true },
  { subjectId: 'school', date: '2026-05-29', title: '部活動保護者公開日②', type: TaskType.STUDY },
  { subjectId: 'school', date: '2026-05-30', title: '中信大会（テニス・卓球）', type: TaskType.STUDY, isImportant: true },
];

export type View = 'home' | 'calendar' | 'progress' | 'subjects' | 'review' | 'search' | 'articles' | 'about' | 'sync';

const App: React.FC = () => {
  const [subjects, setSubjects] = useCookieState<Subject[]>('subjects', DEFAULT_SUBJECTS);
  const [tasks, setTasks] = useCookieState<Task[]>('tasks', []);
  const [reviewResults, setReviewResults] = useCookieState<ReviewResult[]>('reviewResults', []);
  const [userProgress, setUserProgress] = useCookieState<UserProgress>('userProgress', {
    level: 1,
    xp: 0,
    badges: INITIAL_BADGES,
    unlockedTitles: ['ひよこ研究者'],
    activeTitle: 'ひよこ研究者',
    articlesReadCount: 0,
    reviewsCompletedCount: 0,
    isMember: false
  });
  const [apiKey, setApiKey] = useCookieState<string>('gemini_api_key', '');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [activeView, setActiveView] = useState<View>('home');
  const [hasInjectedMayTasks, setHasInjectedMayTasks] = useCookieState<boolean>('hasInjectedMayTasks', false);
  const [d1UserId, setD1UserId] = useState<string | null>(() => localStorage.getItem('d1_user_id'));

  // Auto-sync state changes to D1 Cloud in real-time if logged in
  useEffect(() => {
    if (!d1UserId) return;

    const timeoutId = setTimeout(async () => {
      try {
        await fetch('/api/sync/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: d1UserId,
            subjects,
            tasks,
            reviewResults,
            userProgress,
          }),
        });
        console.log('⚡ D1 Database automatically synchronized.');
      } catch (e) {
        console.error('Failed to auto-sync to D1:', e);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [subjects, tasks, reviewResults, userProgress, d1UserId]);

  const [cookieConsent, setCookieConsent] = useState<string | null>(() => {
    const consent = getRawCookie('cookie_consent');
    if (consent) return consent;
    try {
      return window.localStorage.getItem('cookie_consent');
    } catch {
      return null;
    }
  });

  const handleAcceptCookies = () => {
    setCookie('cookie_consent', 'true', 365);
    try {
      window.localStorage.setItem('cookie_consent', 'true');
    } catch (e) {
      console.error(e);
    }
    setCookieConsent('true');
    
    // Save all current local state to cookies immediately
    setCookie('subjects', JSON.stringify(subjects));
    setCookie('tasks', JSON.stringify(tasks));
    setCookie('reviewResults', JSON.stringify(reviewResults));
    setCookie('userProgress', JSON.stringify(userProgress));
    setCookie('gemini_api_key', apiKey);
    setCookie('hasInjectedMayTasks', JSON.stringify(hasInjectedMayTasks));
  };

  const handleRejectCookies = () => {
    setCookie('cookie_consent', 'rejected', 365);
    try {
      window.localStorage.setItem('cookie_consent', 'rejected');
    } catch (e) {
      console.error(e);
    }
    setCookieConsent('rejected');

    // Delete any existing cookies to respect user rejection
    deleteCookie('subjects');
    deleteCookie('tasks');
    deleteCookie('reviewResults');
    deleteCookie('userProgress');
    deleteCookie('gemini_api_key');
    deleteCookie('hasInjectedMayTasks');
  };
  
  useEffect(() => {
    if (!hasInjectedMayTasks) {
      const tasksToAdd: Task[] = MAY_2026_TASKS.map(t => ({
        ...t,
        id: crypto.randomUUID(),
        isCompleted: false
      }));
      setTasks(prev => [...prev, ...tasksToAdd]);
      setHasInjectedMayTasks(true);
    }
  }, [hasInjectedMayTasks, setTasks, setHasInjectedMayTasks]);
  
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

    const isMember = !!newProgress.isMember;

    const updateBadge = (id: string, condition: boolean, isPremium: boolean = false) => {
        const badge = newBadges.find(b => b.id === id);
        if (badge && !badge.achieved && condition) {
            if (isPremium && !isMember) {
                return; // Requires member login to unlock
            }
            badge.achieved = true;
            totalXpGained += (badge.xpReward || 0);
            changed = true;
        }
    };

    // Standard Badges
    updateBadge('first_step', tasks.some(t => t.isCompleted));

    const totalStudyHours = tasks
      .filter(t => t.type === TaskType.STUDY && t.isCompleted && t.duration)
      .reduce((sum, task) => sum + (task.duration || 0), 0);
    
    updateBadge('study_10h', totalStudyHours >= 10);

    // Premium Badges (requires Member login)
    updateBadge('study_50h', totalStudyHours >= 50, true);
    
    // perfect_week condition: e.g. at least 7 completed tasks
    const completedTasksCount = tasks.filter(t => t.isCompleted).length;
    updateBadge('perfect_week', completedTasksCount >= 7, true);

    const completedDeadlines = tasks.filter(t => t.type === TaskType.DEADLINE && t.isCompleted).length;
    updateBadge('deadline_master', completedDeadlines >= 5, true);
    
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

    // Check titles
    const unlockedTitles = [...(newProgress.unlockedTitles || ['ひよこ研究者'])];
    const newTitles: string[] = [];

    // Level-based titles (10+ or 15+ are Premium)
    if (currentLevel >= 5 && !unlockedTitles.includes('学習の達人')) {
      newTitles.push('学習の達人');
      changed = true;
    }
    if (currentLevel >= 10 && !unlockedTitles.includes('知恵の賢者')) {
      if (isMember) {
        newTitles.push('知恵の賢者');
        changed = true;
      }
    }
    if (currentLevel >= 15 && !unlockedTitles.includes('全知全能の開拓者')) {
      if (isMember) {
        newTitles.push('全知全能の開拓者');
        changed = true;
      }
    }

    // Article-based titles (10+ is Premium)
    const completedArticles = newProgress.articlesReadCount || 0;
    if (completedArticles >= 1 && !unlockedTitles.includes('読書家')) {
      newTitles.push('読書家');
      changed = true;
    }
    if (completedArticles >= 5 && !unlockedTitles.includes('情報通')) {
      newTitles.push('情報通');
      changed = true;
    }
    if (completedArticles >= 10 && !unlockedTitles.includes('博識')) {
      if (isMember) {
        newTitles.push('博識');
        changed = true;
      }
    }

    // Review-based titles (5+ or PerfectQuiz are Premium)
    const completedReviews = newProgress.reviewsCompletedCount || 0;
    if (completedReviews >= 1 && !unlockedTitles.includes('振り返る主')) {
      newTitles.push('振り返る主');
      changed = true;
    }
    if (completedReviews >= 5 && !unlockedTitles.includes('復習ハッカー')) {
      if (isMember) {
        newTitles.push('復習ハッカー');
        changed = true;
      }
    }
    const hasPerfectScore = reviewResults.some(r => r.score === r.total && r.total > 0);
    if (hasPerfectScore && !unlockedTitles.includes('クイズマスター')) {
      if (isMember) {
        newTitles.push('クイズマスター');
        changed = true;
      }
    }

    if (newTitles.length > 0) {
      newProgress.unlockedTitles = [...unlockedTitles, ...newTitles];
    }

    if (!newProgress.activeTitle) {
      newProgress.activeTitle = 'ひよこ研究者';
      changed = true;
    }

    if (changed) {
      newProgress.badges = newBadges;
      setUserProgress(newProgress);
    }
  }, [tasks, userProgress, reviewResults, setUserProgress]);

  useEffect(() => {
    checkAchievements();
  }, [tasks, reviewResults, userProgress.articlesReadCount, userProgress.reviewsCompletedCount, userProgress.isMember, checkAchievements]);

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

  const handleReadArticle = (_articleId: string) => {
    setUserProgress(prev => {
      const updatedCount = (prev.articlesReadCount || 0) + 1;
      return {
        ...prev,
        articlesReadCount: updatedCount
      };
    });
  };

  const handleReviewComplete = (result: ReviewResult) => {
    setReviewResults([...reviewResults, result]);
    setUserProgress(prev => {
      const updatedCount = (prev.reviewsCompletedCount || 0) + 1;
      return {
        ...prev,
        reviewsCompletedCount: updatedCount
      };
    });
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
        return (
          <ProgressView 
            userProgress={userProgress} 
            xpForNextLevel={xpForNextLevel} 
            tasks={tasks}
            onSetActiveTitle={(title) => setUserProgress(prev => ({ ...prev, activeTitle: title }))}
            onToggleMemberStatus={(status) => setUserProgress(prev => ({ ...prev, isMember: status }))}
          />
        );
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
            onSaveResult={handleReviewComplete}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        );
      case 'search':
        return <StudySearchView />;
      case 'articles':
        return <ArticlesView onNavigate={setActiveView} onReadArticle={handleReadArticle} />;
      case 'about':
        return <AboutView />;
      case 'sync':
        return (
          <SyncView 
            subjects={subjects}
            tasks={tasks}
            reviewResults={reviewResults}
            userProgress={userProgress}
            setSubjects={setSubjects}
            setTasks={setTasks}
            setReviewResults={setReviewResults}
            setUserProgress={setUserProgress}
            loggedInUser={d1UserId}
            setLoggedInUser={setD1UserId}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative overflow-hidden">
      <MeshBackground intensity="opacity-30" />
      
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
        d1UserId={d1UserId}
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

      {/* Cookie Consent Banner */}
      {!cookieConsent && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-modal-enter">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Icon name="sparkles" className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                  クッキー使用許可のお願い
                </h4>
                <p className="text-xs text-slate-350 leading-relaxed">
                  当サイトでは、カレンダーの予定、教科設定、学習記録などの各種情報を安全に自動保存するためにクッキー（Cookie）を使用しています。許可いただくことで次回訪問時も学習記録を自動的に引き継ぐことができます。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleRejectCookies}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/50 transition-all active:scale-[0.98] cursor-pointer"
              >
                拒否する
              </button>
              <button
                onClick={handleAcceptCookies}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-550 text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                許可する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
