import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { UserProgress } from '../types';

interface GameViewProps {
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

// 元素（原子）の定義
interface ElementInfo {
  symbol: string;
  name: string;
  atomicNumber: number;
  category: string;
  color: string;
  description: string;
}

const ELEMENTS: { [key: string]: ElementInfo } = {
  H: { symbol: 'H', name: '水素', atomicNumber: 1, category: '非金属元素', color: 'bg-sky-500 text-white', description: '宇宙で最も多く存在する元素。非常に軽く、酸素と反応して爆発的に燃えて水（H₂O）になる。次世代のクリーンエネルギーとして注目されている。' },
  He: { symbol: 'He', name: 'ヘリウム', atomicNumber: 2, category: '希ガス', color: 'bg-teal-500 text-white', description: '非常に軽く、他の物質と全く反応しない安全な気体。風船や声が変わるガス、超伝導用の冷却材として使われる。' },
  C: { symbol: 'C', name: '炭素', atomicNumber: 6, category: '非金属元素', color: 'bg-zinc-700 text-white', description: '有機物の骨格をなす、生命に不可欠な元素。ダイヤモンドや鉛筆の芯（黒鉛）、炭、活性炭などの多様な姿（同素体）を持つ。' },
  O: { symbol: 'O', name: '酸素', atomicNumber: 8, category: '非金属元素', color: 'bg-red-500 text-white', description: '地球の地殻や大気に多く含まれ、生物の呼吸に必要な元素。物質を「燃やす（酸化）」のを助ける働き（助燃性）がある。' },
  Na: { symbol: 'Na', name: 'ナトリウム', atomicNumber: 11, category: 'アルカリ金属', color: 'bg-amber-500 text-white', description: '水と激しく反応して水素を発生する、極めて反応性の高い金属。塩（NaCl）の構成元素としておなじみ。単体はナイフで切れるほど柔らかい。' },
  Cl: { symbol: 'Cl', name: '塩素', atomicNumber: 17, category: 'ハロゲン', color: 'bg-lime-500 text-black font-semibold', description: '黄緑色の刺激臭がある有毒な気体。強い殺菌・漂白作用を持ち、水道水の消毒や漂白剤として広く利用されている。' },
  Fe: { symbol: 'Fe', name: '鉄', atomicNumber: 26, category: '遷移金属', color: 'bg-slate-500 text-white', description: '文明を支える最も身近な金属。酸素と水に触れると徐々に酸化して赤サビ（Fe₂O₃）に変化する。磁石にくっつく性質を持つ。' },
  Cu: { symbol: 'Cu', name: '銅', atomicNumber: 29, category: '遷移金属', color: 'bg-orange-600 text-white', description: '赤金色の美しい輝きを持つ金属。電気や熱を非常によく通すため、電線や調理器具、十円硬貨などに広く使われる。' },
};

// 化合物の定義
interface CompoundInfo {
  formula: string;
  htmlFormula: string; // 表示用のHTML/JSX
  name: string;
  elements: { [element: string]: number };
  description: string;
  effect: string;
}

const COMPOUNDS: { [formula: string]: CompoundInfo } = {
  H2: { formula: 'H2', htmlFormula: 'H₂', name: '水素ガス', elements: { H: 2 }, description: '水素原子が2つくっついた、最も軽い気体分子。爆発的な可燃性を持ち、炎に対して引火・爆発を起こす、または還元剤として機能する。', effect: '【還元・爆発】敵のサビを奪う還元パワー、または炎を爆発させて敵を吹き飛ばす！' },
  O2: { formula: 'O2', htmlFormula: 'O₂', name: '酸素ガス', elements: { O: 2 }, description: '私たちが呼吸している気体。物を激しく燃やす働きがある。化学反応を活性化させる。', effect: '【酸化・助燃】反応を加速させたり、相手を強力に酸化させる！' },
  H2O: { formula: 'H2O', htmlFormula: 'H₂O', name: '水', elements: { H: 2, O: 1 }, description: '生命に不可欠な最もありふれた化合物。比熱が大きく、炎を消す消火剤として働く。電気を流すと、水素と酸素に分解できる。', effect: '【冷却・消火】熱い炎のモンスターを冷却し、消火する！電気分解の材料にもなる。' },
  CO2: { formula: 'CO2', htmlFormula: 'CO₂', name: '二酸化炭素', elements: { C: 1, O: 2 }, description: '炭素が完全燃焼してできる気体。空気より重く、燃えない性質があるため、炎にかぶせることで酸素を遮断し、消火する。', effect: '【窒息消火・不活性】炎モンスターの絶対の弱点！一瞬で消火する。' },
  NaCl: { formula: 'NaCl', htmlFormula: 'NaCl', name: '塩化ナトリウム', elements: { Na: 1, Cl: 1 }, description: 'いわゆる「食塩」。猛毒のナトリウム金属と猛毒の塩素ガスが合体してできた、安全で美味しい生命維持に不可欠な中性塩。', effect: '【安定中性】激しいイオン反応を安定させ、電気伝導率を上げる！' },
  HCl: { formula: 'HCl', htmlFormula: 'HCl', name: '塩酸（塩化水素）', elements: { H: 1, Cl: 1 }, description: '水酸化ナトリウム（強塩基）などのアルカリ性を中和する強力な酸性溶液。刺激臭があり、金属を溶かして水素を発生させる。', effect: '【強酸攻撃】アルカリ性のヌルヌル汚れモンスターを「中和」して消滅させる！' },
  NaOH: { formula: 'NaOH', htmlFormula: 'NaOH', name: '水酸化ナトリウム', elements: { Na: 1, O: 1, H: 1 }, description: '強いアルカリ性（塩基性）を持つ固体。タンパク質を強力に溶かすため、酸性のこびりついた汚れを強力に分解・中和する。', effect: '【強塩基中和】酸性の毒スライムや酸性汚れを「中和」してきれいに消滅させる！' },
  Fe2O3: { formula: 'Fe2O3', htmlFormula: 'Fe₂O₃', name: '酸化鉄（赤サビ）', elements: { Fe: 2, O: 3 }, description: '鉄が酸素と水によって酸化された姿。ボロボロで脆い。水素などの還元剤をぶつけると、酸素が奪われて元のピカピカの鉄に戻る。', effect: '【サビ（敵素材）】還元剤をぶつけることで大ダメージを与え、鉄に復元できる。' },
  NaHCO3: { formula: 'NaHCO3', htmlFormula: 'NaHCO₃', name: '炭酸水素ナトリウム', elements: { Na: 1, H: 1, C: 1, O: 3 }, description: '重曹。弱アルカリ性で、加熱すると熱分解し、二酸化炭素、水、炭酸ナトリウムに分かれる。中学生の熱分解の実験で最も重要な主役。', effect: '【熱分解パズル】加熱することで大量の二酸化炭素（CO₂）を一気に放出し、大規模消火が可能！' },
};

// クエストステージの定義
interface Stage {
  id: number;
  name: string;
  description: string;
  enemyName: string;
  enemyType: 'fire' | 'rust' | 'acid' | 'base' | 'boss';
  enemyHealth: number;
  enemyMaxHealth: number;
  enemyIntro: string;
  weaknessFormula: string[];
  providedElements: string[]; // このステージで使える元素
  unlockedCompoundReward: string; // クリア時に事典に確定追加される化合物
  xpReward: number;
}

const STAGES: Stage[] = [
  {
    id: 1,
    name: 'ステージ1：炎の山脈の消火活動',
    description: '激しい炎に包まれたモンスターが現れた！酸素を遮断して、炎を鎮火しよう！',
    enemyName: 'メラメラ火焔獣（炎属性）',
    enemyType: 'fire',
    enemyHealth: 120,
    enemyMaxHealth: 120,
    enemyIntro: '「ギャアア！すべてを焼き尽くしてやる！」体を激しく燃え上がらせているモンスター。水をぶつけても蒸発してしまうぞ。燃えない、空気より重いあの窒息気体をぶつけよう！',
    weaknessFormula: ['CO2'],
    providedElements: ['C', 'O', 'H'],
    unlockedCompoundReward: 'CO2',
    xpReward: 80,
  },
  {
    id: 2,
    name: 'ステージ2：サビついた鋼鉄の遺跡',
    description: '酸素に覆われ、真っ赤にサビついてしまった守護兵。還元パワーで元の美しい鉄に戻そう！',
    enemyName: 'ガサガサ赤サビ兵（サビ属性）',
    enemyType: 'rust',
    enemyHealth: 150,
    enemyMaxHealth: 150,
    enemyIntro: '「ギギギ…体ガ重イ…サビ付イテ動ケナイ…」全身に酸化鉄（Fe₂O₃）の赤サビをまとった遺跡の兵士。水素をぶつけて「還元」反応を起こし、サビから酸素を奪い取って元の鉄(Fe)に戻してあげよう！',
    weaknessFormula: ['H2'],
    providedElements: ['Fe', 'O', 'H'],
    unlockedCompoundReward: 'H2',
    xpReward: 100,
  },
  {
    id: 3,
    name: 'ステージ3：酸と塩基の魔窟',
    description: '酸性の粘液を放つスライムと、アルカリ性のヌルヌルモンスターを中和反応で撃破せよ！',
    enemyName: '酸性ゲル＆塩基ヌルヌル（交代属性）',
    enemyType: 'acid', // バトル中に acid と base が切り替わる
    enemyHealth: 200,
    enemyMaxHealth: 200,
    enemyIntro: '「シャーーッ！溶かしてやる！」と「ヌルヌルにしてやる〜」が合体した双子スライム。酸性の時にはアルカリ性(NaOH)を、アルカリ性の時には酸性(HCl)をぶつけて、無害な塩と水に「中和」するのだ！',
    weaknessFormula: ['NaOH', 'HCl'],
    providedElements: ['Na', 'O', 'H', 'Cl'],
    unlockedCompoundReward: 'NaOH',
    xpReward: 120,
  },
  {
    id: 4,
    name: 'ステージ4：暗黒の化学ラボ（ボス戦）',
    description: '最終ボス！水を電気分解して爆発パワーを生み出し、ボスの巨大化合物のバリアを破壊せよ！',
    enemyName: 'マッドサイエンティスト・プロフェッサーX',
    enemyType: 'boss',
    enemyHealth: 300,
    enemyMaxHealth: 300,
    enemyIntro: '「フハハ！私の特殊化合物バリアは無敵だ！だが、H₂Oを電気分解して水素を取り出し、それに引火させて大爆発を起こされたらひとたまりもないがな…おっと、口が滑った！」電気分解を駆使する超難関ボス！',
    weaknessFormula: ['H2', 'O2'],
    providedElements: ['H', 'O', 'C', 'Na', 'Cl', 'Fe'],
    unlockedCompoundReward: 'NaHCO3',
    xpReward: 200,
  }
];

const renderEnemySVG = (type: string) => {
  switch (type) {
    case 'fire':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 text-red-500 fill-current animate-pulse">
          <path d="M50 5C50 5 65 25 65 45C65 61.5 51.5 75 35 75C18.5 75 5 61.5 5 45C5 28.5 25 5 25 5C25 5 35 20 35 30C35 40 50 5 50 5Z" className="text-red-600 fill-current" />
          <path d="M50 25C50 25 60 40 60 55C60 66 51 75 40 75C29 75 20 66 20 55C20 44 35 25 35 25C35 25 42 35 42 42C42 49 50 25 50 25Z" className="text-orange-500 fill-current animate-bounce duration-1000" />
          <path d="M50 45C50 45 55 55 55 65C55 71 50 75 45 75C40 75 35 71 35 65C35 59 45 45 45 45C45 45 48 50 48 54C48 58 50 45 50 45Z" className="text-yellow-400 fill-current" />
        </svg>
      );
    case 'rust':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 text-amber-800 stroke-amber-900 fill-current animate-spin duration-[10000ms]">
          <circle cx="50" cy="50" r="15" className="fill-stone-600" />
          <path strokeWidth="3" strokeLinecap="round" d="M50 10 L50 25 M50 75 L50 90 M10 50 L25 50 M75 50 L90 50 M22 22 L32 32 M68 68 L78 78 M22 78 L32 68 M68 22 L78 32" />
          <circle cx="50" cy="50" r="25" fill="none" strokeWidth="6" className="stroke-amber-700" />
          <path d="M40 30 Q50 35 60 30 T80 45" fill="none" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
          <path d="M20 65 Q35 60 50 70 T80 60" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'acid':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 text-lime-500 fill-current animate-bounce duration-[1500ms]">
          <path d="M50 15 C25 45 15 60 15 75 A35 35 0 0 0 85 75 C85 60 75 45 50 15 Z" />
          <circle cx="40" cy="55" r="5" className="fill-white/40" />
          <circle cx="65" cy="70" r="8" className="fill-lime-300" />
          <circle cx="35" cy="75" r="4" className="fill-lime-400" />
          <path d="M10 85 Q30 75 50 85 T90 85" fill="none" stroke="#84cc16" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case 'base':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 text-cyan-400 fill-current animate-pulse">
          <rect x="35" y="15" width="30" height="15" rx="5" className="fill-cyan-600" />
          <path d="M35 30 L15 80 A10 10 0 0 0 25 90 L75 90 A10 10 0 0 0 85 80 L65 30 Z" className="fill-cyan-500/80" />
          <circle cx="50" cy="65" r="8" className="fill-white/50 animate-ping" />
          <circle cx="35" cy="55" r="5" className="fill-white/60 animate-bounce" />
          <circle cx="60" cy="75" r="6" className="fill-white/40" />
          <circle cx="50" cy="40" r="12" fill="none" stroke="#06b6d4" strokeWidth="3" className="stroke-cyan-300" />
        </svg>
      );
    case 'boss':
      return (
        <svg viewBox="0 0 100 100" className="w-12 h-12 text-indigo-500 animate-pulse">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="animate-spin duration-[6000ms]" />
          <polygon points="50,15 80,75 20,75" fill="none" stroke="#4f46e5" strokeWidth="4" />
          <circle cx="50" cy="50" r="15" className="fill-indigo-600" />
          <circle cx="50" cy="50" r="6" className="fill-yellow-400" />
          <path d="M25 25 L35 35 M75 25 L65 35 M25 75 L35 65 M75 75 L65 65" stroke="#818cf8" strokeWidth="3" />
        </svg>
      );
    default:
      return null;
  }
};

const renderPlayerSVG = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 text-indigo-400 fill-current">
    <path d="M50 10 L85 25 V55 C85 75 50 90 50 90 C50 90 15 75 15 55 V25 Z" className="fill-slate-900 stroke-indigo-500" strokeWidth="4" />
    <circle cx="50" cy="45" r="12" className="fill-indigo-500/30 stroke-indigo-400" strokeWidth="3" />
    <path d="M35 72 C35 63 65 63 65 72" className="fill-none stroke-indigo-400 animate-pulse" strokeWidth="3" />
    <path d="M42 30 L58 30 M50 25 L50 35" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const renderHeartSVG = (filled: boolean) => (
  <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-transform duration-300 ${filled ? 'text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]' : 'text-slate-600 fill-none'}`}>
    <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const renderTrophySVG = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto text-yellow-400 animate-bounce duration-[2000ms] drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]">
    <path d="M30 20 H70 V50 C70 61 61 70 50 70 C39 70 30 61 30 50 Z" className="fill-yellow-500 stroke-yellow-300" strokeWidth="4" />
    <path d="M30 30 H15 V45 C15 50 20 55 25 55 H30" fill="none" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
    <path d="M70 30 H85 V45 C85 50 80 55 75 55 H70" fill="none" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 70 V85 M35 85 H65" fill="none" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
    <polygon points="50,32 53,39 60,40 55,45 57,52 50,48 43,52 45,45 40,40 47,39" className="fill-yellow-200" />
  </svg>
);

const renderFailureSVG = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto text-red-500 animate-pulse">
    <path d="M50 15 L85 30 V60 C85 75 50 90 50 90 C50 90 15 75 15 60 V30 Z" fill="none" stroke="currentColor" strokeWidth="5" />
    <path d="M35 35 L65 65 M65 35 L35 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

export default function GameView({ userProgress, setUserProgress }: GameViewProps) {
  const [activeTab, setActiveTab] = useState<'quest' | 'encyclopedia' | 'lab'>('quest');

  // --- クエスト（バトル）関連の状態 ---
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageState, setStageState] = useState<'intro' | 'battle' | 'victory' | 'defeat'>('intro');
  const [enemyHealth, setEnemyHealth] = useState(120);
  const [enemyType, setEnemyType] = useState<'fire' | 'rust' | 'acid' | 'base' | 'boss'>('fire');
  const [playerHearts, setPlayerHearts] = useState(3);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [tray, setTray] = useState<string[]>([]); // 調合トレイの元素
  const [isElectrolyzing, setIsElectrolyzing] = useState(false);

  // --- 入力ボーナス（コンボシステム）関連の状態 ---
  const [bonusTarget, setBonusTarget] = useState<string | null>(null);
  const [bonusClicks, setBonusClicks] = useState(0);
  const [bonusRequired, setBonusRequired] = useState(8);
  const [bonusTimer, setBonusTimer] = useState(0);
  const [bonusActive, setBonusActive] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1.0);

  // --- 事典 & ラボ関連の状態 ---
  const [discoveredCompounds, setDiscoveredCompounds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('discovered_compounds');
      return saved ? JSON.parse(saved) : ['H2O', 'O2'];
    } catch {
      return ['H2O', 'O2'];
    }
  });
  const [labTray, setLabTray] = useState<string[]>([]);
  const [labFeedback, setLabFeedback] = useState<string>('');

  // 敵の最大HP
  const currentStage = STAGES[currentStageIndex];

  // 事典保存
  const saveDiscovered = (list: string[]) => {
    setDiscoveredCompounds(list);
    try {
      localStorage.setItem('discovered_compounds', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  // ステージ切り替え時に状態を初期化
  const startStage = (index: number) => {
    setCurrentStageIndex(index);
    const selectedStage = STAGES[index];
    setEnemyHealth(selectedStage.enemyHealth);
    setEnemyType(selectedStage.enemyType);
    setPlayerHearts(3);
    setStageState('intro');
    setBattleLog([`${selectedStage.enemyName} が現れた！`]);
    setTray([]);
    setBonusActive(false);
    setComboMultiplier(1.0);
  };

  // バトル開始
  const handleStartBattle = () => {
    setStageState('battle');
    addLog(`作戦開始！手持ちの元素を組み合わせて、効果的な化合物をクラフトしてぶつけよう！`);
  };

  // ログ追加
  const addLog = (msg: string) => {
    setBattleLog(prev => [msg, ...prev].slice(0, 30));
  };

  // トレイに元素を追加
  const handleAddToTray = (symbol: string) => {
    if (tray.length >= 6) {
      addLog('[エラー] 反応物スロット容量超過（上限6原子）');
      return;
    }
    setTray(prev => [...prev, symbol]);
    // 入力ボーナスのトリガー：元素をタップした瞬間に記号入力ボーナスミニゲームをときどき発生させる
    if (Math.random() < 0.4 && !bonusActive) {
      triggerBonusInput(symbol);
    }
  };

  // トレイをクリア
  const handleClearTray = () => {
    setTray([]);
  };

  // トレイから1つ削除
  const handleRemoveFromTray = (index: number) => {
    setTray(prev => prev.filter((_, i) => i !== index));
  };

  // 入力ボーナス（コンボ）の起動
  const triggerBonusInput = (symbol: string) => {
    setBonusTarget(symbol);
    setBonusClicks(0);
    setBonusRequired(Math.floor(Math.random() * 4) + 6); // 6~9回の連打
    setBonusTimer(4.0); // 4秒制限
    setBonusActive(true);
  };

  // 入力ボーナスクリック/キー入力
  const handleBonusClick = () => {
    if (!bonusActive) return;
    setBonusClicks(prev => {
      const next = prev + 1;
      if (next >= bonusRequired) {
        setTimeout(() => {
          setBonusActive(false);
          setComboMultiplier(2.0); // 攻撃威力2倍！
          addLog(`[同調成功] 元素記号【${bonusTarget}】の同調を確認！結合エネルギー出力 200%！`);
          // わずかにXP獲得
          giveXP(5, false);
        }, 0);
      }
      return next;
    });
  };

  // タイマー減少処理
  useEffect(() => {
    if (!bonusActive) return;
    const interval = setInterval(() => {
      setBonusTimer(prev => {
        if (prev <= 0.1) {
          clearInterval(interval);
          setTimeout(() => {
            setBonusActive(false);
            setComboMultiplier(0.8); // 失敗すると少し弱体化
            addLog(`[時間切れ] 元素記号の同調シグナルが消失しました。`);
          }, 0);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [bonusActive]);

  // XPを付与し、レベルアップ判定を行う
  const giveXP = (amount: number, showLog = true) => {
    setUserProgress(prev => {
      const newXp = prev.xp + amount;
      const xpNeeded = prev.level * 100; // レベルアップに必要なXP (簡易式)
      if (newXp >= xpNeeded) {
        const nextLevel = prev.level + 1;
        if (showLog) {
          addLog(`[レベルアップ] 学術ランク上昇: Level ${prev.level} ➔ ${nextLevel}！`);
        }
        // バッジなどの獲得
        return {
          ...prev,
          level: nextLevel,
          xp: newXp - xpNeeded,
        };
      }
      return {
        ...prev,
        xp: newXp,
      };
    });
  };

  // 化学合成（トレイの中身から化合物を作る）
  const synthesizeCompound = (elementsList: string[]): CompoundInfo | null => {
    // 元素数をカウント
    const counts: { [key: string]: number } = {};
    elementsList.forEach(e => {
      counts[e] = (counts[e] || 0) + 1;
    });

    // 化合物データベースと照合
    for (const formula in COMPOUNDS) {
      const compound = COMPOUNDS[formula];
      const match = Object.keys(compound.elements).every(el => {
        return counts[el] === compound.elements[el];
      }) && Object.keys(counts).every(el => {
        return compound.elements[el] === counts[el];
      });

      if (match) {
        return compound;
      }
    }
    return null;
  };

  // 電気分解のパズルアクション
  const handleElectrolysis = () => {
    // トレイに H2O (H2個、O1個) があるかチェック
    const hCount = tray.filter(x => x === 'H').length;
    const oCount = tray.filter(x => x === 'O').length;

    if (hCount >= 2 && oCount >= 1) {
      setIsElectrolyzing(true);
      setTimeout(() => {
        setIsElectrolyzing(false);
        // H2Oを取り出して、H2とO2を生成してトレイに置く (H₂とO₂の気体分子に分解)
        // 2 H2O -> 2 H2 + O2 ですが、簡易的に 1回分を分解
        // Hを2個、Oを1個トレイから除去し、代わりに H2とO2のカードを置く（あるいは単体の H と O にして倍に増やす）
        // 中学生向けの電気分解ギミック：H2Oを分解して、「水素(H₂)」と「酸素(O₂)」ガスを作り出す！
        // トレイをクリアして H2分子、O2分子を入れる
        setTray(['H', 'H', 'O', 'O']); // H2分子とO2分子の原料、あるいはそのまま爆発コンボへ
        addLog('[電気分解] 水（H₂O）への通電完了。陽極から酸素、陰極から水素（体積比2:1）が激しく発生！');
        addLog('[物質生成] 反応トレイに水素分子（H₂）と酸素分子（O₂）を展開しました。');
        giveXP(10);
      }, 1500);
    } else {
      addLog('[エラー] 反応条件不適合：電気分解に必要な反応原資（H₂O: 水素2、酸素1）がトレイに不足しています。');
    }
  };

  // 攻撃実行
  const handleAttack = () => {
    if (tray.length === 0) {
      addLog('[注意] 反応トレイに元素が配置されていません。');
      return;
    }

    const compound = synthesizeCompound(tray);

    if (!compound) {
      // 合成失敗：ただの元素混ざり物
      const elementsJoined = tray.join('');
      addLog(`[結合不発] 不安定な原子配置「${elementsJoined}」のため結合が形成されず、未反応のまま崩壊しました。`);
      setPlayerHearts(prev => {
        const next = prev - 1;
        if (next <= 0) {
          setStageState('defeat');
        }
        return next;
      });
      setTray([]);
      return;
    }

    // 合成成功！
    addLog(`[合成成功] 化合物「${compound.name}」（${compound.formula}）の分子結合が完了しました。`);
    
    // 事典アンロックに追加
    if (!discoveredCompounds.includes(compound.formula)) {
      const newList = [...discoveredCompounds, compound.formula];
      saveDiscovered(newList);
      addLog(`[図鑑追加] 新規化合物「${compound.name}」が元素事典に登録されました！`);
      giveXP(15);
    }

    // ダメージ計算
    let baseDamage = 30;
    let isWeakness = false;

    // ステージごとの弱点判定
    const stage = STAGES[currentStageIndex];

    if (stage.enemyType === 'fire') {
      if (compound.formula === 'CO2') {
        baseDamage = 80;
        isWeakness = true;
        addLog(`[消火反応] 二酸化炭素による窒息消火。酸素供給を完全に遮断し、熱エネルギーを大幅に減衰させました！【弱点特効】`);
      } else if (compound.formula === 'H2O') {
        baseDamage = 45;
        addLog(`[冷却反応] 水滴接触による吸熱・冷却を実行。部分的な水蒸気爆発による局所衝撃を検知。`);
      } else if (compound.formula === 'H2') {
        // 水素は可燃性のため大爆発！プレイヤーもダメージを受けるパズル
        baseDamage = 100;
        addLog(`[激しい反応] 可燃性水素分子（H₂）が熱源により急速酸化（爆鳴気反応）。大爆発により被験者にも衝撃がフィードバックされました！`);
        setPlayerHearts(prev => Math.max(1, prev - 1));
      } else {
        baseDamage = 15;
        addLog(`[非効率] 対象の熱エネルギーを相殺するには結合能力が不足しています。`);
      }
    } 
    else if (stage.enemyType === 'rust') {
      if (compound.formula === 'H2') {
        baseDamage = 90;
        isWeakness = true;
        addLog(`[還元反応] 水素（H₂）が酸化被膜（赤サビ・Fe₂O₃）から酸素を脱離させて水分子（H₂O）を生成し、金属鉄へと還元！【弱点特効】`);
      } else if (compound.formula === 'O2') {
        baseDamage = 5;
        addLog(`[異常反応] 対象に高濃度酸素（O₂）を供給。酸化が促進され、対象の金属強度が上昇しました。`);
        // 敵HP回復
        setEnemyHealth(prev => Math.min(stage.enemyMaxHealth, prev + 20));
      } else {
        baseDamage = 15;
        addLog(`[非効率] 対象の硬化酸化被膜に物理・化学的干渉を与えることができません。`);
      }
    } 
    else if (stage.enemyType === 'acid') {
      if (compound.formula === 'NaOH') {
        baseDamage = 100;
        isWeakness = true;
        addLog(`[中和反応] 強塩基性水酸化ナトリウム（NaOH）が酸性ゲルを速やかに中和、水と塩（無害）に相転移させました！【弱点特効】`);
        // 敵の属性が base（アルカリ）に切り替わるギミック！
        setEnemyType('base');
        addLog(`[状態変化] 中和剤過剰投与により、対象ゲルの水素イオン濃度指数がアルカリ（強塩基性）側にシフト。`);
      } else if (compound.formula === 'HCl') {
        baseDamage = 5;
        addLog(`[無効] 同系統酸性液（HCl）の注入を検知。同調効果により活性が維持され、効果はありません。`);
      } else {
        baseDamage = 20;
        addLog(`[要中和] ゲルの液性に適合する中和剤（塩基性物質）を投与してください。`);
      }
    } 
    else if (enemyType === 'base') { // ステージ3のアルカリ形態
      if (compound.formula === 'HCl') {
        baseDamage = 100;
        isWeakness = true;
        addLog(`[中和反応] 強酸性塩化水素（HCl）が塩基性粘液を中和、塩化ナトリウム（NaCl）と水に速やかに分解！【弱点特効】`);
        setEnemyType('acid');
        addLog(`[状態変化] 酸性剤の連続中和により、対象粘液の水素イオン濃度指数が酸性側に再びシフト。`);
      } else if (compound.formula === 'NaOH') {
        baseDamage = 5;
        addLog(`[無効] 塩基性媒体（NaOH）の追加。アルカリ強度が維持され、反応効率が極めて低いです。`);
      } else {
        baseDamage = 20;
        addLog(`[要中和] 媒体の液性に適合する中和剤（酸性物質）を投与してください。`);
      }
    }
    else if (stage.enemyType === 'boss') {
      // 最終ボス
      if (compound.formula === 'H2') {
        baseDamage = 95;
        isWeakness = true;
        addLog(`[激突反応] 電気分解で得た高エネルギー水素（H₂）が起爆！プロフェッサーXの特殊化合物シールドを木っ端微塵に破砕しました！【弱点特効】`);
      } else if (compound.formula === 'O2') {
        baseDamage = 60;
        isWeakness = true;
        addLog(`[回路酸化] 急激な酸素（O₂）供給による電装系の異常酸化。ボスの制御装置にシステムエラーを誘発！【弱点特効】`);
      } else if (compound.formula === 'CO2') {
        baseDamage = 50;
        addLog(`[視界遮断] 二酸化炭素ガス噴射によるサーマルセンサー妨害および局所消火冷却。`);
      } else {
        baseDamage = 30;
        addLog(`プロフェッサーXは狡猾な防護処理を施しています。化学反応の組み合わせを再考するか、電気分解で水素を取り出して急激な反応を起こす必要があります。`);
      }
    }

    // 弱点ボーナス
    if (isWeakness) {
      giveXP(5, false); // 弱点を突いたボーナスとして5XP追加
    }

    // コンボボーナスの適用
    const finalDamage = Math.floor(baseDamage * comboMultiplier);
    const damageMessage = `[反応結果] 対象に ${finalDamage} の熱・化学的エネルギー干渉を検知。` + (comboMultiplier > 1 ? `（励起同調倍率 ${comboMultiplier}倍！）` : '');
    addLog(damageMessage);

    // 敵HPを減らす
    setEnemyHealth(prev => {
      const next = prev - finalDamage;
      if (next <= 0) {
        // 勝利！
        setTimeout(() => {
          setStageState('victory');
          giveXP(stage.xpReward);
          // 新しい化合物を事典に確定登録
          if (!discoveredCompounds.includes(stage.unlockedCompoundReward)) {
            const newList = [...discoveredCompounds, stage.unlockedCompoundReward];
            saveDiscovered(newList);
          }
        }, 0);
      } else {
        // 敵の反撃（ターン制）
        enemyCounterAttack(next);
      }
      return Math.max(0, next);
    });

    // トレイとコンボをリセット
    setTray([]);
    setComboMultiplier(1.0);
  };

  // 敵の反撃
  const enemyCounterAttack = (currentEnemyHealth: number) => {
    setTimeout(() => {
      if (stageState !== 'battle' && currentEnemyHealth <= 0) return;
      const stage = STAGES[currentStageIndex];
      const attackMsg = `${stage.enemyName} の反撃反応プロセス開始！強烈な熱・酸性シグナルが接近！`;
      addLog(`[警告] ${attackMsg}`);

      // ライフ減少
      setPlayerHearts(prev => {
        const next = prev - 1;
        if (next <= 0) {
          setTimeout(() => {
            setStageState('defeat');
            addLog('[実験不能] システム破損、生命・機材維持限界に達しました。');
          }, 0);
        } else {
          setTimeout(() => {
            addLog(`[システム損傷] 実験器具が損傷を受けました（耐久度残: ${next}）`);
          }, 0);
        }
        return next;
      });
    }, 1000);
  };

  // ----------------------------------------
  // 自由調合（ラボ）のロジック
  // ----------------------------------------
  const handleAddToLabTray = (symbol: string) => {
    if (labTray.length >= 6) return;
    setLabTray(prev => [...prev, symbol]);
  };

  const handleClearLab = () => {
    setLabTray([]);
    setLabFeedback('');
  };

  const handleSynthesizeLab = () => {
    if (labTray.length === 0) return;
    const compound = synthesizeCompound(labTray);
    if (compound) {
      setLabFeedback(`[調合成功] 「${compound.name}」(${compound.formula}) の合成に成功しました。\n性質: ${compound.description}`);
      if (!discoveredCompounds.includes(compound.formula)) {
        const newList = [...discoveredCompounds, compound.formula];
        saveDiscovered(newList);
        giveXP(20);
      }
    } else {
      setLabFeedback(`[結合失敗] 元素の原子比率が不適合、または構造が極めて不安定なため結合が形成されません。教科書や図鑑に記載されている化合物の比率を確認してください。`);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col h-auto md:h-[85vh]">
      {/* ヘッダー・ナビゲーション */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg">
            <Icon name="flask" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <span>元素バトルラボ</span>
              <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-black">
                中学生理科・化学
              </span>
            </h2>
            <p className="text-xs text-slate-400">元素をクラフトし、化学反応の特性でモンスターを撃破せよ！</p>
            <p className="text-[10px] text-indigo-300 font-bold mt-1">
              現在の学術レベル: Lv.{userProgress.level} ({userProgress.activeTitle || 'ひよこ研究者'})
            </p>
          </div>
        </div>

        {/* タブ */}
        <div className="flex bg-slate-800 rounded-xl p-1 gap-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('quest')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'quest' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon name="play" className="w-3.5 h-3.5" />
            クエスト
          </button>
          <button
            onClick={() => setActiveTab('encyclopedia')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'encyclopedia' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon name="book" className="w-3.5 h-3.5" />
            元素事典 ({discoveredCompounds.length} / {Object.keys(COMPOUNDS).length})
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'lab' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon name="flask" className="w-3.5 h-3.5" />
            自由調合
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-grow overflow-hidden flex flex-col">
        {/* ======================================================== */}
        {/* QUEST TAB */}
        {/* ======================================================== */}
        {activeTab === 'quest' && (
          <div className="flex-grow flex flex-col md:flex-row md:overflow-hidden h-auto md:h-full">
            {/* 左側：ステージ一覧またはバトル画面 */}
            <div className="flex-grow md:w-2/3 p-4 lg:p-6 md:overflow-y-auto flex flex-col border-b md:border-b-0 md:border-r border-slate-100">
              {stageState === 'intro' && (
                <div className="space-y-6 max-w-2xl mx-auto py-6 animate-fade-in">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                      STAGE {currentStage.id}
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      {currentStage.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {currentStage.description}
                    </p>
                  </div>

                  {/* ステージセレクト */}
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {STAGES.map((stg, idx) => (
                      <button
                        key={stg.id}
                        onClick={() => startStage(idx)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                          currentStageIndex === idx
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        ステージ {stg.id}
                      </button>
                    ))}
                  </div>

                  {/* 敵紹介カード */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center p-2 shadow-inner">
                        {renderEnemySVG(currentStage.enemyType)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800">{currentStage.enemyName}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] bg-red-100 border border-red-200 text-red-700 px-2 py-0.5 rounded-full font-black">
                            属性: {currentStage.enemyType === 'fire' && '炎・燃焼'}
                            {currentStage.enemyType === 'rust' && '赤サビ・酸化鉄'}
                            {currentStage.enemyType === 'acid' && '強酸性ゲル'}
                            {currentStage.enemyType === 'base' && '強塩基性ヌルヌル'}
                            {currentStage.enemyType === 'boss' && 'プロフェッサーX'}
                          </span>
                          <span className="text-[10px] bg-indigo-100 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full font-black">
                            HP: {currentStage.enemyHealth}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-100">
                      {currentStage.enemyIntro}
                    </p>
                  </div>

                  {/* 開始ボタン */}
                  <button
                    onClick={handleStartBattle}
                    className="w-full bg-indigo-600 hover:bg-indigo-550 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
                  >
                    <Icon name="play" className="w-4 h-4" />
                    <span>元素結合バトル、開始！</span>
                  </button>
                </div>
              )}

              {stageState === 'battle' && (
                <div className="space-y-6 flex-grow flex flex-col justify-between animate-fade-in">
                  {/* バトルフィールド（ビジュアル） */}
                  <div className="grid grid-cols-2 gap-4 items-center bg-slate-50 border border-slate-200/60 rounded-2xl p-5 shadow-inner min-h-[160px] relative">
                    {/* 左：プレイヤー側 */}
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-2xl shadow-md">
                        {renderPlayerSVG()}
                      </div>
                      <div className="text-xs font-black text-slate-600">プレイヤー</div>
                      <div className="flex gap-1.5 bg-slate-900/10 px-2.5 py-1.5 rounded-xl border border-slate-200/50">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <React.Fragment key={i}>
                            {renderHeartSVG(i < playerHearts)}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* 右：敵モンスター */}
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-16 h-16 flex items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800 p-2 shadow-inner animate-bounce duration-[2000ms]">
                        {renderEnemySVG(enemyType)}
                      </div>
                      <div className="text-xs font-black text-slate-700">{currentStage.enemyName}</div>
                      {/* HPバー */}
                      <div className="w-full max-w-[120px] bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-350">
                        <div
                          className="bg-red-500 h-full transition-all duration-300"
                          style={{ width: `${(enemyHealth / currentStage.enemyMaxHealth) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        HP: {enemyHealth} / {currentStage.enemyMaxHealth}
                      </div>
                    </div>

                    {/* 入力連打ボーナスオーバーレイ */}
                    {bonusActive && (
                      <div className="absolute inset-0 bg-indigo-900/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-4 text-white animate-fade-in z-10">
                        <span className="text-[10px] bg-indigo-500/40 border border-indigo-500/60 px-2 py-0.5 rounded-full font-black animate-pulse">
                          同調コンボ発生中！
                        </span>
                        <h4 className="text-xl font-black mt-1 text-yellow-300 flex items-center gap-1.5">
                          化学記号「{bonusTarget}」を連打せよ！
                        </h4>
                        <p className="text-[11px] text-indigo-200 mt-1">
                          時間内にたくさん連打して反応エネルギーを高めろ！
                        </p>

                        <div className="flex items-center gap-4 mt-3">
                          {/* 連打進捗 */}
                          <div className="w-32 bg-indigo-950 rounded-full h-4 overflow-hidden border border-indigo-700">
                            <div
                              className="bg-yellow-400 h-full transition-all duration-100"
                              style={{ width: `${(bonusClicks / bonusRequired) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-black text-yellow-300">
                            {bonusClicks} / {bonusRequired}
                          </span>
                        </div>

                        {/* 連打ボタン */}
                        <button
                          onClick={handleBonusClick}
                          className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-350 active:scale-95 text-slate-900 font-black rounded-full shadow-lg text-sm cursor-pointer border-2 border-white animate-bounce"
                        >
                          {bonusTarget} をタップ！
                        </button>

                        <div className="text-[10px] text-indigo-300 mt-2">
                          制限時間: {bonusTimer.toFixed(1)}s
                        </div>
                      </div>
                    )}
                  </div>

                  {/* モバイル専用：元素パレット & 弱点 & 最新戦闘ログ */}
                  <div className="md:hidden flex flex-col gap-3 bg-slate-50 border border-slate-200/60 rounded-2xl p-4 shrink-0">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h5 className="text-[10px] font-black text-slate-500 tracking-wider mb-1.5 uppercase">
                          弱点ターゲット
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {currentStage.weaknessFormula.map(f => {
                            const c = COMPOUNDS[f];
                            return (
                              <span key={f} className="text-[9px] font-black bg-indigo-50 border border-indigo-150 text-indigo-700 px-1.5 py-0.5 rounded-lg">
                                {c?.name} ({c?.htmlFormula || f})
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-[10px] font-black text-slate-500 tracking-wider mb-1.5 uppercase">
                          最新戦闘ログ
                        </h5>
                        <div className="bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[9px] px-2 py-1.5 rounded-lg h-[42px] overflow-hidden flex flex-col justify-center">
                          {battleLog.length > 0 ? (
                            <div className="line-clamp-2 text-white font-bold leading-tight">
                              {battleLog[0]}
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">戦闘ログ...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-black text-slate-500 tracking-wider mb-1.5 uppercase flex justify-between">
                        <span>元素パレット (タップでトレイに追加)</span>
                      </h5>
                      <div className="grid grid-cols-4 gap-1.5">
                        {currentStage.providedElements.map(symbol => {
                          const info = ELEMENTS[symbol];
                          return (
                            <button
                              key={symbol}
                              onClick={() => handleAddToTray(symbol)}
                              className={`h-11 rounded-xl flex flex-col items-center justify-center border border-black/10 shadow-xs transition-all active:scale-95 cursor-pointer ${info?.color || 'bg-indigo-600 text-white'}`}
                            >
                              <span className="text-xs font-black leading-none">{symbol}</span>
                              <span className="text-[7px] opacity-80 mt-0.5 leading-none">{info?.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* クラフト・トレイ（調合台） */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-slate-500 tracking-wider flex items-center gap-1.5">
                        <span>🧪 クラフト台（調合トレイ）</span>
                        <span className="text-[10px] font-bold text-slate-400">※最大6個</span>
                      </h4>
                      <div className="flex gap-2">
                        {/* 電気分解ボタン（水がトレイにある時に活性化） */}
                        <button
                          onClick={handleElectrolysis}
                          disabled={isElectrolyzing}
                          className="px-2.5 py-1 text-[11px] font-black bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg hover:bg-yellow-200 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                        >
                          ⚡ 電気分解
                        </button>
                        <button
                          onClick={handleClearTray}
                          className="text-[11px] font-extrabold text-slate-500 hover:text-red-500 transition-all cursor-pointer"
                        >
                          トレイを空にする
                        </button>
                      </div>
                    </div>

                    {/* トレイのグリッド */}
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 min-h-[90px] flex items-center gap-3 overflow-x-auto">
                      {tray.length === 0 ? (
                        <p className="text-xs text-slate-400 font-medium text-center w-full">
                          下の元素を選んでトレイに入れ、化合物をクラフトしよう！
                        </p>
                      ) : (
                        tray.map((symbol, idx) => {
                          const info = ELEMENTS[symbol];
                          return (
                            <button
                              key={idx}
                              onClick={() => handleRemoveFromTray(idx)}
                              className={`w-12 h-14 rounded-xl border border-black/10 flex flex-col items-center justify-between py-1 shadow-sm shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer ${info?.color || 'bg-slate-400'}`}
                            >
                              <span className="text-[9px] opacity-75 font-bold leading-none">
                                {info?.atomicNumber}
                              </span>
                              <span className="text-sm font-black tracking-tight leading-none">
                                {symbol}
                              </span>
                              <span className="text-[8px] opacity-90 leading-none truncate max-w-[40px]">
                                {info?.name}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* クラフトした化合物のプレビュー & 攻撃 */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5">
                        合成プレビュー
                      </span>
                      {synthesizeCompound(tray) ? (
                        <div className="mt-1.5">
                          <h5 className="font-extrabold text-slate-800 text-sm flex items-center gap-1">
                            <span>{synthesizeCompound(tray)?.name}</span>
                            <span className="text-xs font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                              {synthesizeCompound(tray)?.formula}
                            </span>
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {synthesizeCompound(tray)?.effect}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          現在の組み合わせ：{tray.length > 0 ? tray.join(' + ') : 'なし'} (化合未完成)
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleAttack}
                      disabled={tray.length === 0}
                      className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-3 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 text-xs disabled:opacity-40 shrink-0"
                    >
                      <Icon name="flask" className="w-4 h-4 text-indigo-400" />
                      <span>化学反応で攻撃！</span>
                    </button>
                  </div>
                </div>
              )}

              {stageState === 'victory' && (
                <div className="text-center py-8 space-y-6 max-w-md mx-auto animate-fade-in">
                  {renderTrophySVG()}
                  <div className="space-y-2">
                    <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">
                      VICTORY
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      実験成功！クリア！
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      見事な化学知識でモンスターの反応特性を解明しました！
                    </p>
                  </div>

                  {/* 報酬カード */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-left space-y-3 shadow-sm">
                    <h4 className="font-extrabold text-emerald-900 text-xs tracking-wider uppercase flex items-center gap-1.5">
                      <Icon name="award" className="w-4 h-4 text-emerald-600" />
                      <span>獲得した報酬・アンロック</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b border-emerald-200/50 pb-2">
                        <span className="text-slate-600">学習経験値 (XP)</span>
                        <span className="font-black text-emerald-700">+{currentStage.xpReward} XP</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-600">新登録の化合物</span>
                        <span className="font-black text-indigo-700 bg-white border border-indigo-200 rounded px-2 py-0.5">
                          {COMPOUNDS[currentStage.unlockedCompoundReward]?.name} ({COMPOUNDS[currentStage.unlockedCompoundReward]?.formula})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (currentStageIndex < STAGES.length - 1) {
                          startStage(currentStageIndex + 1);
                        } else {
                          startStage(0);
                        }
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition-all text-xs"
                    >
                      {currentStageIndex < STAGES.length - 1 ? '次のステージへ' : 'ステージ選択に戻る'}
                    </button>
                  </div>
                </div>
              )}

              {stageState === 'defeat' && (
                <div className="text-center py-8 space-y-6 max-w-md mx-auto animate-fade-in">
                  {renderFailureSVG()}
                  <div className="space-y-2">
                    <span className="text-xs font-black tracking-widest text-red-600 uppercase">
                      FAILED
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      不発！実験失敗…
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      反応が暴走するか、敵の反撃によりトレイの機材が壊れてしまいました。
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-left">
                    <h4 className="font-extrabold text-red-900 text-xs mb-1.5 flex items-center gap-1.5">
                      <Icon name="info" className="w-4 h-4 text-red-700" />
                      <span>ヒント</span>
                    </h4>
                    <p className="text-xs text-red-800/80 leading-relaxed">
                      敵の「弱点」属性に合う化合物を合成しましょう。
                      炎には二酸化炭素（CO₂: C+O₂）、サビには水素（H₂: H₂分子）の還元力が有効です！
                    </p>
                  </div>

                  <button
                    onClick={() => startStage(currentStageIndex)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition-all text-xs"
                  >
                    リトライ（もう一度挑戦）
                  </button>
                </div>
              )}
            </div>

            {/* 右側：元素パレット & ログ */}
            <div className="hidden md:flex md:w-1/3 bg-slate-50 p-4 lg:p-6 flex-col h-full justify-between overflow-hidden">
              <div className="space-y-4 flex-grow overflow-hidden flex flex-col justify-between">
                {/* 元素パレット */}
                <div className="shrink-0">
                  <h4 className="text-xs font-black text-slate-500 tracking-wider mb-2 flex items-center justify-between">
                    <span>元素パレット</span>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      タップで追加
                    </span>
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {currentStage.providedElements.map(symbol => {
                      const info = ELEMENTS[symbol];
                      return (
                        <button
                          key={symbol}
                          onClick={() => handleAddToTray(symbol)}
                          className={`h-12 rounded-xl flex flex-col items-center justify-center border border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${info?.color || 'bg-indigo-600 text-white'}`}
                        >
                          <span className="text-xs font-black">{symbol}</span>
                          <span className="text-[8px] opacity-80">{info?.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 属性・弱点確認カード */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-sm shrink-0">
                  <h5 className="text-[10px] font-black text-slate-500 tracking-wider flex items-center gap-1 mb-1">
                    ステージ弱点ターゲット
                  </h5>
                  <div className="space-y-1.5">
                    {currentStage.weaknessFormula.map(f => {
                      const c = COMPOUNDS[f];
                      return (
                        <div key={f} className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-700">{c?.name}</span>
                          <span className="font-mono text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 rounded">
                            {c?.htmlFormula || f}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ログ一覧 */}
                <div className="flex-grow overflow-hidden flex flex-col min-h-[120px]">
                  <h4 className="text-xs font-black text-slate-500 tracking-wider mb-1">
                    バトル履歴ログ
                  </h4>
                  <div className="bg-slate-900 text-slate-200 font-mono text-[11px] p-3 rounded-xl flex-grow overflow-y-auto space-y-1 scrollbar-hide border border-slate-800">
                    {battleLog.length === 0 ? (
                      <p className="text-slate-500 italic">戦闘ログがここに表示されます…</p>
                    ) : (
                      battleLog.map((log, idx) => (
                        <div
                          key={idx}
                          className={`${
                            idx === 0
                              ? 'text-white font-extrabold border-l-2 border-indigo-500 pl-1.5'
                              : 'text-slate-400 opacity-80'
                          }`}
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ENCYCLOPEDIA TAB */}
        {/* ======================================================== */}
        {activeTab === 'encyclopedia' && (
          <div className="flex-grow p-4 lg:p-6 overflow-y-auto space-y-6">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                元素・化合物事典
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                クエストや調合でアンロックされた化学物質の図鑑。中学生のテストによく出る重要な性質を覚えて、科学知識を深めよう！
              </p>
            </div>

            {/* 元素セクション */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-indigo-600 tracking-widest uppercase">
                1. 重要な元素（原子）
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(ELEMENTS).map(symbol => {
                  const info = ELEMENTS[symbol];
                  return (
                    <div
                      key={symbol}
                      className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex gap-4 shadow-sm"
                    >
                      <div
                        className={`w-14 h-16 rounded-xl border border-black/10 flex flex-col items-center justify-between py-1.5 shadow shrink-0 ${info.color}`}
                      >
                        <span className="text-[10px] opacity-75 font-bold leading-none">
                          {info.atomicNumber}
                        </span>
                        <span className="text-lg font-black leading-none">{symbol}</span>
                        <span className="text-[9px] opacity-90 leading-none">{info.name}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-extrabold text-sm text-slate-800">{info.name}</h5>
                          <span className="text-[9px] bg-slate-200 border border-slate-300 text-slate-600 px-1.5 rounded-full font-bold">
                            {info.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 化合物セクション */}
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-black text-indigo-600 tracking-widest uppercase">
                2. 重要な化合物
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(COMPOUNDS).map(formula => {
                  const comp = COMPOUNDS[formula];
                  const isUnlocked = discoveredCompounds.includes(formula);

                  return (
                    <div
                      key={formula}
                      className={`border rounded-2xl p-4 flex gap-4 shadow-sm transition-all ${
                        isUnlocked
                          ? 'bg-white border-indigo-100/80'
                          : 'bg-slate-50/50 border-slate-200/50 grayscale opacity-60'
                      }`}
                    >
                      <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center rounded-2xl text-lg font-black shrink-0 shadow-inner">
                        {isUnlocked ? comp.htmlFormula : '？'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-extrabold text-sm text-slate-800">
                            {isUnlocked ? comp.name : '未確認の化合物'}
                          </h5>
                          {isUnlocked && (
                            <span className="text-[9px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-1.5 rounded">
                              {formula}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {isUnlocked
                            ? comp.description
                            : 'この化合物はまだ発見されていません。クエストや自由調合でこの化合物を作るとアンロックされます。'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LAB TAB */}
        {/* ======================================================== */}
        {activeTab === 'lab' && (
          <div className="flex-grow flex flex-col md:flex-row md:overflow-hidden h-auto md:h-full">
            {/* 左：調合フィールド */}
            <div className="flex-grow md:w-2/3 p-4 lg:p-6 md:overflow-y-auto flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 gap-6">
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    自由調合（実験ラボ）
                  </h3>
                  <p className="text-xs text-slate-500">
                    パレットから自由に元素を選んでクラフト台に入れ、化学結合（合成）の反応を起こしてみよう！
                  </p>
                </div>

                {/* モバイル限定：すべての元素パレット (Lab用) */}
                <div className="md:hidden space-y-2">
                  <span className="text-xs font-black text-slate-500">元素パレット (タップでトレイに追加)</span>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(ELEMENTS).map(symbol => {
                      const info = ELEMENTS[symbol];
                      return (
                        <button
                          key={symbol}
                          onClick={() => handleAddToLabTray(symbol)}
                          className={`py-2.5 rounded-xl flex flex-col items-center justify-center border border-black/10 shadow-sm transition-all active:scale-95 cursor-pointer ${info.color}`}
                        >
                          <span className="text-xs font-black leading-none">{symbol}</span>
                          <span className="text-[8px] opacity-90 leading-none mt-0.5">{info.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* クラフト台 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-500">調合トレイ (最大6元素)</span>
                    <button
                      onClick={handleClearLab}
                      className="text-xs font-bold text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      クリア
                    </button>
                  </div>

                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 min-h-[110px] flex items-center gap-3 overflow-x-auto">
                    {labTray.length === 0 ? (
                      <p className="text-xs text-slate-400 font-medium text-center w-full">
                        元素パレットから原子をタップして入れよう！
                      </p>
                    ) : (
                      labTray.map((symbol, idx) => {
                        const info = ELEMENTS[symbol];
                        return (
                          <div
                            key={idx}
                            className={`w-12 h-14 rounded-xl border border-black/10 flex flex-col items-center justify-between py-1 shadow-sm shrink-0 ${info?.color || 'bg-slate-400'}`}
                          >
                            <span className="text-[9px] opacity-75 font-bold leading-none">
                              {info?.atomicNumber}
                            </span>
                            <span className="text-sm font-black tracking-tight leading-none">
                              {symbol}
                            </span>
                            <span className="text-[8px] opacity-90 leading-none truncate max-w-[40px]">
                              {info?.name}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* モバイル限定：レシピヒント */}
                <div className="md:hidden bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 shadow-xs">
                  <h5 className="text-[10px] font-black text-indigo-700 tracking-wider mb-1 flex items-center gap-1">
                    <Icon name="award" className="w-3.5 h-3.5 text-indigo-600" />
                    <span>中学生向けの代表的レシピ</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] text-slate-500 font-bold">
                    <div>• <strong className="font-extrabold text-slate-700">水(H₂O):</strong> H + H + O</div>
                    <div>• <strong className="font-extrabold text-slate-700">二酸化炭素(CO₂):</strong> C + O + O</div>
                    <div>• <strong className="font-extrabold text-slate-700">塩酸(HCl):</strong> H + Cl</div>
                    <div>• <strong className="font-extrabold text-slate-700">水酸化Na(NaOH):</strong> Na + O + H</div>
                    <div>• <strong className="font-extrabold text-slate-700">食塩(NaCl):</strong> Na + Cl</div>
                  </div>
                </div>

                {/* 実験結果フィードバック */}
                {labFeedback && (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 shadow-inner">
                    <div className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {labFeedback}
                    </div>
                  </div>
                )}
              </div>

              {/* 調合アクションボタン */}
              <button
                onClick={handleSynthesizeLab}
                disabled={labTray.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-550 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-40"
              >
                <Icon name="flask" className="w-4 h-4" />
                <span>化学結合（合成）を実行！</span>
              </button>
            </div>

            {/* 右：ラボ専用パレット */}
            <div className="hidden md:flex md:w-1/3 bg-slate-50 p-4 lg:p-6 flex-col justify-between border-t md:border-t-0 border-slate-150">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 tracking-wider">
                  使用可能なすべての元素
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.keys(ELEMENTS).map(symbol => {
                    const info = ELEMENTS[symbol];
                    return (
                      <button
                        key={symbol}
                        onClick={() => handleAddToLabTray(symbol)}
                        className={`py-3 rounded-xl flex flex-col items-center justify-center border border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${info.color}`}
                      >
                        <span className="text-sm font-black">{symbol}</span>
                        <span className="text-[9px] opacity-90">{info.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-slate-200/50 rounded-xl p-4 mt-6">
                <h5 className="text-[10px] font-black text-slate-400 tracking-wider mb-2">
                  中学生向けの代表的レシピ
                </h5>
                <ul className="text-[10px] text-slate-500 space-y-1.5 leading-relaxed">
                  <li>• <strong className="font-extrabold text-slate-700">水(H₂O):</strong> H + H + O</li>
                  <li>• <strong className="font-extrabold text-slate-700">二酸化炭素(CO₂):</strong> C + O + O</li>
                  <li>• <strong className="font-extrabold text-slate-700">塩酸(HCl):</strong> H + Cl</li>
                  <li>• <strong className="font-extrabold text-slate-700">水酸化ナトリウム(NaOH):</strong> Na + O + H</li>
                  <li>• <strong className="font-extrabold text-slate-700">食塩(NaCl):</strong> Na + Cl</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
