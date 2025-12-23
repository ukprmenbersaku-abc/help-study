import React from 'react';
import { UserProgress } from '../types';
import Icon from './Icon';

interface ProgressViewProps {
  userProgress: UserProgress;
  xpForNextLevel: number;
}

const ProgressView: React.FC<ProgressViewProps> = ({ userProgress, xpForNextLevel }) => {
  const xpPercentage = xpForNextLevel > 0 ? (userProgress.xp / xpForNextLevel) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">学習の進捗</h2>
      
      {/* Level and XP */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl font-bold text-indigo-600">Level {userProgress.level}</span>
          <span className="text-sm font-semibold text-slate-500">{Math.round(userProgress.xp)} / {xpForNextLevel} XP</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-indigo-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-xl font-bold text-slate-700 mb-4">獲得したバッジ</h3>
        {userProgress.badges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProgress.badges.map(badge => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg flex items-center gap-4 transition-all duration-300 ${
                  badge.achieved
                    ? 'bg-amber-100 border border-amber-300 shadow-sm'
                    : 'bg-slate-100 border border-slate-200 opacity-60'
                }`}
              >
                <div className={`p-2 rounded-full ${badge.achieved ? 'bg-amber-400' : 'bg-slate-300'}`}>
                    <Icon name={badge.icon} className={`w-6 h-6 ${badge.achieved ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div>
                  <p className={`font-bold ${badge.achieved ? 'text-amber-800' : 'text-slate-700'}`}>
                    {badge.name}
                  </p>
                  <p className="text-sm text-slate-500">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">まだバッジを獲得していません。</p>
        )}
      </div>
    </div>
  );
};

export default ProgressView;
