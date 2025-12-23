
import React from 'react';
import Icon from './Icon';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  notificationPermission: string;
  onRequestNotificationPermission: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isOpen,
  onClose,
  notificationPermission,
  onRequestNotificationPermission,
  apiKey,
  setApiKey
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 z-50 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-5 animate-settings-enter origin-top-right flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">設定</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors">
          <Icon name="x" className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">通知設定</label>
          {notificationPermission === 'granted' ? (
            <p className="text-sm text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-100 flex items-center gap-2">
              <Icon name="check" className="w-4 h-4" />
              通知は有効です
            </p>
          ) : (
            <button
              onClick={onRequestNotificationPermission}
              disabled={notificationPermission === 'denied'}
              className="w-full px-4 py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {notificationPermission === 'denied' ? '通知がブロックされています' : '通知を許可する'}
            </button>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
           <label className="block text-sm font-medium text-slate-600 mb-2">Gemini APIキー</label>
           <p className="text-xs text-slate-400 mb-2">AI機能を使用するにはAPIキーが必要です。</p>
           <input 
             type="password"
             value={apiKey}
             onChange={(e) => setApiKey(e.target.value)}
             placeholder="APIキーを入力..."
             className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
           />
           <div className="mt-2 text-xs text-right">
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                キーを取得する &rarr;
              </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
