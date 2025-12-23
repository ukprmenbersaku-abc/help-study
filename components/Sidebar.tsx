
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
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-colors duration-200 ${
            isActive
                ? 'bg-indigo-100 text-indigo-700 font-bold shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
        }`}
    >
        <Icon name={iconName} className="w-6 h-6" />
        <span className="text-base">{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeView, onNavigate }) => {
    return (
        <aside className={`fixed top-0 left-0 z-50 w-72 max-w-[80vw] h-full bg-slate-100/90 backdrop-blur-lg border-r border-slate-200 p-4 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-300">
                <h2 className="text-xl font-bold text-slate-800">メニュー</h2>
                <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                    <Icon name="x" className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex-grow space-y-2">
                <NavItem 
                    iconName="sparkles"
                    label="ホーム"
                    isActive={activeView === 'home'}
                    onClick={() => onNavigate('home')}
                />
                <NavItem 
                    iconName="calendar"
                    label="カレンダー"
                    isActive={activeView === 'calendar'}
                    onClick={() => onNavigate('calendar')}
                />
                <NavItem 
                    iconName="chart-bar"
                    label="学習の進捗"
                    isActive={activeView === 'progress'}
                    onClick={() => onNavigate('progress')}
                />
                <NavItem 
                    iconName="book"
                    label="科目管理"
                    isActive={activeView === 'subjects'}
                    onClick={() => onNavigate('subjects')}
                />
            </nav>
        </aside>
    );
};

export default Sidebar;
