import React, { useState } from 'react';
import { Subject, Task, ReviewResult, UserProgress } from '../types';
import Icon from './Icon';

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
  subjects,
  tasks,
  reviewResults,
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
        showMessage('登録が完了しました！ログインしてください。', 'success');
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
        showMessage('ログインしました！データを同期しています...', 'success');
        
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
    showMessage('ログアウトしました。ローカル保存モードに戻りました。', 'info');
  };

  const handlePush = async () => {
    if (!loggedInUser) return;
    setLoading(true);
    try {
      const res = await fetch('/api/sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loggedInUser,
          subjects,
          tasks,
          reviewResults,
          userProgress,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('学習データをクラウドに保存しました！', 'success');
      } else {
        showMessage(data.error || '保存に失敗しました。', 'error');
      }
    } catch (err: any) {
      showMessage('通信エラー: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
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

        showMessage('クラウドから最新の学習データを読み込みました！', 'success');
      } else {
        showMessage('クラウド上に保存されたデータがありません。現在の設定を「クラウドへ保存」してください。', 'info');
      }
    } catch (err: any) {
      showMessage('読み込みエラー: ' + err.message, 'error');
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
              アカウント同期
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold tracking-wider uppercase">
              Cloud Sync & Backup
            </p>
          </div>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto sm:mx-0">
          ログインすると、カレンダーの予定、教科管理、クイズの学習記録、現在のレベル・XP・バッジなどをクラウドに安全にバックアップし、他のデバイスとシームレスに同期できます。
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
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">
                  {loggedInUser.charAt(0).toUpperCase()}
                </div>
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

            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <Icon name="settings" className="w-4 h-4 text-slate-500" />
                <span>同期メニュー</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handlePush}
                  disabled={loading}
                  className="flex flex-col items-center justify-center p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl sm:rounded-2xl transition-all shadow-md active:scale-95 text-center group cursor-pointer"
                >
                  <Icon name="upload" className="w-6 h-6 mb-2 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-xs sm:text-sm font-black">クラウドへ保存</span>
                  <span className="text-[9px] opacity-80 font-semibold mt-1">現在の内容で上書き保存</span>
                </button>

                <button
                  onClick={() => handlePull()}
                  disabled={loading}
                  className="flex flex-col items-center justify-center p-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl sm:rounded-2xl transition-all shadow-md active:scale-95 text-center group cursor-pointer"
                >
                  <Icon name="download" className="w-6 h-6 mb-2 group-hover:translate-y-0.5 transition-transform" />
                  <span className="text-xs sm:text-sm font-black">クラウドから復元</span>
                  <span className="text-[9px] opacity-80 font-semibold mt-1">保存されたデータを読み込み</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5">
              <Icon name="check" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs text-emerald-800 font-bold leading-relaxed">
                <p>✨ 自動保存機能がオンになっています</p>
                <p className="opacity-80 font-medium">カレンダーの予定変更、教科の編集、クイズ結果は自動的にクラウドデータベースへ反映されます。</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-lg transition-all ${
                  !isRegister ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ログイン
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-2 text-xs sm:text-sm font-black rounded-lg transition-all ${
                  isRegister ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                新規会員登録
              </button>
            </div>

            <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                  ユーザーID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Icon name="user" className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="任意のユーザー名"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-bold text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                  パスワード
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
                    <span>{isRegister ? '新規会員登録を行う' : 'ログインする'}</span>
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
          <span>アカウント未登録時の動作について</span>
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          アカウントを登録・ログインしていない状態でも、当アプリはブラウザのローカル保存環境（ローカルストレージやクッキー）を利用して自動的にデータを保護します。ログインすることで、いつでもそのデータをクラウドへ保存し、機種変更時などに復元させることができます。
        </p>
      </div>
    </div>
  );
};

export default SyncView;
