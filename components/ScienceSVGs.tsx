import React, { memo } from 'react';

// ==========================================
// 1. Lightweight, GPU-Optimized Bohr Model Atom Orbit SVG
// ==========================================
interface AtomOrbitProps {
  symbol: string;
  className?: string;
  size?: number;
  animated?: boolean;
}

export const AtomOrbitSVG: React.FC<AtomOrbitProps> = memo(({
  symbol,
  className = '',
  size = 120,
  animated = true,
}) => {
  // Electron shell configuration for Middle School 2nd Year Science
  const elementConfigs: { [key: string]: { name: string; z: number; color: string; shells: number[] } } = {
    H: { name: '水素', z: 1, color: '#0284c7', shells: [1] },
    He: { name: 'ヘリウム', z: 2, color: '#0d9488', shells: [2] },
    C: { name: '炭素', z: 6, color: '#52525b', shells: [2, 4] },
    N: { name: '窒素', z: 7, color: '#2563eb', shells: [2, 5] },
    O: { name: '酸素', z: 8, color: '#dc2626', shells: [2, 6] },
    Na: { name: 'ナトリウム', z: 11, color: '#d97706', shells: [2, 8, 1] },
    Mg: { name: 'マグネシウム', z: 12, color: '#ca8a04', shells: [2, 8, 2] },
    Al: { name: 'アルミニウム', z: 13, color: '#64748b', shells: [2, 8, 3] },
    S: { name: '硫黄', z: 16, color: '#eab308', shells: [2, 8, 6] },
    Cl: { name: '塩素', z: 17, color: '#65a30d', shells: [2, 8, 7] },
    K: { name: 'カリウム', z: 19, color: '#7c3aed', shells: [2, 8, 8, 1] },
    Ca: { name: 'カルシウム', z: 20, color: '#9333ea', shells: [2, 8, 8, 2] },
    Fe: { name: '鉄', z: 26, color: '#475569', shells: [2, 8, 14, 2] },
    Cu: { name: '銅', z: 29, color: '#c2410c', shells: [2, 8, 18, 1] },
    Zn: { name: '亜鉛', z: 30, color: '#0891b2', shells: [2, 8, 18, 2] },
    Ag: { name: '銀', z: 47, color: '#94a3b8', shells: [2, 8, 18, 18, 1] },
  };

  const conf = elementConfigs[symbol] || { name: symbol, z: 1, color: '#6366f1', shells: [1] };

  return (
    <svg
      viewBox="-60 -60 120 120"
      width={size}
      height={size}
      className={`select-none overflow-visible transform-gpu ${className}`}
    >
      <defs>
        <radialGradient id={`nucleusGrad-${symbol}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor={conf.color} />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
      </defs>

      {/* Tilted Elliptical Orbit Paths (Clean vector, no heavy Gaussian blur for maximum speed) */}
      {/* Shell 1 */}
      <g
        className={animated ? 'animate-orbit-spin' : ''}
        style={{ transformOrigin: '0 0' }}
      >
        <ellipse cx="0" cy="0" rx="34" ry="14" fill="none" stroke={conf.color} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" transform="rotate(25)" />
        <circle cx="30" cy="7" r="3" fill="#38bdf8" />
      </g>

      {/* Shell 2 */}
      <g
        className={animated ? 'animate-orbit-spin-reverse' : ''}
        style={{ transformOrigin: '0 0' }}
      >
        <ellipse cx="0" cy="0" rx="46" ry="18" fill="none" stroke="#818cf8" strokeWidth="1.2" opacity="0.6" transform="rotate(-35)" />
        <circle cx="-42" cy="-8" r="3.2" fill="#a5b4fc" />
        {conf.z > 2 && <circle cx="42" cy="8" r="3.2" fill="#a5b4fc" />}
      </g>

      {/* Shell 3 (if applicable) */}
      {conf.z > 8 && (
        <g
          className={animated ? 'animate-orbit-spin' : ''}
          style={{ transformOrigin: '0 0', animationDuration: '9s' }}
        >
          <ellipse cx="0" cy="0" rx="54" ry="20" fill="none" stroke="#c084fc" strokeWidth="1" opacity="0.5" transform="rotate(80)" />
          <circle cx="0" cy="20" r="3" fill="#e879f9" />
          {conf.z > 10 && <circle cx="0" cy="-20" r="3" fill="#e879f9" />}
        </g>
      )}

      {/* Central Atomic Nucleus (Protons & Neutrons) */}
      <g>
        <circle cx="0" cy="0" r="14" fill={`url(#nucleusGrad-${symbol})`} />
        <circle cx="-2.5" cy="-2.5" r="12" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
        <text
          x="0"
          y="4.5"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
        >
          {symbol}
        </text>
      </g>
    </svg>
  );
});

// ==========================================
// 2. High-Performance Middle School 2nd Year Compound Molecule Structure SVG
// ==========================================
interface MoleculeProps {
  formula: string;
  size?: number;
  className?: string;
}

export const CompoundMoleculeSVG: React.FC<MoleculeProps> = memo(({ formula, size = 80, className = '' }) => {
  switch (formula) {
    case 'H2O':
      return (
        <svg viewBox="0 0 100 80" width={size} height={size * 0.8} className={`overflow-visible ${className}`}>
          <line x1="50" y1="30" x2="25" y2="60" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="30" x2="75" y2="60" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="30" r="17" fill="#ef4444" />
          <text x="50" y="34.5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">O</text>
          <circle cx="25" cy="60" r="12" fill="#0284c7" />
          <text x="25" y="64" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">H</text>
          <circle cx="75" cy="60" r="12" fill="#0284c7" />
          <text x="75" y="64" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">H</text>
        </svg>
      );

    case 'CO2':
      return (
        <svg viewBox="0 0 120 60" width={size * 1.3} height={size * 0.65} className={`overflow-visible ${className}`}>
          <line x1="25" y1="27" x2="60" y2="27" stroke="#64748b" strokeWidth="3" />
          <line x1="25" y1="33" x2="60" y2="33" stroke="#64748b" strokeWidth="3" />
          <line x1="60" y1="27" x2="95" y2="27" stroke="#64748b" strokeWidth="3" />
          <line x1="60" y1="33" x2="95" y2="33" stroke="#64748b" strokeWidth="3" />
          <circle cx="25" cy="30" r="15" fill="#ef4444" />
          <text x="25" y="34" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">O</text>
          <circle cx="60" cy="30" r="16" fill="#334155" />
          <text x="60" y="34.5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">C</text>
          <circle cx="95" cy="30" r="15" fill="#ef4444" />
          <text x="95" y="34" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">O</text>
        </svg>
      );

    case 'H2':
      return (
        <svg viewBox="0 0 80 50" width={size} height={size * 0.6} className={`overflow-visible ${className}`}>
          <line x1="25" y1="25" x2="55" y2="25" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="25" cy="25" r="14" fill="#0284c7" />
          <text x="25" y="29" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">H</text>
          <circle cx="55" cy="25" r="14" fill="#0284c7" />
          <text x="55" y="29" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">H</text>
        </svg>
      );

    case 'O2':
      return (
        <svg viewBox="0 0 90 50" width={size} height={size * 0.6} className={`overflow-visible ${className}`}>
          <line x1="28" y1="22" x2="62" y2="22" stroke="#ef4444" strokeWidth="3" />
          <line x1="28" y1="28" x2="62" y2="28" stroke="#ef4444" strokeWidth="3" />
          <circle cx="28" cy="25" r="15" fill="#dc2626" />
          <text x="28" y="29" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">O</text>
          <circle cx="62" cy="25" r="15" fill="#dc2626" />
          <text x="62" y="29" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">O</text>
        </svg>
      );

    case 'N2':
      return (
        <svg viewBox="0 0 90 50" width={size} height={size * 0.6} className={`overflow-visible ${className}`}>
          <line x1="28" y1="20" x2="62" y2="20" stroke="#3b82f6" strokeWidth="2.5" />
          <line x1="28" y1="25" x2="62" y2="25" stroke="#3b82f6" strokeWidth="2.5" />
          <line x1="28" y1="30" x2="62" y2="30" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="28" cy="25" r="15" fill="#1d4ed8" />
          <text x="28" y="29" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">N</text>
          <circle cx="62" cy="25" r="15" fill="#1d4ed8" />
          <text x="62" y="29" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">N</text>
        </svg>
      );

    case 'Cl2':
      return (
        <svg viewBox="0 0 90 50" width={size} height={size * 0.6} className={`overflow-visible ${className}`}>
          <line x1="28" y1="25" x2="62" y2="25" stroke="#84cc16" strokeWidth="3.5" />
          <circle cx="28" cy="25" r="16" fill="#65a30d" />
          <text x="28" y="29" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">Cl</text>
          <circle cx="62" cy="25" r="16" fill="#65a30d" />
          <text x="62" y="29" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">Cl</text>
        </svg>
      );

    case 'NH3':
      return (
        <svg viewBox="0 0 100 80" width={size} height={size * 0.8} className={`overflow-visible ${className}`}>
          <line x1="50" y1="35" x2="25" y2="62" stroke="#94a3b8" strokeWidth="3" />
          <line x1="50" y1="35" x2="50" y2="68" stroke="#94a3b8" strokeWidth="3" />
          <line x1="50" y1="35" x2="75" y2="62" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="50" cy="30" r="17" fill="#1d4ed8" />
          <text x="50" y="34.5" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">N</text>
          <circle cx="25" cy="62" r="10" fill="#0284c7" />
          <text x="25" y="65.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">H</text>
          <circle cx="50" cy="68" r="10" fill="#0284c7" />
          <text x="50" y="71.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">H</text>
          <circle cx="75" cy="62" r="10" fill="#0284c7" />
          <text x="75" y="65.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">H</text>
        </svg>
      );

    case 'CuO':
      return (
        <svg viewBox="0 0 100 55" width={size} height={size * 0.55} className={`overflow-visible ${className}`}>
          <line x1="32" y1="28" x2="68" y2="28" stroke="#475569" strokeWidth="4" />
          <circle cx="32" cy="28" r="17" fill="#c2410c" />
          <text x="32" y="32" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">Cu</text>
          <circle cx="68" cy="28" r="14" fill="#1e293b" />
          <text x="68" y="32" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="900">O</text>
        </svg>
      );

    case 'MgO':
      return (
        <svg viewBox="0 0 100 55" width={size} height={size * 0.55} className={`overflow-visible ${className}`}>
          <line x1="32" y1="28" x2="68" y2="28" stroke="#ca8a04" strokeWidth="4" />
          <circle cx="32" cy="28" r="17" fill="#eab308" />
          <text x="32" y="32" textAnchor="middle" fill="#000" fontSize="10" fontWeight="900">Mg</text>
          <circle cx="68" cy="28" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <text x="68" y="32" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="900">O</text>
        </svg>
      );

    case 'FeS':
      return (
        <svg viewBox="0 0 100 55" width={size} height={size * 0.55} className={`overflow-visible ${className}`}>
          <line x1="32" y1="28" x2="68" y2="28" stroke="#334155" strokeWidth="4" />
          <circle cx="32" cy="28" r="17" fill="#334155" />
          <text x="32" y="32" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">Fe</text>
          <circle cx="68" cy="28" r="15" fill="#ca8a04" />
          <text x="68" y="32" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">S</text>
        </svg>
      );

    case 'CuS':
      return (
        <svg viewBox="0 0 100 55" width={size} height={size * 0.55} className={`overflow-visible ${className}`}>
          <line x1="32" y1="28" x2="68" y2="28" stroke="#9a3412" strokeWidth="4" />
          <circle cx="32" cy="28" r="17" fill="#c2410c" />
          <text x="32" y="32" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">Cu</text>
          <circle cx="68" cy="28" r="15" fill="#ca8a04" />
          <text x="68" y="32" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">S</text>
        </svg>
      );

    case 'Ag2O':
      return (
        <svg viewBox="0 0 110 60" width={size * 1.2} height={size * 0.65} className={`overflow-visible ${className}`}>
          <line x1="25" y1="30" x2="55" y2="30" stroke="#94a3b8" strokeWidth="3" />
          <line x1="55" y1="30" x2="85" y2="30" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="25" cy="30" r="14" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
          <text x="25" y="34" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">Ag</text>
          <circle cx="55" cy="30" r="15" fill="#dc2626" />
          <text x="55" y="34" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">O</text>
          <circle cx="85" cy="30" r="14" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
          <text x="85" y="34" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">Ag</text>
        </svg>
      );

    case 'CuCl2':
      return (
        <svg viewBox="0 0 110 60" width={size * 1.2} height={size * 0.65} className={`overflow-visible ${className}`}>
          <line x1="25" y1="30" x2="55" y2="30" stroke="#0d9488" strokeWidth="3" />
          <line x1="55" y1="30" x2="85" y2="30" stroke="#0d9488" strokeWidth="3" />
          <circle cx="25" cy="30" r="14" fill="#65a30d" />
          <text x="25" y="34" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">Cl</text>
          <circle cx="55" cy="30" r="16" fill="#0f766e" />
          <text x="55" y="34" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">Cu</text>
          <circle cx="85" cy="30" r="14" fill="#65a30d" />
          <text x="85" y="34" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">Cl</text>
        </svg>
      );

    case 'NaHCO3':
      return (
        <svg viewBox="0 0 120 70" width={size * 1.25} height={size * 0.72} className={`overflow-visible ${className}`}>
          <circle cx="22" cy="35" r="13" fill="#d97706" />
          <text x="22" y="39" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">Na</text>
          <circle cx="48" cy="35" r="14" fill="#52525b" />
          <text x="48" y="39" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">C</text>
          <circle cx="75" cy="22" r="12" fill="#ef4444" />
          <text x="75" y="26" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">O</text>
          <circle cx="75" cy="48" r="12" fill="#ef4444" />
          <text x="75" y="52" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">O</text>
          <circle cx="102" cy="35" r="10" fill="#0284c7" />
          <text x="102" y="38.5" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="900">H</text>
        </svg>
      );

    case 'Na2CO3':
      return (
        <svg viewBox="0 0 120 70" width={size * 1.25} height={size * 0.72} className={`overflow-visible ${className}`}>
          <circle cx="20" cy="25" r="12" fill="#d97706" />
          <text x="20" y="29" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="900">Na</text>
          <circle cx="20" cy="50" r="12" fill="#d97706" />
          <text x="20" y="54" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="900">Na</text>
          <circle cx="55" cy="35" r="14" fill="#52525b" />
          <text x="55" y="39" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900">C</text>
          <circle cx="85" cy="22" r="12" fill="#ef4444" />
          <text x="85" y="26" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">O</text>
          <circle cx="85" cy="48" r="12" fill="#ef4444" />
          <text x="85" y="52" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">O</text>
        </svg>
      );

    case 'Fe2O3':
      return (
        <svg viewBox="0 0 120 60" width={size * 1.25} height={size * 0.65} className={`overflow-visible ${className}`}>
          <circle cx="22" cy="30" r="14" fill="#334155" />
          <text x="22" y="34" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">Fe</text>
          <circle cx="48" cy="30" r="13" fill="#b91c1c" />
          <text x="48" y="34" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">O</text>
          <circle cx="74" cy="30" r="14" fill="#334155" />
          <text x="74" y="34" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">Fe</text>
          <circle cx="98" cy="30" r="13" fill="#b91c1c" />
          <text x="98" y="34" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">O</text>
        </svg>
      );

    default:
      return (
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-black text-indigo-700 text-xs">
          {formula}
        </div>
      );
  }
});

// ==========================================
// 3. High-Performance Animated Enemy Monster SVGs (Junior High 2nd Year Curriculum)
// ==========================================
export type StageEnemyType = 'pyro' | 'electro' | 'oxidation' | 'reduction' | 'sulfide' | 'kaiser';

interface MonsterProps {
  type: StageEnemyType;
  isHit?: boolean;
  phase?: number;
}

export const AdvancedMonsterSVG: React.FC<MonsterProps> = memo(({ type, isHit = false, phase = 1 }) => {
  const hitClasses = isHit ? 'animate-shake brightness-150 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' : '';

  switch (type) {
    // Stage 1: 灼熱龍パイロ・ドレイク (Thermal Decomposition / Fire)
    case 'pyro':
      return (
        <div className={`relative w-28 h-28 flex items-center justify-center transform-gpu ${hitClasses}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible animate-flame">
            <defs>
              <linearGradient id="pyroGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#991b1b" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Ember sparks */}
            <circle cx="30" cy="35" r="2.5" fill="#facc15" className="animate-bubble-rise" />
            <circle cx="85" cy="40" r="3" fill="#f97316" className="animate-bubble-rise" style={{ animationDelay: '0.6s' }} />

            {/* Dragon Horns & Crest */}
            <polygon points="35,30 20,10 40,25" fill="#7f1d1d" />
            <polygon points="85,30 100,10 80,25" fill="#7f1d1d" />

            {/* Flame Body */}
            <path
              d="M60 8 C75 25 88 45 88 72 C88 95 74 108 60 108 C46 108 32 95 32 72 C32 45 45 25 60 8 Z"
              fill="url(#pyroGrad)"
            />
            {/* Core Hot Tongue */}
            <path
              d="M60 38 C68 55 72 70 72 82 C72 94 66 100 60 100 C54 100 48 94 48 82 C48 70 52 55 60 38 Z"
              fill="#fef08a"
            />

            {/* Dragon Eyes */}
            <polygon points="46,65 54,68 48,72" fill="#0f172a" />
            <polygon points="74,65 66,68 72,72" fill="#0f172a" />
            <circle cx="50" cy="69" r="1.5" fill="#ffffff" />
            <circle cx="70" cy="69" r="1.5" fill="#ffffff" />

            {/* Fangs */}
            <polygon points="52,82 56,88 60,82" fill="#ffffff" />
            <polygon points="60,82 64,88 68,82" fill="#ffffff" />
          </svg>
        </div>
      );

    // Stage 2: 電解雷獣ガルバニクス (Electrolysis Thunder Beast)
    case 'electro':
      return (
        <div className={`relative w-28 h-28 flex items-center justify-center transform-gpu ${hitClasses}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="electroGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>

            {/* Dual Electrode Horns (Anode (+) / Cathode (-)) */}
            <g>
              {/* Cathode (-) H2 side */}
              <rect x="22" y="16" width="10" height="30" rx="3" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
              <text x="27" y="28" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="900">−</text>
              <text x="27" y="40" textAnchor="middle" fill="#38bdf8" fontSize="6" fontWeight="bold">H₂</text>

              {/* Anode (+) O2 side */}
              <rect x="88" y="16" width="10" height="30" rx="3" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
              <text x="93" y="28" textAnchor="middle" fill="#f87171" fontSize="8" fontWeight="900">＋</text>
              <text x="93" y="40" textAnchor="middle" fill="#f87171" fontSize="6" fontWeight="bold">O₂</text>
            </g>

            {/* Electric field sparks (CSS rotate) */}
            <g className="animate-orbit-spin" style={{ transformOrigin: '60px 60px', animationDuration: '6s' }}>
              <polygon points="60,20 64,28 60,36 56,28" fill="#38bdf8" />
              <polygon points="100,60 92,64 84,60 92,56" fill="#38bdf8" />
              <polygon points="60,100 56,92 60,84 64,92" fill="#38bdf8" />
              <polygon points="20,60 28,56 36,60 28,64" fill="#38bdf8" />
            </g>

            {/* Beast Core Head */}
            <polygon points="60,30 92,55 82,98 38,98 28,55" fill="url(#electroGrad)" stroke="#0284c7" strokeWidth="2.5" />

            {/* Lightning bolt chest plate */}
            <polygon points="62,50 54,66 64,66 58,85 72,62 62,62" fill="#fef08a" />

            {/* Eyes */}
            <circle cx="48" cy="56" r="4" fill="#ffffff" />
            <circle cx="48" cy="56" r="2" fill="#0369a1" />
            <circle cx="72" cy="56" r="4" fill="#ffffff" />
            <circle cx="72" cy="56" r="2" fill="#0369a1" />
          </svg>
        </div>
      );

    // Stage 3: 激化合の黒鋼オキシ・ゴーレム (Oxidation & Combustive Flash)
    case 'oxidation':
      return (
        <div className={`relative w-28 h-28 flex items-center justify-center transform-gpu ${hitClasses}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="ironPlate" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Massive Golem Shoulders */}
            <rect x="14" y="42" width="22" height="34" rx="4" fill="#475569" stroke="#0f172a" strokeWidth="2" />
            <rect x="84" y="42" width="22" height="34" rx="4" fill="#475569" stroke="#0f172a" strokeWidth="2" />

            {/* Heavy Iron Armor Plate */}
            <polygon points="60,18 88,40 80,95 40,95 32,40" fill="url(#ironPlate)" stroke="#64748b" strokeWidth="3" />

            {/* Glowing Core Reactor (Magnesium / Copper heat indicator) */}
            <circle cx="60" cy="68" r="14" fill="#ca8a04" className="animate-pulse" />
            <circle cx="60" cy="68" r="8" fill="#fef08a" />
            <text x="60" y="71" textAnchor="middle" fill="#000" fontSize="8" fontWeight="900">Mg</text>

            {/* Visor slit */}
            <rect x="42" y="38" width="36" height="8" rx="2" fill="#0f172a" />
            <rect x="48" y="40" width="24" height="4" rx="2" fill="#ef4444" />
          </svg>
        </div>
      );

    // Stage 4: 還元の暗黒神官レダクト・ロード (Dark Reduction Lord - CuO / Fe2O3 Coat)
    case 'reduction':
      return (
        <div className={`relative w-28 h-28 flex items-center justify-center transform-gpu ${hitClasses}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible animate-float-slow">
            <defs>
              <linearGradient id="reductionCloak" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#581c87" />
                <stop offset="60%" stopColor="#3b0764" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>

            {/* Orbiting Oxygen Chains (Waiting for Reduction) */}
            <g className="animate-orbit-spin" style={{ transformOrigin: '60px 60px', animationDuration: '8s' }}>
              <circle cx="60" cy="14" r="6" fill="#ef4444" />
              <text x="60" y="17" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">O</text>
              <circle cx="106" cy="60" r="6" fill="#ef4444" />
              <text x="106" y="63" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">O</text>
              <circle cx="60" cy="106" r="6" fill="#ef4444" />
              <text x="60" y="109" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">O</text>
              <circle cx="14" cy="60" r="6" fill="#ef4444" />
              <text x="14" y="63" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">O</text>
            </g>

            {/* Dark Robe */}
            <path
              d="M60 22 C78 22 96 45 92 98 L28 98 C24 45 42 22 60 22 Z"
              fill="url(#reductionCloak)"
              stroke="#7c3aed"
              strokeWidth="2"
            />

            {/* Oxidized Copper Armor Chestplate (CuO Black) */}
            <polygon points="60,42 78,58 72,82 48,82 42,58" fill="#18181b" stroke="#c2410c" strokeWidth="2" />
            <text x="60" y="66" textAnchor="middle" fill="#c2410c" fontSize="8" fontWeight="900">CuO</text>

            {/* Hood Shadow & Glowing Eyes */}
            <circle cx="60" cy="36" r="12" fill="#09090b" />
            <circle cx="55" cy="36" r="2.5" fill="#a855f7" />
            <circle cx="65" cy="36" r="2.5" fill="#a855f7" />
          </svg>
        </div>
      );

    // Stage 5: 暴走の硫化獣パイライト・キマイラ (Exothermic Sulfide Chimera - Fe + S -> FeS)
    case 'sulfide':
      return (
        <div className={`relative w-28 h-28 flex items-center justify-center transform-gpu ${hitClasses}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="sulfurGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ca8a04" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#713f12" />
              </linearGradient>
            </defs>

            {/* Spiky Sulfur Crystals on Back */}
            <polygon points="30,45 20,20 40,35" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />
            <polygon points="50,30 45,5 60,20" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />
            <polygon points="75,30 80,5 65,22" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />
            <polygon points="90,45 100,20 80,35" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />

            {/* Iron-Sulfide Hybrid Body */}
            <path
              d="M60 28 C85 28 98 55 94 96 L26 96 C22 55 35 28 60 28 Z"
              fill="url(#sulfurGrad)"
              stroke="#1e293b"
              strokeWidth="2.5"
            />

            {/* Exothermic Glow Chest (Red Heat FeS) */}
            <circle cx="60" cy="65" r="16" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
            <text x="60" y="68" textAnchor="middle" fill="#f97316" fontSize="9" fontWeight="900">FeS</text>
            <path d="M50 78 L70 78" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />

            {/* Chimera Eyes */}
            <polygon points="46,45 54,48 48,52" fill="#dc2626" />
            <polygon points="74,45 66,48 72,52" fill="#dc2626" />
          </svg>
        </div>
      );

    // Stage 6: 【超難関ボス】定比例の絶対化学神ケミカル・カイザー (Chemical Kaiser of Definite Proportions)
    case 'kaiser':
      return (
        <div className={`relative w-32 h-32 flex items-center justify-center transform-gpu ${hitClasses}`}>
          <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="kaiserAura" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Triple Definite Proportions Geometric Orbit (Phase-reactive) */}
            <g className="animate-orbit-spin" style={{ transformOrigin: '70px 70px', animationDuration: '9s' }}>
              <polygon points="70,8 122,38 122,102 70,132 18,102 18,38" fill="none" stroke="url(#kaiserAura)" strokeWidth="2" strokeDasharray="6 4" />
              {/* Ratio satellites */}
              <circle cx="70" cy="8" r="6" fill="#c2410c" />
              <circle cx="122" cy="102" r="6" fill="#ca8a04" />
              <circle cx="18" cy="102" r="6" fill="#0284c7" />
            </g>

            {/* Royal Grand Crest / Crown */}
            <polygon points="45,35 55,18 70,28 85,18 95,35" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

            {/* Emperor Core Body */}
            <circle cx="70" cy="70" r="34" fill="#090d16" stroke="#6366f1" strokeWidth="3" />

            {/* Phase Badge & Symbol Display */}
            <circle cx="70" cy="70" r="18" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
            <text x="70" y="68" textAnchor="middle" fill="#facc15" fontSize="8" fontWeight="900">PHASE {phase}</text>
            <text x="70" y="78" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold">
              {phase === 1 ? 'Cu:O 4:1' : phase === 2 ? 'Mg:O 3:2' : 'ALL RATIOS'}
            </text>

            {/* Visor */}
            <path d="M50 50 Q70 44 90 50 L88 56 Q70 60 52 56 Z" fill="#22c55e" />
          </svg>
        </div>
      );
  }
});
