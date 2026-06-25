
import React from 'react';
import Icon from './Icon';
import { View } from '../App';
import { UserAvatar } from './UserAvatar';

interface HeaderProps {
    onToggleSidebar: () => void;
    onOpenSettings: () => void;
    onNavigate: (view: View) => void;
    d1UserId: string | null;
    avatarIcon?: string | null;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenSettings, onNavigate, d1UserId, avatarIcon }) => {
    return (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-30 w-full flex-shrink-0">
            <style>{`
                .logo-clickable:active {
                    transform: scale(0.98);
                }
            `}</style>
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <button onClick={onToggleSidebar} className="p-2 rounded-full text-slate-600 hover:bg-slate-200 hover:text-indigo-600 transition-colors">
                            <Icon name="menu" className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={() => onNavigate('home')}
                            className="logo-clickable flex items-center gap-2 hover:opacity-80 transition-all duration-200"
                        >
                           <Icon name="calendar" className="w-7 h-7 text-indigo-600" />
                           <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight block">Study-side</h1>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button 
                            onClick={() => onNavigate('sync')}
                            className="flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer"
                            title={d1UserId ? `ログイン中: ${d1UserId}` : "この端末だけに保存中（未ログイン）"}
                        >
                            {d1UserId ? (
                              <span className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full pl-1.5 pr-3 py-1 text-[11px] font-black shadow-sm">
                                <UserAvatar username={d1UserId} avatarIcon={avatarIcon} className="w-5 h-5 text-[9px]" />
                                <span>ログイン中 ({d1UserId})</span>
                              </span>
                            ) : (
                              <span className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-100 rounded-full px-3.5 py-1 text-xs font-black shadow-sm">
                                ログイン
                              </span>
                            )}
                        </button>
                        <button 
                            onClick={onOpenSettings} 
                            className="btn-settings p-2 rounded-full text-slate-600 hover:bg-slate-200 hover:text-indigo-600 transition-all duration-200 active:scale-90"
                        >
                            <Icon name="settings" className="icon-settings w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
