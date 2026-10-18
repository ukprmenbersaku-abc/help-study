import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from './Icon';
import { UserProgress } from '../types';
import { audio } from '../services/audioService';
import { AtomOrbitSVG, CompoundMoleculeSVG, AdvancedMonsterSVG, StageEnemyType } from './ScienceSVGs';

interface GameViewProps {
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

// ==========================================
// 中学校2年 理科（化学分野）元素の定義
// ==========================================
export interface ElementInfo {
  symbol: string;
  name: string;
  atomicNumber: number;
  category: string;
  color: string;
  description: string;
  mass: number;
  shells: number[];
  examTip: string;
}

export const ELEMENTS: { [key: string]: ElementInfo } = {
  H: {
    symbol: 'H',
    name: '水素',
    atomicNumber: 1,
    mass: 1.008,
    category: '気体・非金属',
    color: 'bg-sky-500 text-white',
    shells: [1],
    description: '宇宙で最も軽い気体。引火すると「ポン」と音を立てて爆発的に燃え、水（H₂O）になる。強力な還元剤として酸化物から酸素を奪い取る。',
    examTip: '【重要出題ポイント】水の電気分解では陰極（−極）に発生。マッチの火を近づけると音を立てて燃える。'
  },
  C: {
    symbol: 'C',
    name: '炭素',
    atomicNumber: 6,
    mass: 12.011,
    category: '固体・非金属',
    color: 'bg-zinc-700 text-white',
    shells: [2, 4],
    description: '木炭や黒鉛、ダイヤモンドの主成分。酸化銅と混ぜて加熱すると、酸素を奪い取って二酸化炭素（CO₂）になる（還元実験の超重要主役）。',
    examTip: '【重要出題ポイント】酸化銅の炭素による還元：2CuO + C → 2Cu + CO₂。二酸化炭素を発生して石灰水を白く濁らせる。'
  },
  N: {
    symbol: 'N',
    name: '窒素',
    atomicNumber: 7,
    mass: 14.007,
    category: '気体・非金属',
    color: 'bg-blue-600 text-white',
    shells: [2, 5],
    description: '空気の体積の約78%を占める無色・無臭の不活性な気体。他の物質と簡単には反応せず、食品の酸化防止用ガスとして使われる。',
    examTip: '【重要出題ポイント】空気中に最も多く含まれる気体（約78%）。水素と化合して刺激臭のあるアンモニア（NH₃）をつくる。'
  },
  O: {
    symbol: 'O',
    name: '酸素',
    atomicNumber: 8,
    mass: 15.999,
    category: '気体・非金属',
    color: 'bg-red-500 text-white',
    shells: [2, 6],
    description: '空気の約21%を占める気体。物を激しく燃やす「助燃性」を持ち、金属を酸化させてサビや酸化物をつくる。',
    examTip: '【重要出題ポイント】火のついた線香を入れると激しく炎を上げて燃え上がる。水の電気分解では陽極（＋極）に発生（水素の半分の体積）。'
  },
  Na: {
    symbol: 'Na',
    name: 'ナトリウム',
    atomicNumber: 11,
    mass: 22.990,
    category: 'アルカリ金属',
    color: 'bg-amber-600 text-white',
    shells: [2, 8, 1],
    description: 'ナイフで切れるほど柔らかい金属。炭酸水素ナトリウム（重曹）の構成元素であり、熱分解実験で炭酸ナトリウムに変化する。',
    examTip: '【重要出題ポイント】炭酸水素ナトリウム（NaHCO₃）を加熱すると、炭酸ナトリウム（Na₂CO₃）と水と二酸化炭素に分解する。'
  },
  Mg: {
    symbol: 'Mg',
    name: 'マグネシウム',
    atomicNumber: 12,
    mass: 24.305,
    category: '典型金属',
    color: 'bg-yellow-600 text-white',
    shells: [2, 8, 2],
    description: '軽くて丈夫な銀白色の金属。点火すると目も眩むような激しい白色の閃光を放って燃焼し、酸化マグネシウム（MgO）になる。',
    examTip: '【重要出題ポイント】2Mg + O₂ → 2MgO。マグネシウムと酸素が化合する質量比は常に【 3 : 2 】（定比例の法則）。'
  },
  S: {
    symbol: 'S',
    name: '硫黄',
    atomicNumber: 16,
    mass: 32.06,
    category: '固体・非金属',
    color: 'bg-yellow-500 text-slate-950 font-bold',
    shells: [2, 8, 6],
    description: '黄色の結晶。鉄粉と混ぜて加熱すると自ら激しい赤熱熱（発熱反応）を発しながら反応し、黒い硫化鉄（FeS）になる。',
    examTip: '【重要出題ポイント】鉄と硫黄の化合：Fe + S → FeS。反応後は磁石につかなくなり、塩酸を加えると腐卵臭の気体（硫化水素）が出る。'
  },
  Cl: {
    symbol: 'Cl',
    name: '塩素',
    atomicNumber: 17,
    mass: 35.45,
    category: 'ハロゲン気体',
    color: 'bg-lime-600 text-white',
    shells: [2, 8, 7],
    description: '黄緑色でプールのようなツンとした刺激臭がある気体。塩化銅水溶液の電気分解で陽極から発生し、赤インクを白く脱色（漂白）する。',
    examTip: '【重要出題ポイント】塩化銅の電気分解：陽極（＋極）から塩素が発生（赤インクを漂白）。陰極（−極）には赤褐色の銅が付着。'
  },
  Fe: {
    symbol: 'Fe',
    name: '鉄',
    atomicNumber: 26,
    mass: 55.845,
    category: '遷移金属',
    color: 'bg-slate-600 text-white',
    shells: [2, 8, 14, 2],
    description: '磁石にくっつき、電流をよく通す身近な金属。酸素と結合して赤サビ（Fe₂O₃）になり、硫黄と加熱すると硫化鉄（FeS）になる。',
    examTip: '【重要出題ポイント】鉄単体は磁石にくっつくが、硫黄と化合した硫化鉄（FeS）は磁石にくっつかない。'
  },
  Cu: {
    symbol: 'Cu',
    name: '銅',
    atomicNumber: 29,
    mass: 63.546,
    category: '遷移金属',
    color: 'bg-orange-700 text-white',
    shells: [2, 8, 18, 1],
    description: '赤褐色の金属光沢を持ち、電気や熱を極めてよく通す。空気中で加熱すると酸素と化合して黒色の酸化銅（CuO）になる。',
    examTip: '【重要出題ポイント】2Cu + O₂ → 2CuO。銅と酸素が化合する質量比は常に【 4 : 1 】（銅4gに対して酸素1gが結合して酸化銅5g）。'
  },
  Ag: {
    symbol: 'Ag',
    name: '銀',
    atomicNumber: 47,
    mass: 107.87,
    category: '貴金属',
    color: 'bg-slate-400 text-slate-950 font-bold',
    shells: [2, 8, 18, 18, 1],
    description: '金属の中で最も電気や熱を通しやすい美しい金属。酸化銀（Ag₂O）を加熱すると熱分解し、銀色の純銀（Ag）と酸素になる。',
    examTip: '【重要出題ポイント】酸化銀の熱分解：2Ag₂O → 4Ag + O₂。試験管に残った灰白色の粉末を薬さじの裏でこすると金属光沢が出る。'
  },
};

// ==========================================
// 中学校2年 理科（化学分野）化合物の定義
// ==========================================
export interface CompoundInfo {
  formula: string;
  htmlFormula: string;
  name: string;
  elements: { [element: string]: number };
  description: string;
  effect: string;
  reactionType: 'oxidation' | 'reduction' | 'decomposition' | 'sulfuration' | 'definite_ratio';
  equation: string;
}

export const COMPOUNDS: { [formula: string]: CompoundInfo } = {
  H2: {
    formula: 'H2',
    htmlFormula: 'H₂',
    name: '水素分子',
    elements: { H: 2 },
    description: '水素原子が2つくっついた分子。気体の中で最も軽く、可燃性と還元性を持つ。水の電気分解の陰極（−極）から2の体積比で発生する。',
    effect: '【陰極電解ガス / 還元爆発】酸素を強奪する還元作用、または爆鳴気引火！',
    reactionType: 'reduction',
    equation: 'CuO + H₂ → Cu + H₂O （水素による酸化銅の還元）'
  },
  O2: {
    formula: 'O2',
    htmlFormula: 'O₂',
    name: '酸素分子',
    elements: { O: 2 },
    description: '物を燃やす助燃性気体。水の電気分解の陽極（＋極）から1の体積比で発生する。金属と化合して酸化物を生成する。',
    effect: '【陽極電解ガス / 助燃加速】化学反応を爆発的に加速させ、相手を強制酸化！',
    reactionType: 'oxidation',
    equation: '2Cu + O₂ → 2CuO （銅の酸化反応）'
  },
  H2O: {
    formula: 'H2O',
    htmlFormula: 'H₂O',
    name: '水分子',
    elements: { H: 2, O: 1 },
    description: '水素2原子と酸素1原子からなる分子。電気分解によって水素（陰極）と酸素（陽極）に体積比 2 : 1 で分解できる。',
    effect: '【電気分解コア】通電によって高エネルギーのH₂とO₂を生み出す起点！',
    reactionType: 'decomposition',
    equation: '2H₂O → 2H₂ + O₂ （水の電気分解・体積比2:1）'
  },
  CO2: {
    formula: 'CO2',
    htmlFormula: 'CO₂',
    name: '二酸化炭素',
    elements: { C: 1, O: 2 },
    description: '炭素の燃焼や、炭酸水素ナトリウムの熱分解、酸化銅の炭素還元で発生する。空気より重く不燃性のため、炎にかぶせると酸素を遮断して窒息消火する。',
    effect: '【窒息消火 / 石灰水白濁】炎モンスターの酸素供給を完全に絶って鎮火！',
    reactionType: 'oxidation',
    equation: '2CuO + C → 2Cu + CO₂ （炭素による還元で生成）'
  },
  Cl2: {
    formula: 'Cl2',
    htmlFormula: 'Cl₂',
    name: '塩素分子',
    elements: { Cl: 2 },
    description: '黄緑色で強い刺激臭を持つ有毒気体。塩化銅水溶液の電気分解で陽極（＋極）から発生し、強力な漂白・殺菌作用を持つ。',
    effect: '【陽極電解気体 / 強力漂白】相手の電磁装甲や保護被膜を強力に漂白腐食！',
    reactionType: 'decomposition',
    equation: 'CuCl₂ → Cu + Cl₂ （塩化銅の電気分解）'
  },
  N2: {
    formula: 'N2',
    htmlFormula: 'N₂',
    name: '窒素分子',
    elements: { N: 2 },
    description: '空気の約78%を占める非常に安定した気体。三重結合を持ち、他の物質とほとんど反応しないため、不活性シールドとして働く。',
    effect: '【不活性シールド】急激な熱暴走反応を安全に冷却遮断する！',
    reactionType: 'oxidation',
    equation: '空気の主成分（約78%）'
  },
  NH3: {
    formula: 'NH3',
    htmlFormula: 'NH₃',
    name: 'アンモニア',
    elements: { N: 1, H: 3 },
    description: 'ツンとする強い刺激臭のある気体。水に非常に溶けやすく、水溶液はアルカリ性を示してフェノールフタレイン溶液を赤色に変える。',
    effect: '【刺激臭噴射】敵の感覚器官を撹乱し、行動を封じる！',
    reactionType: 'decomposition',
    equation: 'N₂ + 3H₂ ⇄ 2NH₃'
  },
  CuO: {
    formula: 'CuO',
    htmlFormula: 'CuO',
    name: '酸化銅',
    elements: { Cu: 1, O: 1 },
    description: '銅を空気中で加熱するとできる黒色の物質。銅と酸素の質量比は厳密に【 4 : 1 】。炭素や水素と加熱すると酸素を奪われて赤褐色の銅に還元される。',
    effect: '【定比例の証 (4:1) / 還元標的】黒色被膜。炭素をぶつけると赤褐色の銅が析出！',
    reactionType: 'definite_ratio',
    equation: '2Cu + O₂ → 2CuO （質量比 Cu : O = 4 : 1）'
  },
  MgO: {
    formula: 'MgO',
    htmlFormula: 'MgO',
    name: '酸化マグネシウム',
    elements: { Mg: 1, O: 1 },
    description: 'マグネシウムが目も眩む白い閃光を放って燃焼した後にできる白い粉末。マグネシウムと酸素の質量比は常に【 3 : 2 】。',
    effect: '【定比例の証 (3:2) / 閃光破砕】白色閃光の化合エネルギーで重装甲を粉砕！',
    reactionType: 'definite_ratio',
    equation: '2Mg + O₂ → 2MgO （質量比 Mg : O = 3 : 2）'
  },
  FeS: {
    formula: 'FeS',
    htmlFormula: 'FeS',
    name: '硫化鉄',
    elements: { Fe: 1, S: 1 },
    description: '鉄粉と硫黄の混合物を加熱して化合させた黒色の物質。自らの激しい発熱反応で進行する。化合後は磁石につかなくなる。',
    effect: '【激化合発熱 / 磁力消失】激しい反応熱を敵コアに逆流させ、磁気装甲を無効化！',
    reactionType: 'sulfuration',
    equation: 'Fe + S → FeS （発熱反応・磁石につかなくなる）'
  },
  CuS: {
    formula: 'CuS',
    htmlFormula: 'CuS',
    name: '硫化銅',
    elements: { Cu: 1, S: 1 },
    description: '銅と硫黄を化合させてできる黒色の物質。化合によって金属銅の光沢が失われ、硫黄原子と結合して安定化する。',
    effect: '【硫化結合】重金属結合を形成し、相手の熱エネルギーを封じ込める！',
    reactionType: 'sulfuration',
    equation: 'Cu + S → CuS （銅と硫黄の化合）'
  },
  Ag2O: {
    formula: 'Ag2O',
    htmlFormula: 'Ag₂O',
    name: '酸化銀',
    elements: { Ag: 2, O: 1 },
    description: '暗褐色の粉末。試験管に入れて加熱すると熱分解し、銀白色に輝く純銀（Ag）と、火のついた線香を激しく燃やす酸素（O₂）に分かれる。',
    effect: '【熱分解パズル / 金属光沢析出】熱分解させて酸素を放出、純銀の熱伝導で冷却！',
    reactionType: 'decomposition',
    equation: '2Ag₂O → 4Ag + O₂ （酸化銀の加熱分解）'
  },
  CuCl2: {
    formula: 'CuCl2',
    htmlFormula: 'CuCl₂',
    name: '塩化銅',
    elements: { Cu: 1, Cl: 2 },
    description: '青緑色の化合物。水溶液に電流を流すと、陰極（−極）に赤褐色の銅が付着し、陽極（＋極）から刺激臭と漂白作用を持つ塩素が発生する。',
    effect: '【電気分解の起点】陰極に純銅、陽極に塩素ガスを発生させる重要試薬！',
    reactionType: 'decomposition',
    equation: 'CuCl₂ → Cu + Cl₂ （塩化銅の電気分解）'
  },
  NaHCO3: {
    formula: 'NaHCO3',
    htmlFormula: 'NaHCO₃',
    name: '炭酸水素ナトリウム',
    elements: { Na: 1, H: 1, C: 1, O: 3 },
    description: '重曹。試験管に入れて加熱すると熱分解し、炭酸ナトリウム（固体）、水（液体・塩化コバルト紙を青→赤）、二酸化炭素（気体・石灰水白濁）に分かれる。',
    effect: '【三段熱分解】熱分解で大量の二酸化炭素を一気に放出し、火焔を窒息鎮火！',
    reactionType: 'decomposition',
    equation: '2NaHCO₃ → Na₂CO₃ + H₂O + CO₂ （炭酸水素ナトリウムの加熱分解）'
  },
  Fe2O3: {
    formula: 'Fe2O3',
    htmlFormula: 'Fe₂O₃',
    name: '酸化鉄（赤サビ）',
    elements: { Fe: 2, O: 3 },
    description: '鉄が酸素と化合してできる赤褐色のサビ。木炭（炭素）や水素と一緒に加熱すると、酸素が奪われて元の鉄（Fe）に還元される。',
    effect: '【サビ被膜（標的）】炭素や水素による還元反応で酸素を脱離させる！',
    reactionType: 'reduction',
    equation: '2Fe₂O₃ + 3C → 4Fe + 3CO₂ （酸化鉄の還元）'
  },
};

// ==========================================
// 中学校2年 理科（化学）全6ステージ（高難度仕様）
// ==========================================
interface Stage {
  id: number;
  name: string;
  description: string;
  enemyName: string;
  enemyType: StageEnemyType;
  enemyHealth: number;
  enemyMaxHealth: number;
  enemyIntro: string;
  weaknessFormula: string[];
  providedElements: string[];
  unlockedCompoundReward: string;
  xpReward: number;
  examQuestionPrompt: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    name: 'ステージ1：熱分解ボルケーノの猛炎',
    description: '高熱ガスを吹き出す灼熱龍が現れた！水蒸気爆発を防ぎ、空気より重い不燃性気体で酸素を遮断して窒息消火せよ！',
    enemyName: '灼熱龍パイロ・ドレイク',
    enemyType: 'pyro',
    enemyHealth: 220,
    enemyMaxHealth: 220,
    enemyIntro: '「燃え盛る業火を見よ！水をかければ水蒸気爆発で返り討ちだ！」炭酸水素ナトリウムの熱分解や炭素の燃焼で生成する、酸素を遮断するあの気体（CO₂）で窒息消火せよ！',
    weaknessFormula: ['CO2'],
    providedElements: ['C', 'O', 'H', 'Na'],
    unlockedCompoundReward: 'CO2',
    xpReward: 100,
    examQuestionPrompt: '【出題】炭酸水素ナトリウム（NaHCO₃）を加熱分解したときに発生し、石灰水を白く濁らせる気体は？ ➔ 二酸化炭素（CO₂）'
  },
  {
    id: 2,
    name: 'ステージ2：電解の雷神ガルバニクス',
    description: '高圧電磁フィールドを纏う雷獣。水を電気分解して陰極（H₂）と陽極（O₂）を体積比 2 : 1 で発生させ、爆鳴気引火で電磁バリアをショートさせよ！',
    enemyName: '電解雷獣ガルバニクス',
    enemyType: 'electro',
    enemyHealth: 320,
    enemyMaxHealth: 320,
    enemyIntro: '「我が電磁バリアは突破できぬ！」水の電気分解ボタンを押し、陰極（水素 H₂: 2体積）と陽極（酸素 O₂: 1体積）を生成！また塩化銅（CuCl₂）から発生する漂白ガス（Cl₂）も有効！',
    weaknessFormula: ['H2', 'O2', 'Cl2'],
    providedElements: ['H', 'O', 'Cu', 'Cl'],
    unlockedCompoundReward: 'H2',
    xpReward: 140,
    examQuestionPrompt: '【出題】水（H₂O）の電気分解で、陰極と陽極に発生する気体の種類と体積比は？ ➔ 陰極:水素、陽極:酸素、体積比 2 : 1'
  },
  {
    id: 3,
    name: 'ステージ3：激化合の黒鋼オキシ・ゴーレム',
    description: '超硬度の金属装甲。マグネシウムと酸素を化合させ、目も眩む激しい白光閃光（2Mg + O₂ → 2MgO）で装甲を焼き砕け！',
    enemyName: '黒鋼剛鬼オキシ・ゴーレム',
    enemyType: 'oxidation',
    enemyHealth: 440,
    enemyMaxHealth: 440,
    enemyIntro: '「刃も弾丸も通さぬ硬度！」マグネシウム（Mg）を激しく燃焼させて閃光酸化（MgO）を起こすか、銅（Cu）を酸化させて黒色酸化銅（CuO）に変質させよ！',
    weaknessFormula: ['MgO', 'CuO'],
    providedElements: ['Mg', 'Cu', 'O', 'C'],
    unlockedCompoundReward: 'MgO',
    xpReward: 180,
    examQuestionPrompt: '【出題】マグネシウムを空気中で加熱すると激しい白い光を出して燃焼し、何という白い物質になる？ ➔ 酸化マグネシウム（MgO）'
  },
  {
    id: 4,
    name: 'ステージ4：還元の暗黒神官レダクト・ロード',
    description: '酸化銅（CuO）と赤サビ（Fe₂O₃）の二重被膜で全身を覆い、酸素を奪い取る「還元反応」以外すべての攻撃を無効化する暗黒神官！',
    enemyName: '酸化冥王レダクト・ロード',
    enemyType: 'reduction',
    enemyHealth: 540,
    enemyMaxHealth: 540,
    enemyIntro: '「ククク…我が酸化被膜はあらゆる衝撃を吸収する！」炭素（C）をぶつけて二酸化炭素（CO₂）として酸素を奪うか、水素（H₂）による還元で純銅を析出させて被膜を崩壊させよ！',
    weaknessFormula: ['CO2', 'H2'],
    providedElements: ['C', 'H', 'Cu', 'Fe', 'O'],
    unlockedCompoundReward: 'CuO',
    xpReward: 220,
    examQuestionPrompt: '【出題】黒色の酸化銅と木炭の粉末を混ぜて加熱すると、試験管内に赤褐色の銅と何という気体が発生する？ ➔ 二酸化炭素（CO₂）'
  },
  {
    id: 5,
    name: 'ステージ5：暴走の硫化魔獣パイライト・キマイラ',
    description: '鉄と硫黄が混ざり合った激しい発熱魔獣！鉄と硫黄を化合させて硫化鉄（FeS）を合成し、磁性を喪失させて磁力コアを停止させよ！',
    enemyName: '暴走硫化獣パイライト・キマイラ',
    enemyType: 'sulfide',
    enemyHealth: 640,
    enemyMaxHealth: 640,
    enemyIntro: '「熱い！熱が止まらん！」一度火がつくと自らの反応熱で赤熱し続ける鉄と硫黄の化合（Fe + S → FeS）！磁石につかなくなる性質変化を利用して磁場バリアを消滅させろ！',
    weaknessFormula: ['FeS', 'CuS'],
    providedElements: ['Fe', 'S', 'Cu', 'O'],
    unlockedCompoundReward: 'FeS',
    xpReward: 260,
    examQuestionPrompt: '【出題】鉄と硫黄を化合させると何という物質になる？また反応後は磁石につくか？ ➔ 硫化鉄（FeS）、磁石につかなくなる'
  },
  {
    id: 6,
    name: 'ステージ6：【超難関】定比例の絶対化学神ケミカル・カイザー',
    description: '中2化学の最高峰！銅と酸素（4:1）、マグネシウムと酸素（3:2）の定比例バリアを展開し、3段階のフェーズ移行で全単元の知識を試す究極の化学神！',
    enemyName: '絶対化学神ケミカル・カイザー',
    enemyType: 'kaiser',
    enemyHealth: 800,
    enemyMaxHealth: 800,
    enemyIntro: '「定比例の法則、熱分解、電気分解、還元、硫化…中2理科の全真理を制覇した者のみが我を倒せる！」第1フェーズはCu:O(4:1)のCuO、第2フェーズはMg:O(3:2)のMgO、最終フェーズは即応クラフトラッシュ！',
    weaknessFormula: ['CuO', 'MgO', 'FeS', 'CO2', 'H2'],
    providedElements: ['Cu', 'Mg', 'O', 'Fe', 'S', 'C', 'H', 'Ag'],
    unlockedCompoundReward: 'Ag2O',
    xpReward: 350,
    examQuestionPrompt: '【出題】銅と酸素が化合する質量比は【 4 : 1 】、マグネシウムと酸素が化合する質量比は【 3 : 2 】（定比例の法則）'
  }
];

export default function GameView({ userProgress, setUserProgress }: GameViewProps) {
  const [activeTab, setActiveTab] = useState<'quest' | 'encyclopedia' | 'lab'>('quest');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // --- クエスト（バトル）関連の状態 ---
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageState, setStageState] = useState<'intro' | 'battle' | 'victory' | 'defeat'>('intro');
  const [enemyHealth, setEnemyHealth] = useState(220);
  const [bossPhase, setBossPhase] = useState<number>(1);
  const [playerHearts, setPlayerHearts] = useState(3);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [tray, setTray] = useState<string[]>([]);
  const [isElectrolyzing, setIsElectrolyzing] = useState(false);

  // --- 軽量・高速アニメーション & VFX状態 ---
  const [isAttacking, setIsAttacking] = useState(false);
  const [isMonsterHit, setIsMonsterHit] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<{ text: string; isCrit: boolean } | null>(null);
  const [reactionVFX, setReactionVFX] = useState<{ title: string; equation: string; color: string } | null>(null);

  // --- 入力ボーナス（同調連打）---
  const [bonusTarget, setBonusTarget] = useState<string | null>(null);
  const [bonusClicks, setBonusClicks] = useState(0);
  const [bonusRequired, setBonusRequired] = useState(7);
  const [bonusTimer, setBonusTimer] = useState(0);
  const [bonusActive, setBonusActive] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1.0);

  // --- 事典 & 原子インスペクター ---
  const [inspectingElement, setInspectingElement] = useState<string | null>(null);
  const [discoveredCompounds, setDiscoveredCompounds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('discovered_compounds_v2');
      return saved ? JSON.parse(saved) : ['H2O', 'O2', 'H2'];
    } catch {
      return ['H2O', 'O2', 'H2'];
    }
  });

  // --- ラボ（自由調合）---
  const [labTray, setLabTray] = useState<string[]>([]);
  const [labFeedback, setLabFeedback] = useState<string>('');
  const [labReactionType, setLabReactionType] = useState<'neutral' | 'oxidation' | 'reduction' | 'sulfuration'>('neutral');

  const currentStage = STAGES[currentStageIndex];

  // 音声ミュートトグル連動
  useEffect(() => {
    audio.enabled = soundEnabled;
  }, [soundEnabled]);

  const saveDiscovered = useCallback((list: string[]) => {
    setDiscoveredCompounds(list);
    try {
      localStorage.setItem('discovered_compounds_v2', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const addLog = useCallback((msg: string) => {
    setBattleLog(prev => [msg, ...prev].slice(0, 25));
  }, []);

  const giveXP = useCallback((amount: number, showLog = true) => {
    setUserProgress(prev => {
      const newXp = prev.xp + amount;
      const xpNeeded = prev.level * 100;
      if (newXp >= xpNeeded) {
        const nextLevel = prev.level + 1;
        if (showLog) {
          addLog(`[レベルアップ] 学術ランク上昇: Lv.${prev.level} ➔ Lv.${nextLevel}！`);
        }
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
  }, [addLog, setUserProgress]);

  // 化学合成判定（メモ化で超軽量化）
  const synthesizeCompound = useCallback((elementsList: string[]): CompoundInfo | null => {
    if (elementsList.length === 0) return null;
    const counts: { [key: string]: number } = {};
    elementsList.forEach(e => {
      counts[e] = (counts[e] || 0) + 1;
    });

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
  }, []);

  // トレイ上の化合物をメモ化（再レンダリングごとの再計算を防止）
  const activeTrayCompound = useMemo(() => synthesizeCompound(tray), [tray, synthesizeCompound]);
  const activeLabCompound = useMemo(() => synthesizeCompound(labTray), [labTray, synthesizeCompound]);

  const startStage = useCallback((index: number) => {
    setCurrentStageIndex(index);
    const selectedStage = STAGES[index];
    setEnemyHealth(selectedStage.enemyHealth);
    setBossPhase(1);
    setPlayerHearts(3);
    setStageState('intro');
    setBattleLog([`${selectedStage.enemyName} が現れた！`]);
    setTray([]);
    setBonusActive(false);
    setComboMultiplier(1.0);
    setIsAttacking(false);
    setIsMonsterHit(false);
    setFloatingDamage(null);
    setReactionVFX(null);
  }, []);

  const handleStartBattle = () => {
    setStageState('battle');
    addLog(`【作戦開始】手持ちの元素を組み合わせて、中2化学の特性に合わせた化合物をクラフトせよ！`);
    audio.playAtomPop(600);
  };

  const handleAddToTray = (symbol: string) => {
    if (tray.length >= 6) {
      addLog('[警告] 反応トレイ容量オーバー（最大6原子まで配置可能）');
      audio.playSynthesisFailure();
      return;
    }
    audio.playAtomPop(480 + tray.length * 35);
    setTray(prev => [...prev, symbol]);

    if (Math.random() < 0.25 && !bonusActive) {
      triggerBonusInput(symbol);
    }
  };

  const handleClearTray = () => {
    setTray([]);
    audio.playAtomPop(320);
  };

  const handleRemoveFromTray = (index: number) => {
    setTray(prev => prev.filter((_, i) => i !== index));
    audio.playAtomPop(380);
  };

  const triggerBonusInput = (symbol: string) => {
    setBonusTarget(symbol);
    setBonusClicks(0);
    setBonusRequired(Math.floor(Math.random() * 3) + 6);
    setBonusTimer(3.5);
    setBonusActive(true);
  };

  const handleBonusClick = () => {
    if (!bonusActive) return;
    audio.playAtomPop(600 + bonusClicks * 30);
    setBonusClicks(prev => {
      const next = prev + 1;
      if (next >= bonusRequired) {
        setTimeout(() => {
          setBonusActive(false);
          setComboMultiplier(2.0);
          audio.playSynthesisSuccess();
          addLog(`[同調成功] 元素記号「${bonusTarget}」の電子同調を確認！攻撃エネルギー200%！`);
          giveXP(5, false);
        }, 0);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!bonusActive) return;
    const interval = setInterval(() => {
      setBonusTimer(prev => {
        if (prev <= 0.1) {
          clearInterval(interval);
          setTimeout(() => {
            setBonusActive(false);
            setComboMultiplier(0.85);
            addLog(`[時間切れ] 元素記号の同調シグナルが減衰しました。`);
          }, 0);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [bonusActive, addLog]);

  // 水の電気分解アクション (H2O -> 2H2 + O2)
  const handleElectrolysis = () => {
    const hCount = tray.filter(x => x === 'H').length;
    const oCount = tray.filter(x => x === 'O').length;

    if (hCount >= 2 && oCount >= 1) {
      setIsElectrolyzing(true);
      audio.playElectrolysisZap();

      setTimeout(() => {
        setIsElectrolyzing(false);
        // 陰極に水素H2、陽極に酸素O2が体積比2:1で発生
        setTray(['H', 'H', 'O', 'O']);
        addLog('⚡【水の電気分解成功！】陰極に水素(H₂)・陽極に酸素(O₂)が発生（体積比 2 : 1）！');
        audio.playSynthesisSuccess();
        giveXP(10);
      }, 1200);
    } else {
      addLog('❌【エラー】電気分解を行うにはトレイに水分子（H₂O: 水素2、酸素1）が必要です。');
      audio.playSynthesisFailure();
    }
  };

  // 攻撃実行（中2理科の各ステージギミック判定）
  const handleAttack = () => {
    if (tray.length === 0) {
      addLog('[注意] 反応トレイに元素が配置されていません。');
      return;
    }

    const compound = activeTrayCompound;

    if (!compound) {
      audio.playSynthesisFailure();
      const elementsJoined = tray.join('');
      addLog(`❌【結合不成立】「${elementsJoined}」は中2化学で安定な化合物として存在しません！結合崩壊！`);
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
    audio.playSynthesisSuccess();
    addLog(`✨【合成成功】化合物「${compound.name}」（${compound.formula}）が完成！`);

    if (!discoveredCompounds.includes(compound.formula)) {
      const newList = [...discoveredCompounds, compound.formula];
      saveDiscovered(newList);
      addLog(`📖【図鑑登録】新規化合物「${compound.name}」が元素事典に記録されました！`);
      giveXP(15);
    }

    let baseDamage = 35;
    let isWeakness = false;
    const stage = STAGES[currentStageIndex];

    // ==========================================
    // ステージ毎の中2理科ギミック判定
    // ==========================================
    if (stage.id === 1) {
      // Stage 1: 灼熱龍パイロ・ドレイク (熱分解・二酸化炭素窒息消火)
      if (compound.formula === 'CO2') {
        baseDamage = 115;
        isWeakness = true;
        setReactionVFX({
          title: '🔥 窒息消火反応！',
          equation: 'CO₂が空気より重く酸素を完全遮断 ➔ 猛炎を鎮火！',
          color: 'bg-indigo-600 text-white'
        });
        addLog(`[特効] 二酸化炭素（CO₂）による窒息消火！酸素供給が絶たれ大ダメージ！`);
      } else if (compound.formula === 'H2O') {
        baseDamage = 50;
        setReactionVFX({
          title: '💧 冷却蒸発！',
          equation: '水の比熱による吸熱冷却！',
          color: 'bg-sky-600 text-white'
        });
        addLog(`[有効] 水分子（H₂O）による吸熱・冷却を実行。`);
      } else if (compound.formula === 'H2') {
        baseDamage = 130;
        setReactionVFX({
          title: '💥 爆鳴気大爆発！',
          equation: '2H₂ + O₂ → 2H₂O + 熱エネルギー',
          color: 'bg-rose-600 text-white'
        });
        addLog(`[激突] 水素ガス（H₂）が火炎に引火して爆発！自爆の反動でプレイヤーもダメージ！`);
        setPlayerHearts(prev => Math.max(1, prev - 1));
      } else {
        baseDamage = 20;
        addLog(`[非効率] 炎の熱量を打ち消すには結合特性が不足しています。`);
      }
    } else if (stage.id === 2) {
      // Stage 2: 電解雷獣ガルバニクス (水の電気分解 2:1 & 塩化銅電解)
      if (compound.formula === 'H2' || compound.formula === 'O2') {
        baseDamage = 100;
        isWeakness = true;
        setReactionVFX({
          title: '⚡ 電解ガス過負荷！',
          equation: '2H₂O → 2H₂ + O₂ (体積比 2 : 1) の爆鳴気放電！',
          color: 'bg-sky-600 text-white'
        });
        addLog(`[特効] 電気分解で得た高エネルギーガス（${compound.formula}）が電磁装甲をショート！`);
      } else if (compound.formula === 'Cl2') {
        baseDamage = 110;
        isWeakness = true;
        setReactionVFX({
          title: '🧪 塩素ガス漂白腐食！',
          equation: 'CuCl₂ → Cu + Cl₂ (陽極発生の黄緑色刺激臭ガス)',
          color: 'bg-lime-600 text-white'
        });
        addLog(`[特効] 陽極から生じた塩素分子（Cl₂）の強力な酸化漂白力で装甲を溶解！`);
      } else {
        baseDamage = 25;
        addLog(`[防御] ガルバニクスの高圧電磁フィールドにより威力が減衰されました。`);
      }
    } else if (stage.id === 3) {
      // Stage 3: 黒鋼剛鬼オキシ・ゴーレム (マグネシウム激燃焼 & 銅の酸化)
      if (compound.formula === 'MgO') {
        baseDamage = 135;
        isWeakness = true;
        setReactionVFX({
          title: '✨ マグネシウム白色閃光！',
          equation: '2Mg + O₂ → 2MgO (目も眩む超高熱白色燃焼！)',
          color: 'bg-amber-500 text-slate-950 font-black'
        });
        addLog(`[超特効] マグネシウムの激しい白色閃光燃焼！剛鬼の黒鋼装甲を焼き砕いた！`);
      } else if (compound.formula === 'CuO') {
        baseDamage = 90;
        isWeakness = true;
        setReactionVFX({
          title: '🖤 銅の高温酸化！',
          equation: '2Cu + O₂ → 2CuO (黒色酸化銅の生成)',
          color: 'bg-zinc-800 text-white'
        });
        addLog(`[特効] 銅を強制酸化させて黒色酸化銅（CuO）を形成！装甲を脆化！`);
      } else {
        baseDamage = 20;
        addLog(`[装甲硬度] 剛鬼の装甲に阻まれ、十分な打撃を与えられません。`);
      }
    } else if (stage.id === 4) {
      // Stage 4: 酸化冥王レダクト・ロード (還元反応パズル: CuO + C -> Cu + CO2)
      if (compound.formula === 'CO2') {
        baseDamage = 145;
        isWeakness = true;
        setReactionVFX({
          title: '🔥 炭素還元反応成功！',
          equation: '2CuO + C → 2Cu + CO₂ (酸素を強奪して純銅析出！)',
          color: 'bg-amber-600 text-white'
        });
        addLog(`[超特効] 炭素が酸化銅から酸素を奪い二酸化炭素（CO₂）に変化！赤褐色の銅が析出！`);
      } else if (compound.formula === 'H2') {
        baseDamage = 120;
        isWeakness = true;
        setReactionVFX({
          title: '✨ 水素還元反応！',
          equation: 'CuO + H₂ → Cu + H₂O (酸化銅から酸素を脱離！)',
          color: 'bg-sky-500 text-white'
        });
        addLog(`[特効] 水素（H₂）が酸化銅の酸素を脱離させ、水と金属銅へ還元！`);
      } else {
        baseDamage = 5;
        addLog(`[無効] 冥王の酸化被膜により、還元剤（CやH₂）以外の攻撃はほぼ無効化されました（ダメージ5）。`);
      }
    } else if (stage.id === 5) {
      // Stage 5: 暴走硫化獣パイライト・キマイラ (Fe + S -> FeS)
      if (compound.formula === 'FeS') {
        baseDamage = 160;
        isWeakness = true;
        setReactionVFX({
          title: '🌋 激化合発熱反応！',
          equation: 'Fe + S → FeS (自らの反応熱で赤熱・磁性消失！)',
          color: 'bg-orange-600 text-white'
        });
        addLog(`[超特効] 鉄と硫黄の激しい化合（FeS）！磁石につかなくなる変質で磁力バリアが完全崩壊！`);
      } else if (compound.formula === 'CuS') {
        baseDamage = 110;
        isWeakness = true;
        setReactionVFX({
          title: '🖤 硫化銅化合！',
          equation: 'Cu + S → CuS (金属銅の硫化反応)',
          color: 'bg-yellow-700 text-white'
        });
        addLog(`[特効] 銅と硫黄の化合（CuS）により、キマイラの熱暴走エネルギーを拘束！`);
      } else {
        baseDamage = 25;
        addLog(`[非効率] キマイラの硫黄結晶装甲に弾かれました。`);
      }
    } else if (stage.id === 6) {
      // Stage 6: 【超難関】定比例の絶対化学神ケミカル・カイザー
      const currentPhase = bossPhase;

      if (currentPhase === 1) {
        // Phase 1: 銅と酸素の定比例 (4 : 1) -> CuO
        if (compound.formula === 'CuO') {
          baseDamage = 150;
          isWeakness = true;
          setReactionVFX({
            title: '⚖️ 定比例の法則突破！',
            equation: '銅 : 酸素 = 4 : 1 (2Cu + O₂ → 2CuO)',
            color: 'bg-indigo-600 text-white'
          });
          addLog(`[定比例クリア] 銅と酸素の質量比【 4 : 1 】を精密合致！第1バリア粉砕！`);
        } else {
          baseDamage = 10;
          addLog(`[質量不整合] カイザー「愚か者め！銅と酸素の化合比率を守らぬ攻撃など通じぬ！（CuOを調合せよ）」`);
        }
      } else if (currentPhase === 2) {
        // Phase 2: マグネシウムと酸素の定比例 (3 : 2) -> MgO
        if (compound.formula === 'MgO') {
          baseDamage = 160;
          isWeakness = true;
          setReactionVFX({
            title: '⚖️ 定比例の法則突破！',
            equation: 'マグネシウム : 酸素 = 3 : 2 (2Mg + O₂ → 2MgO)',
            color: 'bg-amber-500 text-slate-950 font-black'
          });
          addLog(`[定比例クリア] マグネシウムと酸素の質量比【 3 : 2 】を完全一致！第2バリア粉砕！`);
        } else {
          baseDamage = 10;
          addLog(`[質量不整合] カイザー「マグネシウムと酸素の質量比は何対何だ！？（MgOを調合せよ）」`);
        }
      } else {
        // Phase 3: 全単元総力戦 (FeS, CO2, H2, Ag2O)
        if (['FeS', 'CO2', 'H2', 'Ag2O'].includes(compound.formula)) {
          baseDamage = 180;
          isWeakness = true;
          setReactionVFX({
            title: '🌟 中2化学マスターアタック！',
            equation: `${compound.name} (${compound.formula}) による究極の化学結合！`,
            color: 'bg-emerald-600 text-white'
          });
          addLog(`[究極特効] 中2化学の真理の一撃「${compound.name}」がカイザーの神核を貫く！`);
        } else {
          baseDamage = 40;
        }
      }
    }

    if (isWeakness) {
      giveXP(5, false);
    }

    const finalDamage = Math.floor(baseDamage * comboMultiplier);

    // 発射アニメーション
    setIsAttacking(true);

    setTimeout(() => {
      setIsAttacking(false);
      setIsMonsterHit(true);
      audio.playAttackImpact(isWeakness);

      setFloatingDamage({
        text: `-${finalDamage}${isWeakness ? ' CRITICAL!' : ''}`,
        isCrit: isWeakness
      });

      setEnemyHealth(prev => {
        const next = prev - finalDamage;

        // ボスフェーズ移行判定（Stage 6）
        if (stage.id === 6) {
          if (next <= 520 && next > 240 && bossPhase === 1) {
            setBossPhase(2);
            addLog('⚡【警告】カイザーの形態変化！第2フェーズ「Mg:O = 3:2 の定比例バリア」へ移行！');
            audio.playElectrolysisZap();
          } else if (next <= 240 && next > 0 && bossPhase === 2) {
            setBossPhase(3);
            addLog('💥【超警告】カイザー激怒！最終フェーズ「中2化学全単元オーバーロード」へ突入！');
            audio.playElectrolysisZap();
          }
        }

        if (next <= 0) {
          setTimeout(() => {
            setStageState('victory');
            audio.playVictoryFanfare();
            giveXP(stage.xpReward);
            if (!discoveredCompounds.includes(stage.unlockedCompoundReward)) {
              const newList = [...discoveredCompounds, stage.unlockedCompoundReward];
              saveDiscovered(newList);
            }
          }, 600);
        } else {
          enemyCounterAttack(next);
        }
        return Math.max(0, next);
      });

      setTimeout(() => setIsMonsterHit(false), 400);
      setTimeout(() => setFloatingDamage(null), 1000);
    }, 450);

    setTray([]);
    setComboMultiplier(1.0);
  };

  const enemyCounterAttack = (currentEnemyHealth: number) => {
    setTimeout(() => {
      if (stageState !== 'battle' && currentEnemyHealth <= 0) return;
      const stage = STAGES[currentStageIndex];
      addLog(`⚠️【反撃】${stage.enemyName} の強烈な化学リアクション攻撃！`);

      setPlayerHearts(prev => {
        const next = prev - 1;
        if (next <= 0) {
          setTimeout(() => {
            setStageState('defeat');
            audio.playSynthesisFailure();
            addLog('💥【実験不能】器具損壊・維持限界に達しました。化学式を見直して再挑戦してください。');
          }, 0);
        } else {
          audio.playAtomPop(220);
        }
        return next;
      });
    }, 1100);
  };

  // ラボ（自由調合）
  const handleAddToLabTray = (symbol: string) => {
    if (labTray.length >= 6) return;
    audio.playAtomPop(520 + labTray.length * 30);
    const newTray = [...labTray, symbol];
    setLabTray(newTray);

    // 中2理科の反応傾向によってフラスコの色を更新
    if (newTray.includes('S')) {
      setLabReactionType('sulfuration');
    } else if (newTray.includes('O')) {
      setLabReactionType('oxidation');
    } else if (newTray.includes('H') || newTray.includes('C')) {
      setLabReactionType('reduction');
    } else {
      setLabReactionType('neutral');
    }
  };

  const handleClearLab = () => {
    setLabTray([]);
    setLabFeedback('');
    setLabReactionType('neutral');
    audio.playAtomPop(300);
  };

  const handleSynthesizeLab = () => {
    if (labTray.length === 0) return;
    const compound = activeLabCompound;
    if (compound) {
      audio.playSynthesisSuccess();
      setLabFeedback(
        `🎉【調合成功！】「${compound.name}」(${compound.formula}) の合成に成功しました。\n\n【化学反応式】${compound.equation}\n【性質と実験】${compound.description}\n【バトル効果】${compound.effect}`
      );
      if (!discoveredCompounds.includes(compound.formula)) {
        const newList = [...discoveredCompounds, compound.formula];
        saveDiscovered(newList);
        giveXP(20);
      }
    } else {
      audio.playSynthesisFailure();
      setLabFeedback(`❌【結合不成立】現在の原子比率では中2化学の安定な化合物ができません。右側の「代表的レシピ」をヒントに比率を調整してください。`);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden max-w-5xl mx-auto flex flex-col h-auto md:h-[88vh]">
      {/* ヘッダー・ナビゲーション */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-md">
            <Icon name="flask" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <span>元素バトルラボ</span>
              <span className="text-[10px] bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 px-2 py-0.5 rounded-full font-black">
                中学校2年 理科（化学）
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">原子・分子・分解・酸化・還元・硫化・定比例の法則を完全攻略！</p>
            <p className="text-[10px] text-indigo-300 font-bold">
              研究員ランク: Lv.{userProgress.level}（{userProgress.activeTitle || '中2理科マスター'}）
            </p>
          </div>
        </div>

        {/* コントロール & タブ */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* サウンドトグル */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
              soundEnabled
                ? 'bg-slate-800 border-indigo-500/50 text-indigo-300 hover:bg-slate-700'
                : 'bg-slate-800/60 border-slate-700 text-slate-500'
            }`}
          >
            <span>{soundEnabled ? '🔊 効果音ON' : '🔇 ミュート'}</span>
          </button>

          {/* タブ */}
          <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('quest')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === 'quest' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon name="play" className="w-3.5 h-3.5" />
              ステージ
            </button>
            <button
              onClick={() => setActiveTab('encyclopedia')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === 'encyclopedia' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon name="book" className="w-3.5 h-3.5" />
              元素事典
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === 'lab' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon name="flask" className="w-3.5 h-3.5" />
              自由実験
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-grow overflow-hidden flex flex-col relative">
        {/* ======================================================== */}
        {/* QUEST TAB */}
        {/* ======================================================== */}
        {activeTab === 'quest' && (
          <div className="flex-grow flex flex-col md:flex-row md:overflow-hidden h-auto md:h-full">
            {/* 左側：ステージ一覧またはバトル画面 */}
            <div className="flex-grow md:w-2/3 p-4 lg:p-6 md:overflow-y-auto flex flex-col border-b md:border-b-0 md:border-r border-slate-100">
              {stageState === 'intro' && (
                <div className="space-y-5 max-w-2xl mx-auto py-4 animate-fade-in">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-widest text-indigo-600 uppercase bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                        STAGE {currentStage.id} / 6
                      </span>
                      {currentStage.id === 6 && (
                        <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full animate-pulse">
                          ⚠️ 最高難度・帝王戦
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      {currentStage.name}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {currentStage.description}
                    </p>
                  </div>

                  {/* ステージセレクト（全6ステージ） */}
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {STAGES.map((stg, idx) => (
                      <button
                        key={stg.id}
                        onClick={() => startStage(idx)}
                        className={`px-3 py-2 rounded-xl text-xs font-black transition-all border shrink-0 cursor-pointer ${
                          currentStageIndex === idx
                            ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        第{stg.id}関門
                      </button>
                    ))}
                  </div>

                  {/* 敵紹介カード */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 shadow-inner shrink-0">
                        <AdvancedMonsterSVG type={currentStage.enemyType} phase={bossPhase} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{currentStage.enemyName}</h4>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="text-[10px] bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-full font-black">
                            属性: {currentStage.enemyType === 'pyro' && '熱分解・猛炎'}
                            {currentStage.enemyType === 'electro' && '電気分解・高圧電解'}
                            {currentStage.enemyType === 'oxidation' && '黒鋼・マグネシウム酸化'}
                            {currentStage.enemyType === 'reduction' && '酸化銅・還元パズル'}
                            {currentStage.enemyType === 'sulfide' && '鉄と硫黄・激化合発熱'}
                            {currentStage.enemyType === 'kaiser' && '定比例の法則・帝王'}
                          </span>
                          <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full font-black">
                            HP: {currentStage.enemyHealth}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-100">
                      {currentStage.enemyIntro}
                    </p>
                    <div className="text-[11px] font-bold text-indigo-900 bg-indigo-50/80 p-2.5 rounded-xl border border-indigo-100">
                      {currentStage.examQuestionPrompt}
                    </div>
                  </div>

                  {/* 開始ボタン */}
                  <button
                    onClick={handleStartBattle}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Icon name="play" className="w-4 h-4" />
                    <span>第{currentStage.id}関門：バトル開始！</span>
                  </button>
                </div>
              )}

              {stageState === 'battle' && (
                <div className="space-y-4 sm:space-y-5 flex-grow flex flex-col justify-between animate-fade-in">
                  {/* バトルフィールド（ビジュアル） */}
                  <div className={`grid grid-cols-2 gap-4 items-center bg-slate-950 text-white border border-slate-800 rounded-3xl p-5 shadow-2xl min-h-[190px] relative overflow-hidden ${isMonsterHit ? 'animate-shake' : ''}`}>
                    {/* Background SVG Grid */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>

                    {/* Reaction VFX Banner Popup */}
                    {reactionVFX && (
                      <div className={`absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-2 animate-bounce z-20 ${reactionVFX.color}`}>
                        <span>{reactionVFX.title}</span>
                        <span className="text-[10px] opacity-90 font-mono">({reactionVFX.equation})</span>
                      </div>
                    )}

                    {/* Flying Chemical Projectile Animation */}
                    {isAttacking && (
                      <div className="absolute left-[20%] top-1/2 -translate-y-1/2 animate-projectile z-30 pointer-events-none">
                        <div className="p-2.5 bg-white text-slate-950 font-black rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.9)] flex items-center gap-1.5 border-2 border-indigo-400">
                          <Icon name="flask" className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-black">分子結合ビーム！</span>
                        </div>
                      </div>
                    )}

                    {/* Floating Damage Number */}
                    {floatingDamage && (
                      <div className="absolute right-[22%] top-6 z-30 font-black text-2xl animate-bounce drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-yellow-300">
                        {floatingDamage.text}
                      </div>
                    )}

                    {/* 左：プレイヤー側 (研究者) */}
                    <div className="flex flex-col items-center justify-center space-y-2 z-10">
                      <div className="relative p-2 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-inner">
                        <div className="w-16 h-16 flex items-center justify-center">
                          <AtomOrbitSVG symbol="H" size={64} className="opacity-90" animated={true} />
                        </div>
                      </div>
                      <div className="text-xs font-black text-slate-300">中2理科研究員</div>
                      <div className="flex gap-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <span key={i} className="text-sm">
                            {i < playerHearts ? '❤️' : '🖤'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 右：敵モンスター */}
                    <div className="flex flex-col items-center justify-center space-y-2 z-10">
                      <div className="relative">
                        <AdvancedMonsterSVG type={currentStage.enemyType} isHit={isMonsterHit} phase={bossPhase} />
                      </div>
                      <div className="text-xs font-black text-slate-200">{currentStage.enemyName}</div>
                      {/* HPバー */}
                      <div className="w-full max-w-[140px] bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700 p-0.5">
                        <div
                          className="bg-gradient-to-r from-red-600 to-rose-400 h-full rounded-full transition-all duration-300 shadow-sm"
                          style={{ width: `${(enemyHealth / currentStage.enemyMaxHealth) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold">
                        HP: {enemyHealth} / {currentStage.enemyMaxHealth}
                      </div>
                    </div>

                    {/* 入力連打ボーナスオーバーレイ */}
                    {bonusActive && (
                      <div className="absolute inset-0 bg-indigo-950/95 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-4 text-white animate-fade-in z-30">
                        <span className="text-[10px] bg-indigo-500/40 border border-indigo-400/60 px-3 py-0.5 rounded-full font-black animate-pulse">
                          同調コンボ発生中！
                        </span>
                        <h4 className="text-lg font-black mt-1 text-yellow-300 flex items-center gap-1.5">
                          元素記号「{bonusTarget}」を連打！
                        </h4>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-32 bg-slate-900 rounded-full h-3.5 overflow-hidden border border-indigo-700">
                            <div
                              className="bg-gradient-to-r from-yellow-400 to-amber-300 h-full transition-all duration-100"
                              style={{ width: `${(bonusClicks / bonusRequired) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-black text-yellow-300">
                            {bonusClicks} / {bonusRequired}
                          </span>
                        </div>
                        <button
                          onClick={handleBonusClick}
                          className="mt-3 px-6 py-2 bg-yellow-400 hover:bg-yellow-350 active:scale-95 text-slate-950 font-black rounded-full shadow-lg text-xs cursor-pointer border-2 border-white"
                        >
                          {bonusTarget} をタップ！
                        </button>
                        <div className="text-[9px] text-indigo-300 mt-1.5">
                          残り: {bonusTimer.toFixed(1)}s
                        </div>
                      </div>
                    )}
                  </div>

                  {/* モバイル専用：元素パレット & 弱点 & 最新戦闘ログ */}
                  <div className="md:hidden flex flex-col gap-2.5 bg-slate-50 border border-slate-200/60 rounded-2xl p-3 shrink-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <h5 className="text-[10px] font-black text-slate-500 uppercase">
                          弱点ターゲット
                        </h5>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {currentStage.weaknessFormula.map(f => {
                            const c = COMPOUNDS[f];
                            return (
                              <span key={f} className="text-[9px] font-black bg-indigo-50 border border-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded-md">
                                {c?.name} ({c?.htmlFormula || f})
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-[10px] font-black text-slate-500 uppercase">
                          最新戦闘ログ
                        </h5>
                        <div className="bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[9px] px-2 py-1 rounded-lg h-[34px] overflow-hidden flex flex-col justify-center">
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
                      <h5 className="text-[10px] font-black text-slate-500 mb-1 flex justify-between">
                        <span>元素パレット (タップでトレイに追加)</span>
                      </h5>
                      <div className="grid grid-cols-4 gap-1.5">
                        {currentStage.providedElements.map(symbol => {
                          const info = ELEMENTS[symbol];
                          return (
                            <button
                              key={symbol}
                              onClick={() => handleAddToTray(symbol)}
                              className={`h-10 rounded-xl flex flex-col items-center justify-center border border-black/10 shadow-xs active:scale-95 cursor-pointer ${info?.color || 'bg-indigo-600 text-white'}`}
                            >
                              <span className="text-xs font-black leading-none">{symbol}</span>
                              <span className="text-[8px] opacity-90 mt-0.5 leading-none">{info?.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* クラフト・トレイ（調合台） */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-slate-700 tracking-wider flex items-center gap-1.5">
                        <span>🧪 反応トレイ（調合スロット）</span>
                        <span className="text-[10px] font-bold text-slate-400">※最大6原子</span>
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={handleElectrolysis}
                          disabled={isElectrolyzing}
                          className="px-2.5 py-1 text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 rounded-xl hover:bg-amber-200 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                        >
                          ⚡ 水の電気分解 (H₂O)
                        </button>
                        <button
                          onClick={handleClearTray}
                          className="text-[11px] font-bold text-slate-500 hover:text-red-500 transition-all cursor-pointer"
                        >
                          クリア
                        </button>
                      </div>
                    </div>

                    {/* トレイのグリッド */}
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-2.5 sm:p-3 min-h-[80px] flex items-center gap-2.5 overflow-x-auto">
                      {tray.length === 0 ? (
                        <p className="text-xs text-slate-400 font-medium text-center w-full">
                          右側（または上部）の元素を選んでトレイに入れ、分子を結合させよう！
                        </p>
                      ) : (
                        tray.map((symbol, idx) => {
                          const info = ELEMENTS[symbol];
                          return (
                            <button
                              key={idx}
                              onClick={() => handleRemoveFromTray(idx)}
                              className={`w-11 h-13 rounded-xl border border-black/10 flex flex-col items-center justify-between py-1 shadow-xs shrink-0 transition-transform active:scale-95 cursor-pointer ${info?.color || 'bg-slate-400'}`}
                            >
                              <span className="text-[8px] opacity-75 font-bold leading-none">
                                {info?.atomicNumber}
                              </span>
                              <span className="text-sm font-black tracking-tight leading-none">
                                {symbol}
                              </span>
                              <span className="text-[8px] opacity-90 leading-none truncate max-w-[36px]">
                                {info?.name}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* クラフトした化合物のプレビュー & 攻撃 */}
                  <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 text-center sm:text-left w-full sm:w-auto">
                      {activeTrayCompound ? (
                        <>
                          <div className="w-14 h-13 bg-white rounded-xl border border-indigo-100 flex items-center justify-center p-1 shrink-0 shadow-xs">
                            <CompoundMoleculeSVG formula={activeTrayCompound.formula} size={46} />
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5">
                              合成完了
                            </span>
                            <h5 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
                              <span>{activeTrayCompound.name}</span>
                              <span className="text-xs font-mono text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                                {activeTrayCompound.htmlFormula}
                              </span>
                            </h5>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                              {activeTrayCompound.effect}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div>
                          <span className="text-[9px] font-black text-slate-500 bg-slate-200 rounded-full px-2 py-0.5">
                            未反応
                          </span>
                          <p className="text-xs text-slate-400 mt-1 font-medium">
                            配置中：{tray.length > 0 ? tray.join(' + ') : '未選択'} (安定な化合物になっていません)
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleAttack}
                      disabled={tray.length === 0 || isAttacking}
                      className="w-full sm:w-auto bg-gradient-to-r from-slate-950 to-indigo-900 hover:from-slate-900 hover:to-indigo-800 text-white font-black px-7 py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs disabled:opacity-40 shrink-0 cursor-pointer"
                    >
                      <Icon name="flask" className="w-4 h-4 text-indigo-400" />
                      <span>化学反応で攻撃！</span>
                    </button>
                  </div>
                </div>
              )}

              {stageState === 'victory' && (
                <div className="text-center py-6 space-y-5 max-w-md mx-auto animate-fade-in">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-300 flex items-center justify-center animate-bounce">
                    <span className="text-4xl">🏆</span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">
                      EXPERIMENT SUCCESSFUL
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      第{currentStage.id}関門 突破！実験成功！
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      中2理科の化学特性を完璧に活用し、モンスターの化学装甲を打破しました！
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-left space-y-2.5 shadow-xs">
                    <h4 className="font-extrabold text-emerald-900 text-xs tracking-wider uppercase flex items-center gap-1.5">
                      <Icon name="award" className="w-4 h-4 text-emerald-600" />
                      <span>獲得報酬・事典アンロック</span>
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center border-b border-emerald-200/50 pb-1.5">
                        <span className="text-slate-600">学習経験値 (XP)</span>
                        <span className="font-black text-emerald-700">+{currentStage.xpReward} XP</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-600">アンロック化合物</span>
                        <span className="font-black text-indigo-700 bg-white border border-indigo-200 rounded px-2 py-0.5">
                          {COMPOUNDS[currentStage.unlockedCompoundReward]?.name} ({COMPOUNDS[currentStage.unlockedCompoundReward]?.htmlFormula})
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (currentStageIndex < STAGES.length - 1) {
                        startStage(currentStageIndex + 1);
                      } else {
                        startStage(0);
                      }
                    }}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition-all text-xs cursor-pointer"
                  >
                    {currentStageIndex < STAGES.length - 1 ? '次の関門（ステージ）へ進む' : '全6ステージ制覇！最初に戻る'}
                  </button>
                </div>
              )}

              {stageState === 'defeat' && (
                <div className="text-center py-6 space-y-5 max-w-md mx-auto animate-fade-in">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-300 flex items-center justify-center">
                    <span className="text-4xl">💥</span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-black tracking-widest text-red-600 uppercase">
                      REACTION OVERLOAD
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      実験失敗…トレイ破損！
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      化学変化の条件が合わず、敵の反撃により反応器具が損壊しました。
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 text-left">
                    <h4 className="font-extrabold text-red-900 text-xs mb-1 flex items-center gap-1.5">
                      <Icon name="info" className="w-4 h-4 text-red-700" />
                      <span>中2理科の攻略ヒント</span>
                    </h4>
                    <p className="text-xs text-red-800/80 leading-relaxed">
                      {currentStage.examQuestionPrompt}
                    </p>
                  </div>

                  <button
                    onClick={() => startStage(currentStageIndex)}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition-all text-xs cursor-pointer"
                  >
                    再挑戦する（リトライ）
                  </button>
                </div>
              )}
            </div>

            {/* 右側：元素パレット & ログ (デスクトップ) */}
            <div className="hidden md:flex md:w-1/3 bg-slate-50 p-4 lg:p-5 flex-col h-full justify-between overflow-hidden">
              <div className="space-y-3.5 flex-grow overflow-hidden flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-500 tracking-wider mb-2 flex items-center justify-between">
                    <span>元素パレット (中2理科)</span>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      クリックで追加
                    </span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {currentStage.providedElements.map(symbol => {
                      const info = ELEMENTS[symbol];
                      return (
                        <button
                          key={symbol}
                          onClick={() => handleAddToTray(symbol)}
                          className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border border-black/10 shadow-xs transition-transform active:scale-95 cursor-pointer ${info?.color || 'bg-indigo-600 text-white'}`}
                        >
                          <span className="text-base font-black leading-none">{symbol}</span>
                          <span className="text-[10px] opacity-90 mt-1 leading-none">{info?.name}</span>
                          <span className="text-[8px] opacity-75 mt-0.5 leading-none">原子番号 {info?.atomicNumber}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 弱点メモ */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-3.5 shadow-xs">
                  <h5 className="text-[10px] font-black text-indigo-700 tracking-wider mb-1.5 uppercase flex items-center gap-1.5">
                    <Icon name="award" className="w-3.5 h-3.5 text-indigo-600" />
                    <span>弱点ターゲット</span>
                  </h5>
                  <div className="space-y-1">
                    {currentStage.weaknessFormula.map(f => {
                      const c = COMPOUNDS[f];
                      return (
                        <div key={f} className="flex items-center justify-between bg-indigo-50/60 p-1.5 rounded-xl text-xs">
                          <span className="font-extrabold text-indigo-900 text-xs">{c?.name}</span>
                          <span className="font-mono font-black text-indigo-600 bg-white border border-indigo-200 px-2 py-0.5 rounded-lg text-[10px]">
                            {c?.htmlFormula || f}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 戦闘ログ */}
                <div className="flex-grow flex flex-col overflow-hidden max-h-[140px]">
                  <h4 className="text-[10px] font-black text-slate-500 tracking-wider mb-1 uppercase">
                    反応プロセス・戦闘ログ
                  </h4>
                  <div className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[9px] p-2.5 rounded-xl overflow-y-auto space-y-1 flex-grow">
                    {battleLog.length === 0 ? (
                      <span className="text-slate-500 italic">待機中...</span>
                    ) : (
                      battleLog.map((log, i) => (
                        <div key={i} className="leading-tight border-b border-slate-800/40 pb-0.5">
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
        {/* ENCYCLOPEDIA TAB (元素事典 & ボーア原子模型インスペクター) */}
        {/* ======================================================== */}
        {activeTab === 'encyclopedia' && (
          <div className="flex-grow p-4 lg:p-6 overflow-y-auto space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>中学生の元素＆化学物質事典</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                  中学校2年理科準拠
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                カードをクリックすると、電子殻と原子核の「詳細ボーア模型」や高校入試出題ポイントを確認できます。
              </p>
            </div>

            {/* 元素セクション */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-indigo-600 tracking-widest uppercase">
                1. 中2で習う重要な元素（原子）- タップで原子構造を調査
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.keys(ELEMENTS).map(symbol => {
                  const info = ELEMENTS[symbol];
                  return (
                    <button
                      key={symbol}
                      onClick={() => {
                        setInspectingElement(symbol);
                        audio.playAtomPop(600);
                      }}
                      className="bg-slate-50 hover:bg-white border border-slate-200/70 hover:border-indigo-300 rounded-2xl p-3 flex items-center gap-3 shadow-xs hover:shadow-md transition-all text-left cursor-pointer group"
                    >
                      {/* 軽量化：一覧表示では静的SVG (animated=false) で描画しCPU負荷をゼロに */}
                      <div className="w-12 h-12 rounded-xl border border-black/10 flex flex-col items-center justify-center p-1 shadow-xs shrink-0 bg-slate-900 group-hover:scale-105 transition-transform">
                        <AtomOrbitSVG symbol={symbol} size={42} animated={false} />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-extrabold text-sm text-slate-900">{info.name}</h5>
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 rounded-full font-bold">
                            {info.symbol}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">原子番号 {info.atomicNumber} / 質量 {info.mass}</p>
                        <span className="text-[9px] text-indigo-600 font-bold group-hover:underline">
                          模型を見る ➔
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 化合物セクション */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-black text-indigo-600 tracking-widest uppercase">
                2. 中2で習う重要な化合物（分子・結晶構造）
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {Object.keys(COMPOUNDS).map(formula => {
                  const comp = COMPOUNDS[formula];
                  const isUnlocked = discoveredCompounds.includes(formula);

                  return (
                    <div
                      key={formula}
                      className={`border rounded-2xl p-3.5 flex gap-3 shadow-xs transition-all ${
                        isUnlocked
                          ? 'bg-white border-indigo-100/80 shadow-xs'
                          : 'bg-slate-50/50 border-slate-200/50 grayscale opacity-60'
                      }`}
                    >
                      <div className="w-14 h-14 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-2xl shrink-0 p-1">
                        {isUnlocked ? (
                          <CompoundMoleculeSVG formula={formula} size={44} />
                        ) : (
                          <span className="text-lg font-black text-slate-400">？</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-extrabold text-sm text-slate-900">
                            {isUnlocked ? comp.name : '未確認の化合物'}
                          </h5>
                          {isUnlocked && (
                            <span className="text-[9px] font-mono bg-indigo-50 border border-indigo-200 text-indigo-700 px-1.5 rounded">
                              {comp.htmlFormula}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {isUnlocked ? comp.description : 'ステージ攻略や自由調合でこの化合物を作るとアンロックされます。'}
                        </p>
                        {isUnlocked && (
                          <div className="text-[10px] font-mono text-indigo-600 font-bold">
                            反応式: {comp.equation}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LAB TAB (自由調合実験室) */}
        {/* ======================================================== */}
        {activeTab === 'lab' && (
          <div className="flex-grow flex flex-col md:flex-row md:overflow-hidden h-auto md:h-full">
            <div className="flex-grow md:w-2/3 p-4 lg:p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>自由調合ケミカルラボ</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                    中2理科・反応実験
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  好きな元素をトレイに投入し、中2で習う化合物を自由に合成・発見しましょう！
                </p>
              </div>

              {/* フラスコリアクター（ビジュアル） */}
              <div className="bg-slate-950 text-white rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
                    <Icon
                      name="flask"
                      className={`w-10 h-10 transition-colors duration-500 ${
                        labReactionType === 'oxidation'
                          ? 'text-red-400'
                          : labReactionType === 'reduction'
                          ? 'text-sky-400'
                          : labReactionType === 'sulfuration'
                          ? 'text-yellow-400'
                          : 'text-indigo-400'
                      }`}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">実験リアクター状態</span>
                    <h4 className="text-base font-black text-slate-100">
                      {labReactionType === 'oxidation' && '🔥 酸化・燃焼反応チャンバー'}
                      {labReactionType === 'reduction' && '✨ 還元・酸素奪還チャンバー'}
                      {labReactionType === 'sulfuration' && '🌋 硫黄激化合チャンバー'}
                      {labReactionType === 'neutral' && '🧪 待機中（原子未励起）'}
                    </h4>
                  </div>
                </div>
              </div>

              {/* ラボ調合トレイ */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-700">調合トレイ（最大6原子）</h4>
                  <button
                    onClick={handleClearLab}
                    className="text-[11px] font-bold text-slate-500 hover:text-red-500 cursor-pointer"
                  >
                    リセット
                  </button>
                </div>

                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-3 min-h-[75px] flex items-center gap-2 overflow-x-auto">
                  {labTray.length === 0 ? (
                    <span className="text-xs text-slate-400 text-center w-full">
                      元素を選択してトレイに入れてください
                    </span>
                  ) : (
                    labTray.map((sym, i) => (
                      <span
                        key={i}
                        className={`w-10 h-12 rounded-xl flex flex-col items-center justify-center font-black text-sm shadow-xs ${ELEMENTS[sym]?.color || 'bg-indigo-600 text-white'}`}
                      >
                        {sym}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* 調合ボタン */}
              <button
                onClick={handleSynthesizeLab}
                disabled={labTray.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-xl transition-all shadow-md text-xs cursor-pointer disabled:opacity-40"
              >
                化学結合を実行！
              </button>

              {/* 実験結果フィードバック */}
              {labFeedback && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 whitespace-pre-line leading-relaxed shadow-xs">
                  {labFeedback}
                </div>
              )}
            </div>

            {/* 右側：元素選択パレット (ラボ用) */}
            <div className="hidden md:flex md:w-1/3 bg-slate-50 p-4 border-l border-slate-100 flex-col justify-between overflow-y-auto">
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-600">元素パレット（タップで投入）</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(ELEMENTS).map(symbol => {
                    const info = ELEMENTS[symbol];
                    return (
                      <button
                        key={symbol}
                        onClick={() => handleAddToLabTray(symbol)}
                        className={`p-2 rounded-xl flex items-center justify-between border border-black/10 shadow-xs active:scale-95 cursor-pointer ${info.color}`}
                      >
                        <span className="text-xs font-black">{symbol}</span>
                        <span className="text-[10px] font-bold opacity-90">{info.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-3 space-y-1.5 shadow-xs">
                  <h5 className="text-[10px] font-black text-indigo-700 uppercase">代表的レシピヒント</h5>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>二酸化炭素: C + O + O (CO₂)</li>
                    <li>水: H + H + O (H₂O)</li>
                    <li>酸化銅: Cu + O (CuO)</li>
                    <li>酸化マグネシウム: Mg + O (MgO)</li>
                    <li>硫化鉄: Fe + S (FeS)</li>
                    <li>硫化銅: Cu + S (CuS)</li>
                    <li>酸化銀: Ag + Ag + O (Ag₂O)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ATOM INSPECTOR MODAL (Bohr Model Explorer) */}
      {/* ======================================================== */}
      {inspectingElement && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                  ATOMIC STRUCTURE INSPECTOR
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {ELEMENTS[inspectingElement]?.name}（{inspectingElement}）
                </h3>
              </div>
              <button
                onClick={() => setInspectingElement(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-black text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Bohr Model SVG (Interactive Animation only in Modal!) */}
            <div className="w-full h-44 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-2 shadow-inner">
              <AtomOrbitSVG symbol={inspectingElement} size={150} animated={true} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold">原子番号 / 陽子数</span>
                <p className="font-black text-slate-800 text-sm">{ELEMENTS[inspectingElement]?.atomicNumber}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold">電子殻構造 (内殻➔外殻)</span>
                <p className="font-black text-slate-800 text-sm">
                  {ELEMENTS[inspectingElement]?.shells.join(' ➔ ')}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <h5 className="font-bold text-slate-700">特徴と性質</h5>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {ELEMENTS[inspectingElement]?.description}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <h5 className="font-bold text-amber-800 flex items-center gap-1">
                <span>📝 中2理科・高校入試ポイント</span>
              </h5>
              <p className="text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed font-medium">
                {ELEMENTS[inspectingElement]?.examTip}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
