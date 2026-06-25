import React from 'react';

interface UserAvatarProps {
  username: string;
  avatarIcon?: string | null;
  className?: string;
}

export const getAvatarBgColor = (username: string) => {
  const colors = [
    'from-indigo-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-cyan-500 to-sky-500',
    'from-violet-500 to-fuchsia-500',
    'from-blue-500 to-indigo-600',
    'from-red-500 to-rose-600'
  ];
  let hash = 0;
  const str = username || '';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ username, avatarIcon, className = "w-10 h-10 text-sm" }) => {
  const firstLetter = username ? username.trim().charAt(0).toUpperCase() : '?';
  const bgGradient = getAvatarBgColor(username);

  // If there is an avatarIcon (an emoji)
  if (avatarIcon && avatarIcon.trim().length > 0) {
    return (
      <div className={`flex items-center justify-center bg-white border border-slate-100 rounded-full shadow-sm shrink-0 select-none ${className}`}>
        <span className="text-lg leading-none transform scale-110">{avatarIcon}</span>
      </div>
    );
  }

  // Fallback to name initials with deterministic background gradient
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br ${bgGradient} text-white font-extrabold rounded-full shadow-sm shrink-0 select-none ${className}`}>
      {firstLetter}
    </div>
  );
};
