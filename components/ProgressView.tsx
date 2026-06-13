import React, { useState } from 'react';
import { UserProgress, Task, TaskType, ReviewResult } from '../types';
import Icon from './Icon';

export interface TitleDefinition {
  id: string;
  name: string;
  description: string;
  requirement: string;
  icon: string;
  colorClass: string;
}

export const TITLE_DEFINITIONS: TitleDefinition[] = [
  { id: 'baby_scholar', name: 'ひよこ研究者', description: '最初の第一歩を踏み出した学習者', requirement: '初期状態', icon: 'sparkles', colorClass: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'study_adept', name: '学習の達人', description: '勉強のコツを掴み、一歩リードした努力家', requirement: 'レベル 5 到達', icon: 'award', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'wisdom_sage', name: '知恵の賢者', description: '卓越した学習意欲を持つ、抜群の頭脳', requirement: 'レベル 10 到達 (※会員専用)', icon: 'book', colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'all_mighty', name: '全知全能の開拓者', description: '自立学習の極地に達した大いなる開拓者', requirement: 'レベル 15 到達 (※会員専用)', icon: 'globe', colorClass: 'bg-violet-50 text-violet-700 border-violet-200' },
  { id: 'active_reader', name: '読書家', description: '積極的に学習記事を読みふける、探究心の持ち主', requirement: '学習記事を 1 つ以上読む', icon: 'book-open', colorClass: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'informed_mind', name: '情報通', description: '多くの解説記事からインプットを深めた人', requirement: '学習記事を 5 つ以上読む', icon: 'pencil', colorClass: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'knowledge_seeker', name: '博識', description: 'あらゆる解説知識を網羅した知の巨人', requirement: '学習記事を 10 つ以上読む (※会員専用)', icon: 'flask', colorClass: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'reflective_mind', name: '振り返る主', description: '復習クイズに果敢に臨み、振り返ることを怠らない者', requirement: '復習テストを 1 回以上完了', icon: 'history', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'review_hacker', name: '復習ハッカー', description: '反復学習の鬼才。暗記と論理をハックする者', requirement: '復習テストを 5 回以上完了 (※会員専用)', icon: 'settings', colorClass: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'quiz_master', name: 'クイズマスター', description: '復習テストでパーフェクト正解（100点満点）を勝ち取った者', requirement: '復習テストで100%スコアを獲得 (※会員専用)', icon: 'award', colorClass: 'bg-rose-50 text-rose-700 border-rose-200' },
];

interface ProgressViewProps {
  userProgress: UserProgress;
  xpForNextLevel: number;
  tasks?: Task[];
  reviewResults?: ReviewResult[];
  onSetActiveTitle?: (title: string) => void;
  onToggleMemberStatus?: (status: boolean) => void;
}

type TabTypeSetting = 'all' | 'unlocked';
type PassportTheme = 'royal_gold' | 'cyber_midnight' | 'emerald_nature' | 'sweet_sakura';

const ProgressView: React.FC<ProgressViewProps> = ({ 
  userProgress, 
  xpForNextLevel, 
  tasks = [], 
  reviewResults = [],
  onSetActiveTitle,
  onToggleMemberStatus
}) => {
  const [activeTab, setActiveTab] = useState<TabTypeSetting>('all');
  const [passportTheme, setPassportTheme] = useState<PassportTheme>('royal_gold');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const xpPercentage = xpForNextLevel > 0 ? (userProgress.xp / xpForNextLevel) * 100 : 0;
  
  // Calculate stats from tasks list
  const completedTasks = tasks.filter(t => t.isCompleted);
  const totalCompletedTasksCount = completedTasks.length;
  
  const totalStudyHours = completedTasks
    .filter(t => t.type === TaskType.STUDY && t.duration)
    .reduce((sum, task) => sum + (task.duration || 0), 0);

  const articlesReadCount = userProgress.articlesReadCount || 0;
  const reviewsCompletedCount = userProgress.reviewsCompletedCount || 0;
  const unlockedTitles = userProgress.unlockedTitles || ['ひよこ研究者'];
  const activeTitle = userProgress.activeTitle || 'ひよこ研究者';

  // Dynamic unlocked assets filtering
  const achievedBadges = userProgress.badges.filter(b => b.achieved);
  const totalBadgesCount = userProgress.badges.length;

  // Generate dynamic chronological unlock logs based on cookie/localstorage achievements to prevent state-drift & make it persistent!
  const generateUnlockLogs = () => {
    const logs: { id: string; category: string; title: string; desc: string; icon: string; timeOffset: string; type: 'badge' | 'level' | 'title' | 'info' }[] = [];
    
    // 1. Initial State Unlock
    logs.push({
      id: 'initial_scholar',
      category: '称号アンロック',
      title: 'ひよこ研究者',
      desc: '自立学習アプリ「Study-Side」に参加し、ひよこ研究者の称号を獲得しました！',
      icon: 'sparkles',
      timeOffset: '始まりの日',
      type: 'title'
    });

    // 2. Active Tasks Milestone
    if (totalCompletedTasksCount >= 1) {
      logs.push({
        id: 'completed_task_1',
        category: 'システム実績',
        title: '初志貫徹 (タスク完了)',
        desc: 'カレンダーの予定から、初めての学習タスクを完了して進捗を記録しました。',
        icon: 'check-circle',
        timeOffset: '学習開始時',
        type: 'info'
      });
    }

    // 3. Badges unlocked
    achievedBadges.forEach(badge => {
      logs.push({
        id: `log-badge-${badge.id}`,
        category: 'バッジアンロック',
        title: badge.name,
        desc: `${badge.description} を達成し、バッジをアンロックしました！`,
        icon: badge.icon || 'award',
        timeOffset: 'アンロック完了済',
        type: 'badge'
      });
    });

    // 4. Level Milestone Logs
    for (let l = 2; l <= userProgress.level; l++) {
      let linkedTitle = '';
      if (l === 5) linkedTitle = ' 【称号：学習の達人 解放】';
      if (l === 10) linkedTitle = ' 【称号：知恵の賢者 解放】';
      if (l === 15) linkedTitle = ' 【称号：全知全能の開拓者 解放】';

      logs.push({
        id: `level-log-${l}`,
        category: 'レベルアップ',
        title: `レベル ${l} 到達！${linkedTitle}`,
        desc: `日々の学習成果とカレンダーの予定回収により、Lv.${l} にステータスが向上しました。`,
        icon: 'trending-up',
        timeOffset: `${l}次関門突破`,
        type: 'level'
      });
    }

    // 5. Title based on Articles
    if (articlesReadCount >= 1) {
      logs.push({
        id: 'article_title_1',
        category: '称号アンロック',
        title: '読書家',
        desc: '学習の解説記事を 1 つ以上読んだため、称号「読書家」が解放されました。',
        icon: 'book-open',
        timeOffset: 'インプット達成',
        type: 'title'
      });
    }
    if (articlesReadCount >= 5) {
      logs.push({
        id: 'article_title_5',
        category: '称号アンロック',
        title: '情報通',
        desc: '学習の解説記事を 5 つ以上熟読し、称号「情報通」が解放されました。',
        icon: 'pencil',
        timeOffset: 'インプット探究',
        type: 'title'
      });
    }
    if (articlesReadCount >= 10) {
      logs.push({
        id: 'article_title_10',
        category: '称号アンロック',
        title: '博識',
        desc: '古今東西の学習テーマに関する解説記事を 10 つ制覇し、最高位の称号「博識」が解放されました。',
        icon: 'flask',
        timeOffset: '知識の探究者',
        type: 'title'
      });
    }

    // 6. Title based on QuizReviews
    if (reviewsCompletedCount >= 1) {
      logs.push({
        id: 'review_title_1',
        category: '称号アンロック',
        title: '振り返る主',
        desc: 'テスト対策のための復習クイズを 1 回以上完了し、称号「振り返る主」を獲得しました。',
        icon: 'history',
        timeOffset: '復習インテリジェンス',
        type: 'title'
      });
    }
    if (reviewsCompletedCount >= 5) {
      logs.push({
        id: 'review_title_5',
        category: '称号アンロック',
        title: '復習ハッカー',
        desc: '復習用のパーソナライズAI生成テストを 5 回突破し、称号「復習ハッカー」が解放されました。',
        icon: 'settings',
        type: 'title',
        timeOffset: '復習の極致'
      });
    }

    // 7. Check if perfect quiz is present in unlocked list
    if (unlockedTitles.includes('クイズマスター')) {
      logs.push({
        id: 'quiz_master_title',
        category: '称号アンロック',
        title: 'クイズマスター',
        desc: '復習クイズにて、全問正解パーフェクト勝利（正解率 100%）を収めて称号を獲得しました。',
        icon: 'award',
        timeOffset: '無敵の正解率',
        type: 'title'
      });
    }

    return logs;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    // Decodes base64 obfuscated password 'chiku-2026'
    const decryptedPassword = atob('Y2hpa3UtMjAyNg==');
    if (password === decryptedPassword) {
      if (onToggleMemberStatus) {
        onToggleMemberStatus(true);
      }
      setPassword('');
    } else {
      setLoginError('認証キーが間違っています。');
    }
  };

  const unlockLogs = generateUnlockLogs();

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* 会員専用ログイン・メンバーシップステータス管理 */}
      <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-black/40 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-1 px-2.5 text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                Premium Verification
              </span>
              {userProgress.isMember ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-amber-400/10 text-amber-300 rounded-full border border-amber-400/20 px-2.5 py-1">
                  <Icon name="sparkles" className="w-3 h-3 text-amber-300" />
                  プレミアム会員ログイン中
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-slate-900 text-slate-400 rounded-full border border-slate-800 px-2.5 py-1">
                  <Icon name="lock" className="w-3 h-3 text-slate-400" />
                  一般メンバー (一部解放制限)
                </span>
              )}
            </div>
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Icon name="award" className="w-5.5 h-5.5 text-indigo-400" />
              <span>会員専用ログイン（実績解放キーマネージャー）</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              {userProgress.isMember 
                ? "認証に成功しました！プレミアム機能及び全ての上位グレードステータス（「知恵の賢者」「全知全能の開拓者」等の高級称号、及び「努力家」「提出マスター」等の特級バッジの条件クリア自動解放）が完全に開放されています。"
                : "「知恵の賢者」を含む上位ステータス称号・バッジを解放するには会員専用ログインが必要です。難読パスワード（パスコード/英数記号）を入力し認証を完了してください。"}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {userProgress.isMember ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-[9px] font-bold text-slate-500 leading-none">STATUS</p>
                  <p className="text-xs font-black text-amber-400 mt-1">VERIFIED PREMIUM</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleMemberStatus && onToggleMemberStatus(false)}
                  className="w-full md:w-auto px-5 py-2.5 bg-rose-950/20 hover:bg-rose-900/40 border border-rose-900 text-rose-300 text-xs font-black rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="log-out" className="w-3.5 h-3.5" />
                  <span>認証解除 (ログアウト)</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-2">
                <div className="flex items-center gap-2 w-full md:w-[280px]">
                  <div className="relative flex-grow">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="会員用パスワードを入力..."
                      className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 text-white placeholder-slate-700 text-xs font-bold rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <Icon name="lock" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-black rounded-xl transition-all active:scale-95 whitespace-nowrap shadow-md shadow-indigo-950/50"
                  >
                    認証する
                  </button>
                </div>
                {loginError && (
                  <p className="text-[10px] font-extrabold text-rose-400 text-right">{loginError}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Tab Navigation Filter Block */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-sm font-black tracking-tight border-b-2 transition-all flex items-center gap-2 px-1 ${
            activeTab === 'all'
              ? 'border-indigo-600 text-indigo-700 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Icon name="chart-bar" className="w-4 h-4" />
          <span>すべての実績 & 進捗</span>
        </button>
        <button
          onClick={() => setActiveTab('unlocked')}
          className={`pb-3 text-sm font-black tracking-tight border-b-2 transition-all flex items-center gap-2 px-1 relative ${
            activeTab === 'unlocked'
              ? 'border-indigo-600 text-indigo-700 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Icon name="sparkles" className="w-4 h-4 text-amber-500" />
          <span>アンロック済みのステータス</span>
          {unlockLogs.length > 0 && (
            <span className="absolute -top-1 -right-4 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-black text-white">
              {unlockLogs.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'all' ? (
        <>
          {/* Overview Block with Progress */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <span className="text-xs font-black tracking-widest text-indigo-500 uppercase">Current Achievement Status</span>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <h2 className="text-3xl font-black text-slate-800">学習の進捗と実績</h2>
                    {activeTitle && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-black border border-amber-200 shadow-sm">
                        <Icon name="award" className="w-3.5 h-3.5 text-amber-500" />
                        <span>現在の称号: {activeTitle}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-400">レベルアップまであと {Math.ceil(xpForNextLevel - userProgress.xp)} XP</span>
                </div>
              </div>

              {/* Level and XP bar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-3 flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-md shadow-indigo-100">
                    Lv.{userProgress.level}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold">現在のレベル</p>
                    <p className="text-sm font-extrabold text-indigo-700">XP {Math.round(userProgress.xp)} / {xpForNextLevel}</p>
                  </div>
                </div>
                <div className="lg:col-span-9 w-full bg-slate-100 rounded-full h-5 overflow-hidden border border-slate-200/50 p-[2px]">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.max(4, xpPercentage)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Dashboard Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
              <span className="text-slate-400 text-xs font-bold">レベル</span>
              <p className="text-3xl font-black text-indigo-600 mt-2">{userProgress.level}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
              <span className="text-slate-400 text-xs font-bold">総学習時間</span>
              <p className="text-3xl font-black text-rose-500 mt-2">{totalStudyHours}時間</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
              <span className="text-slate-400 text-xs font-bold">タスク完了</span>
              <p className="text-3xl font-black text-green-500 mt-2">{totalCompletedTasksCount}件</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
              <span className="text-slate-400 text-xs font-bold">読んだ解説記事数</span>
              <p className="text-3xl font-black text-sky-500 mt-2">{articlesReadCount}本</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
              <span className="text-slate-400 text-xs font-bold">完了した復習</span>
              <p className="text-3xl font-black text-amber-500 mt-2">{reviewsCompletedCount}回</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
              <span className="text-slate-400 text-xs font-bold">獲得バッジ数</span>
              <p className="text-3xl font-black text-violet-500 mt-2">
                {achievedBadges.length} / {totalBadgesCount}
              </p>
            </div>
          </div>

          {/* Achievements / Titles System */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Icon name="award" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">称号システム (Titles)</h3>
                  <p className="text-xs text-slate-400">学習のアクションを満たすことで新しい称号が解放されます。プロフィールにセットしてみましょう！</p>
                </div>
              </div>
              <div className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                獲得称号: {unlockedTitles.length} / {TITLE_DEFINITIONS.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TITLE_DEFINITIONS.map(def => {
                const isUnlocked = unlockedTitles.includes(def.name);
                const isActive = activeTitle === def.name;
                const isPremium = ["知恵の賢者", "全知全能の開拓者", "博識", "復習ハッカー", "クイズマスター"].includes(def.name);

                // Calculate if condition is met regardless of isMember status
                let conditionMet = false;
                if (def.id === 'wisdom_sage') {
                  conditionMet = userProgress.level >= 10;
                } else if (def.id === 'all_mighty') {
                  conditionMet = userProgress.level >= 15;
                } else if (def.id === 'knowledge_seeker') {
                  conditionMet = articlesReadCount >= 10;
                } else if (def.id === 'review_hacker') {
                  conditionMet = reviewsCompletedCount >= 5;
                } else if (def.id === 'quiz_master') {
                  conditionMet = reviewResults.some(r => r.score === r.total && r.total > 0);
                }

                return (
                  <div 
                    key={def.id}
                    className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                      isUnlocked 
                        ? isActive 
                          ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-200/50 shadow-sm' 
                          : 'bg-slate-50/50 border-slate-200 hover:border-indigo-200 hover:bg-white'
                        : isPremium && conditionMet
                          ? 'bg-amber-50/10 border-amber-300 cursor-pointer hover:bg-amber-50/20'
                          : 'bg-slate-50/30 border-slate-100 opacity-55'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${isUnlocked ? def.colorClass : 'bg-slate-200 text-slate-400 border border-slate-200'}`}>
                      <Icon name={def.icon} className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-grow space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-black text-base ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                          {def.name}
                        </p>
                        {isUnlocked ? (
                          isActive ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider">
                              選択中
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[9px] font-bold">
                              獲得済
                            </span>
                          )
                        ) : isPremium ? (
                          conditionMet ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                              <Icon name="lock" className="w-2.5 h-2.5 text-white" />
                              条件達成！会員ロック
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-[9px] font-bold flex items-center gap-0.5">
                              <Icon name="lock" className="w-2.5 h-2.5 text-indigo-600" />
                              会員用プレミアム
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-400 text-[9px] font-bold border border-slate-200">
                            未獲得
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">{def.description}</p>
                      <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                        <span className="font-extrabold text-slate-400">【解放基準】</span>
                        <span>{def.requirement}</span>
                      </p>
                      {isPremium && !isUnlocked && conditionMet && (
                        <p className="text-[10px] text-amber-600 font-extrabold flex items-center gap-1 mt-0.5">
                          ⚠️ 件名条件クリア！最上部で会員認証すると即時セット可能です
                        </p>
                      )}
                    </div>

                    {isUnlocked && !isActive && onSetActiveTitle && (
                      <button
                        onClick={() => onSetActiveTitle(def.name)}
                        className="shrink-0 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-black rounded-lg transition-all active:scale-95"
                      >
                        セット
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Inventory block */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Icon name="check-circle" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">獲得したバッジ (Badges)</h3>
                  <p className="text-xs text-slate-400">実績ミッションを達成して得られる誇りある勲章です</p>
                </div>
              </div>
              <div className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                解放率: {Math.round((achievedBadges.length / totalBadgesCount) * 100)}%
              </div>
            </div>

            {userProgress.badges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProgress.badges.map(badge => {
                  const isBadgePremium = ["study_50h", "deadline_master", "perfect_week"].includes(badge.id);
                  
                  let badgeConditionMet = false;
                  if (badge.id === 'study_50h') {
                    badgeConditionMet = totalStudyHours >= 50;
                  } else if (badge.id === 'deadline_master') {
                    const completedDeadlines = tasks.filter(t => t.type === TaskType.DEADLINE && t.isCompleted).length;
                    badgeConditionMet = completedDeadlines >= 5;
                  } else if (badge.id === 'perfect_week') {
                    const completedTasksCount = tasks.filter(t => t.isCompleted).length;
                    badgeConditionMet = completedTasksCount >= 7;
                  }

                  return (
                    <div
                      key={badge.id}
                      className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
                        badge.achieved
                          ? 'bg-gradient-to-tr from-amber-50/50 to-white border-amber-300 shadow-sm'
                          : isBadgePremium && badgeConditionMet
                            ? 'bg-amber-50/20 border-amber-400 animate-pulse'
                            : 'bg-slate-50/20 border-slate-100 opacity-60'
                      }`}
                    >
                      <div className={`p-3 rounded-full shrink-0 ${badge.achieved ? 'bg-amber-400 text-white ring-4 ring-amber-100' : 'bg-slate-200 text-slate-400'}`}>
                        <Icon name={badge.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className={`font-black ${badge.achieved ? 'text-amber-900 text-base' : 'text-slate-400 text-base'}`}>
                            {badge.name}
                          </p>
                          {isBadgePremium && !badge.achieved && (
                            badgeConditionMet ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[8px] font-black tracking-tight flex items-center gap-0.5 animate-pulse">
                                <Icon name="lock" className="w-2 h-2 text-white" />
                                条件達成！
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100/30 text-indigo-600 text-[8px] font-bold">
                                会員用
                              </span>
                            )
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-0.5">{badge.description}</p>
                        {badge.xpReward && !badge.achieved && (
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="inline-block bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">+{badge.xpReward} XP</span>
                            {isBadgePremium && badgeConditionMet && (
                              <span className="inline-block text-rose-500 text-[9px] font-black">⚠️ 会員ログインで即解放</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-medium">まだバッジを獲得していません。学習を進めてみましょう！</p>
            )}
          </div>
        </>
      ) : (
        /* Dynamic Unlock State Checking Panel with Premium Certificate Stamp Passport Card */
        <div className="space-y-8 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand: Gorgeous passport learning badge card representing overall unlocked states */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="palette" className="w-4 h-4 text-violet-500" />
                  実績証明カード
                </h3>
                {/* Theme Selector */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {(['royal_gold', 'cyber_midnight', 'emerald_nature', 'sweet_sakura'] as PassportTheme[]).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setPassportTheme(theme)}
                      className={`w-5 h-5 rounded-full transition-all border ${
                        theme === 'royal_gold' ? 'bg-amber-400 border-amber-300' :
                        theme === 'cyber_midnight' ? 'bg-slate-900 border-slate-800' :
                        theme === 'emerald_nature' ? 'bg-emerald-600 border-emerald-500' :
                        'bg-pink-400 border-pink-300'
                      } ${passportTheme === theme ? 'ring-2 ring-indigo-500 scale-110' : 'scale-90 opacity-70'}`}
                      title={theme.toUpperCase()}
                    />
                  ))}
                </div>
              </div>

              {/* Passport Certificate Card with Dynamic Themes */}
              <div 
                className={`relative p-8 rounded-[2.5rem] text-white overflow-hidden shadow-xl border select-none transition-all duration-300 ${
                  passportTheme === 'royal_gold' 
                    ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-800 border-amber-500/30' 
                    : passportTheme === 'cyber_midnight' 
                      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border-slate-700/40'
                      : passportTheme === 'emerald_nature'
                        ? 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 border-emerald-650/30'
                        : 'bg-gradient-to-br from-pink-500 via-rose-600 to-amber-700 border-pink-400/40'
                }`}
              >
                {/* Decorative backgrounds */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-black/10 rounded-full blur-xl"></div>
                
                {/* Stamp ribbon overlay */}
                <div className="absolute top-8 right-8 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-white/40 flex items-center justify-center p-1 rotate-12 bg-white/5 hover:rotate-45 transition-transform duration-500">
                    <div className="w-full h-full rounded-full bg-white/10 flex flex-col items-center justify-center">
                      <span className="text-[7px] font-black tracking-widest leading-none">APPROVED</span>
                      <Icon name="award" className="w-4 h-4 text-white/80 mt-0.5" />
                      <span className="text-[6px] font-bold text-white/50 leading-none mt-0.5">STUDY</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <span className="text-[8px] font-black tracking-widest text-white/60 block uppercase">Official Digital Passport</span>
                    <h4 className="text-xl font-black tracking-tight flex items-center gap-1.5 text-white">
                      <span>Study-Side 学習技能証明証</span>
                    </h4>
                    <p className="text-[9px] text-white/50 tracking-wide font-mono mt-0.5">ID: {crypto.randomUUID().slice(0, 18).toUpperCase()}</p>
                  </div>

                  {/* Stamp Info list */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-b border-white/10 py-4 font-mono text-xs">
                    <div>
                      <p className="text-[9px] text-white/50 font-sans">獲得レベル</p>
                      <p className="font-extrabold text-white text-base">LEVEL {userProgress.level}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/50 font-sans">選択中のアクティブ称号</p>
                      <p className="font-black text-amber-300 truncate text-sm flex items-center gap-1.5">
                        <Icon name="sparkles" className="w-3.5 h-3.5 shrink-0" />
                        <span>{activeTitle}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/50 font-sans">カレンダー完了タスク</p>
                      <p className="font-extrabold text-white">{totalCompletedTasksCount} 回の活動</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/50 font-sans">アンロック済みの称号</p>
                      <p className="font-extrabold text-white">{unlockedTitles.length} つ解放済み</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/50 font-sans">完了した復習クイズ</p>
                      <p className="font-extrabold text-white">{reviewsCompletedCount} 試験完了</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/50 font-sans">獲得済みのバッジバッジ</p>
                      <p className="font-extrabold text-white">{achievedBadges.length} つ獲得済</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] text-white/50 font-sans">総学習時間</p>
                      <p className="text-xl font-black font-mono">{totalStudyHours}h <span className="text-[10px] text-white/60">学習達成</span></p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block border border-white/20 px-3 py-1 rounded bg-white/5 text-[9px] font-bold tracking-widest font-mono">
                        VERIFIED SECURE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl text-[11px] text-slate-500 leading-relaxed flex items-start gap-2.5">
                <Icon name="info" className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong>ステータス保存の仕組み:</strong><br />
                  この進捗状況・アンロックされたステータスの実績はブラウザの <strong>Cookie (クッキー) ＆ ローカルストレージ</strong> の両方に完全バックアップされています。ブラウザのリロードや一時的なキャッシュクリア耐性があり、獲得した称号やレベル、学習実績がいつでもシームレスに引き継がれます。
                </div>
              </div>
            </div>

            {/* Right Hand: Detailed checking list of dynamically mapped unlock logs */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Icon name="history" className="w-4 h-4 text-indigo-500" />
                これまでのアンロック履歴タイムライン ({unlockLogs.length}件)
              </h3>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6 max-h-[580px] overflow-y-auto">
                <p className="text-xs text-slate-400 font-semibold italic border-b border-slate-100 pb-3">※学習行動（レベルアップ、解説記事読了、復習テスト完了、バッジ達成）に伴い、時系列を自動遡行してアンロック履歴が出力されています。</p>
                
                {unlockLogs.length > 0 ? (
                  <div className="relative border-l-2 border-indigo-100 pl-4 ml-3.5 space-y-6">
                    {unlockLogs.map((log) => (
                      <div key={log.id} className="relative group">
                        
                        {/* Dot indicator */}
                        <span className="absolute -left-[27px] top-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 border-2 border-indigo-600 shadow-sm transition-transform group-hover:scale-110">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                        </span>

                        <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-1.5">
                            <span className="inline-block text-[8px] tracking-widest uppercase font-black px-2 py-0.5 rounded bg-indigo-150 text-indigo-700 bg-indigo-100 border border-indigo-200/40">
                              {log.category}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              {log.timeOffset}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-1">
                            <Icon name={log.icon} className="w-5 h-5 text-indigo-600" />
                            <h4 className="font-extrabold text-slate-800 text-sm">{log.title}</h4>
                          </div>

                          <p className="text-xs text-slate-500 font-semibold leading-relaxed pl-1">
                            {log.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="info" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-black">アンロックされた実績がまだありません。</p>
                    <p className="text-xs text-slate-400 font-semibold mt-1">カレンダーの予定学習やクイズを完了してアンロックしてみましょう！</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Quick interactive stamp book grid showing active checking elements */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 mt-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Icon name="check-circle" className="w-5 h-5 text-indigo-500" />
              アンロック称号スタンプ帳 (Title Stamp Book)
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              現在解放されているすべての称号ステータスです。アンロック済みのスタンプを押してビジュアルで確認できます。
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 pt-2">
              {TITLE_DEFINITIONS.map(def => {
                const isUnlocked = unlockedTitles.includes(def.name);
                return (
                  <div 
                    key={def.id}
                    className={`p-4 rounded-2xl border flex flex-col items-center text-center justify-between transition-all ${
                      isUnlocked 
                        ? 'bg-amber-50/20 border-amber-300 ring-1 ring-amber-100 shadow-sm scale-100' 
                        : 'bg-slate-50/20 border-slate-100 opacity-40 grayscale scale-95'
                    }`}
                  >
                    <div className={`p-3 rounded-full shrink-0 ${isUnlocked ? 'bg-amber-400 text-white ring-4 ring-amber-50' : 'bg-slate-200 text-slate-400'}`}>
                      <Icon name={def.icon} className="w-5 h-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-black text-slate-800 tracking-tight leading-snug">{def.name}</p>
                      <p className="text-[8px] font-black text-amber-700 bg-amber-100/50 px-1.5 py-0.5 rounded-full mt-1 border border-amber-200/30 overflow-hidden truncate max-w-[120px] mx-auto">
                        {isUnlocked ? "UNLOCKED" : "LOCKED"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default ProgressView;

