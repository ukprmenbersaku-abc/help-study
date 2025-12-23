
import React from 'react';
import Icon from './Icon';
import { View } from '../App';

interface HeaderProps {
    onToggleSidebar: () => void;
    onOpenSettings: () => void;
    onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenSettings, onNavigate }) => {
    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-30 w-full flex-shrink-0">
            <style>{`
                .btn-settings:hover .icon-settings {
                    transform: rotate(45deg);
                }
                .icon-settings {
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
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
                           <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">学習トラッカー</h1>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
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
