import React, { useState, useEffect } from 'react';
import { Subject, Task, ReviewResult, UserProgress } from '../types';
import Icon from './Icon';
import { UserAvatar } from './UserAvatar';

interface SyncViewProps {
  subjects: Subject[];
  tasks: Task[];
  reviewResults: ReviewResult[];
  userProgress: UserProgress;
  setSubjects: (s: Subject[]) => void;
  setTasks: (t: Task[]) => void;
  setReviewResults: (r: ReviewResult[]) => void;
  setUserProgress: (p: UserProgress) => void;
  loggedInUser: string | null;
  setLoggedInUser: (u: string | null) => void;
}

const SyncView: React.FC<SyncViewProps> = ({
  subjects: _subjects,
  tasks: _tasks,
  reviewResults: _reviewResults,
  userProgress,
  setSubjects,
  setTasks,
  setReviewResults,
  setUserProgress,
  loggedInUser,
  setLoggedInUser,
}) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [typedUserAvatar, setTypedUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (!userId.trim() || isRegister) {
      setTypedUserAvatar(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-user?userId=${encodeURIComponent(userId.trim())}`);
        const data = await res.json();
        if (res.ok && data.success && data.exists) {
          setTypedUserAvatar(data.avatar || 'DEFAULT_INITIALS');
        } else {
          setTypedUserAvatar(null);
        }
      } catch (e) {
        console.error('Error checking user:', e);
        setTypedUserAvatar(null);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [userId, isRegister]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 6000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      return showMessage('ユーザーIDとパスワードを入力してください。', 'error');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('アカウント登録が完了しました！作成したユーザー名とパスワードでログインしてください。', 'success');
        setIsRegister(false);
        setPassword('');
      } else {
        showMessage(data.message || '登録に失敗しました。', 'error');
      }
    } catch (err: any) {
      showMessage('通信に失敗しました: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      return showMessage('ユーザーIDとパスワードを入力してください。', 'error');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('d1_user_id', data.user.id);
        setLoggedInUser(data.user.id);
        showMessage('ログインしました！保存されているデータを読み込んでいます...', 'success');
        
        // Auto-pull immediately upon login
        await handlePull(data.user.id);
      } else {
        showMessage(data.message || 'ログインに失敗しました。', 'error');
      }
    } catch (err: any) {
      showMessage('通信に失敗しました: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('d1_user_id');
    setLoggedInUser(null);
    setUserId('');
    setPassword('');
    showMessage('ログアウトしました。これからは、この端末（スマホやPC）だけにデータが一時的に保存されます。', 'info');
  };

  const handlePull = async (targetUser?: string) => {
    const user = targetUser || loggedInUser;
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sync/pull?userId=${encodeURIComponent(user)}`);
      const resData = await res.json();
      if (res.ok && resData.success && resData.data) {
        const { subjects: cloudSubs, tasks: cloudTasks, reviewResults: cloudReviews, userProgress: cloudProgress } = resData.data;
        
        if (cloudSubs) setSubjects(cloudSubs);
        if (cloudTasks) setTasks(cloudTasks);
        if (cloudReviews) setReviewResults(cloudReviews);
        if (cloudProgress) setUserProgress(cloudProgress);

        showMessage('以前インターネットに保存したデータを、この端末に読み込みました！続きから勉強を始めましょう。', 'success');
      } else {
        showMessage('インターネット上に戻せるデータが見つかりませんでした。今の設定を「ネットに今すぐ保存」してください。', 'info');
      }
    } catch (err: any) {
      showMessage('データの読み込みに失敗しました: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 pb-12 animate-fade-in px-2 sm:px-4">
      <header className="space-y-2 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
            <Icon name="cloud" className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              勉強データをネットに保存
            </h2>
            <p className="text-xs sm:text-sm text-indigo-600 font-extrabold tracking-wider uppercase">
              データ保存・引き継ぎ（無料アカウント）
            </p>
          </div>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto sm:mx-0">
          無料のアカウントを作ってログインすると、カレンダーの予定、作成した教科、これまでの学習記録、現在のレベルやバッジなどのデータをインターネット上に安全に保存（バックアップ）できます。
          スマホを紛失したときや、他のパソコンやタブレットから使いたいときも、同じアカウントでログインするだけで、いつでも続きから勉強を再開できます！
        </p>
      </header>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs sm:text-sm font-bold animate-fade-in ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : message.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-indigo-50 border-indigo-200 text-indigo-800'
        }`}>
          <Icon name={message.type === 'success' ? 'check' : message.type === 'error' ? 'alert-circle' : 'info'} className="w-5 h-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {loggedInUser ? (
          <div className="space-y-6 animate-fade-in">
            {/* Account Profile Header */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl">
              <div className="flex items-center gap-3">
                <UserAvatar username={loggedInUser} avatarIcon={userProgress.avatarIcon} className="w-12 h-12 text-sm" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ログイン中のアカウント</p>
                  <p className="text-sm sm:text-base font-black text-slate-800">{loggedInUser}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 border border-slate-200 hover:border-rose-300 rounded-lg text-xs font-black text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                ログアウト
              </button>
            </div>

            {/* Avatar Selector Area */}
            <div className="space-y-3 bg-slate-50/50 border border-slate-100 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <Icon name="smile" className="w-4 h-4 text-indigo-500" />
                  <span>アカウントのアイコンを変更する</span>
                </h3>
                {userProgress.avatarIcon && (
                  <button
                    onClick={() => {
                      setUserProgress({ ...userProgress, avatarIcon: null });
                      showMessage('アイコンをデフォルト（頭文字）に戻しました！', 'success');
                    }}
                    className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    初期状態（頭文字）に戻す
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">お好きなアイコンを選んで、あなただけのプロフィールにカスタマイズできます！</p>
              
              <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 pt-2">
                {['📚', '✍️', '🎯', '🚀', '🐱', '🐻', '🐨', '🦊', '🦁', '🐯', '🐼', '🐸', '🐙', '🦄', '🎨', '⚽', '🎮', '💡', '🏆', '🌈', '🍀', '🔥', '🍕', '🍰', '🌸', '⭐'].map((emoji) => {
                  const isSelected = userProgress.avatarIcon === emoji;
                  return (
                    <button
                      key={emoji}
                      onClick={() => {
                        setUserProgress({ ...userProgress, avatarIcon: emoji });
                        showMessage(`アイコンを「${emoji}」に変更しました！`, 'success');
                      }}
                      className={`text-2xl p-2 rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm active:scale-90 cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-50 border-2 border-indigo-500 scale-110 shadow-sm' 
                          : 'bg-white/40 border border-transparent hover:border-slate-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reassuring Auto-Save Info Banner */}
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5">
              <Icon name="check" className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs text-emerald-800 font-bold leading-relaxed">
                <p className="font-black text-emerald-900">✨ リアルタイム自動保存が有効です</p>
                <p className="opacity-90 font-medium mt-1">
                  カレンダーの予定を変更したり、勉強の記録をつけたり、クイズを解いたりすると、すべての変更が自動的にインターネット上にリアルタイム保存されます。
                  手動で「保存」や「読み込み」ボタンを押す必要はもうありません。別のスマホやパソコンからでも、ログインするだけでいつでも自動的に最新の状態が復元されます。
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setUserId('');
                  setPassword('');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-lg transition-all ${
                  !isRegister ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ログイン
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setUserId('');
                  setPassword('');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-lg transition-all ${
                  isRegister ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                新規アカウント登録（無料）
              </button>
            </div>

            {/* Real-time username exists display */}
            {typedUserAvatar && (
              <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl animate-fade-in">
                <UserAvatar 
                  username={userId} 
                  avatarIcon={typedUserAvatar === 'DEFAULT_INITIALS' ? null : typedUserAvatar} 
                  className="w-10 h-10 text-xs" 
                />
                <div className="text-left">
                  <p className="text-xs font-black text-indigo-950">登録済みの「{userId}」さんを見つけました！</p>
                  <p className="text-[10px] text-indigo-600 font-bold">パスワードを入力してログインしてください。</p>
                </div>
              </div>
            )}

            <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                  ユーザー名（お好きな半角英数字）
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Icon name="user" className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="例: sato123"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-bold text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                  パスワード（8文字以上を推奨）
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Icon name="lock" className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-bold text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-950 hover:bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 mt-2"
              >
                {loading ? (
                  <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Icon name={isRegister ? 'user-plus' : 'key'} className="w-4 h-4" />
                    <span>{isRegister ? '新しくアカウントを作る' : 'ログインする'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Accountless Info */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 sm:p-6 space-y-3">
        <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
          <Icon name="shield" className="w-4 h-4 text-indigo-500" />
          <span>アカウントを作らずに使う場合（お試しモード）</span>
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          アカウントを作ってログインしていない状態でも、現在お使いのブラウザ（今使用しているスマホやパソコン）の中にデータが自動的に保存されます。
          ただし、ブラウザの履歴やキャッシュを消去したり、プライベートブラウズ（シークレットモード）を使用したり、別のスマホ・パソコンに変えたりするとデータが完全に消えてしまいます。
          大切な勉強データをずっと安全に残すために、簡単な無料アカウントの作成を強くおすすめします！
        </p>
      </div>
    </div>
  );
};

export default SyncView;
