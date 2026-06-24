import React from 'react';
import Icon from './Icon';
import { View } from '../App';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: View;
  onNavigate: (view: View) => void;
}

const NavItem: React.FC<{
    iconName: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ iconName, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-colors duration-200 cursor-pointer ${
            isActive
                ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-[inset_0_0_0_1px_rgba(99,102,241,0.1)]'
                : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
        <Icon name={iconName} className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-550'}`} />
        <span className="text-sm font-semibold">{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeView, onNavigate }) => {
    return (
        <>
            {/* Backdrop Overlay */}
            {isOpen && (
                <div 
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
                />
            )}
            
            {/* Drawer Container */}
            <aside className={`fixed top-0 left-0 z-50 w-72 max-w-[85vw] h-full bg-white border-r border-slate-200/80 p-5 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100">
                    <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <Icon name="calendar" className="w-5 h-5 text-indigo-600" />
                        <span>メニュー</span>
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                        <Icon name="x" className="w-5 h-5" />
                    </button>
                </div>
                <nav className="flex-grow space-y-1.5 overflow-y-auto">
                    <NavItem 
                        iconName="sparkles"
                        label="ホーム"
                        isActive={activeView === 'home'}
                        onClick={() => { onNavigate('home'); onClose(); }}
                    />
                    <NavItem 
                        iconName="calendar"
                        label="カレンダー"
                        isActive={activeView === 'calendar'}
                        onClick={() => { onNavigate('calendar'); onClose(); }}
                    />
                    <NavItem 
                        iconName="chart-bar"
                        label="学習の進捗"
                        isActive={activeView === 'progress'}
                        onClick={() => { onNavigate('progress'); onClose(); }}
                    />
                    <NavItem 
                        iconName="award"
                        label="復習・テスト"
                        isActive={activeView === 'review'}
                        onClick={() => { onNavigate('review'); onClose(); }}
                    />
                    <NavItem 
                        iconName="search"
                        label="学習検索"
                        isActive={activeView === 'search'}
                        onClick={() => { onNavigate('search'); onClose(); }}
                    />
                    <NavItem 
                        iconName="book-open"
                        label="学習記事集"
                        isActive={activeView === 'articles'}
                        onClick={() => { onNavigate('articles'); onClose(); }}
                    />
                    <NavItem 
                        iconName="book"
                        label="教科管理"
                        isActive={activeView === 'subjects'}
                        onClick={() => { onNavigate('subjects'); onClose(); }}
                    />
                    <NavItem 
                        iconName="cloud"
                        label="D1クラウド同期"
                        isActive={activeView === 'sync'}
                        onClick={() => { onNavigate('sync'); onClose(); }}
                    />
                    <div className="border-t border-slate-100/80 my-3 pt-3">
                        <NavItem 
                            iconName="info"
                            label="このツールについて"
                            isActive={activeView === 'about'}
                            onClick={() => { onNavigate('about'); onClose(); }}
                        />
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
