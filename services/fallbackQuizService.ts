
import { QuizQuestion } from '../types';

const FALLBACK_QUIZZES: { [key: string]: QuizQuestion[] } = {
  '正負の数': [
    {
      question: '(-5) + (+3) の計算結果は？',
      options: ['-8', '-2', '2', '8'],
      correctAnswerIndex: 1,
      explanation: '負の数と正の数の加法では、絶対値の大きい方の符号を使い、絶対値の差を求めます。|-5| > |+3| なので符号はマイナス、5 - 3 = 2 なので結果は -2 です。'
    },
    {
      question: '(-4) × (-3) の計算結果は？',
      options: ['-12', '-7', '7', '12'],
      correctAnswerIndex: 3,
      explanation: '負の数どうしの乗法では、符号はプラスになります。4 × 3 = 12 なので結果は 12 です。'
    },
    {
      question: '絶対値が 3 である数は？',
      options: ['3のみ', '-3のみ', '3と-3', '0と3'],
      correctAnswerIndex: 2,
      explanation: '絶対値とは、数直線上で0からの距離のことです。0から3離れている数は、プラス方向に3、マイナス方向に-3の2つあります。'
    },
    {
      question: '(-2)³ の計算結果は？',
      options: ['-6', '-8', '6', '8'],
      correctAnswerIndex: 1,
      explanation: '(-2)³ = (-2) × (-2) × (-2) です。負の数を奇数回かけるので符号はマイナス、2 × 2 × 2 = 8 なので結果は -8 です。'
    },
    {
      question: '12 ÷ (-4) の計算結果は？',
      options: ['-8', '-3', '3', '8'],
      correctAnswerIndex: 1,
      explanation: '正の数と負の数の除法では、符号はマイナスになります。12 ÷ 4 = 3 なので結果は -3 です。'
    }
  ],
  '文字の式': [
    {
      question: 'x × (-3) を文字式のルールで表すと？',
      options: ['x-3', '-3x', 'x3-', '3-x'],
      correctAnswerIndex: 1,
      explanation: '文字式のルールでは、数と文字の積では数を先に書き、×を省略します。'
    },
    {
      question: 'a × a × b を文字式のルールで表すと？',
      options: ['2ab', 'a²b', 'ab²', 'a+a+b'],
      correctAnswerIndex: 1,
      explanation: '同じ文字の積は、指数を使って表します。aが2つあるので a² となります。'
    },
    {
      question: 'x = -2 のとき、3x + 5 の値は？',
      options: ['-1', '1', '11', '13'],
      correctAnswerIndex: 0,
      explanation: '3 × (-2) + 5 = -6 + 5 = -1 となります。'
    },
    {
      question: '5x - 3x の計算結果は？',
      options: ['2', '2x', '8x', '15x'],
      correctAnswerIndex: 1,
      explanation: '同じ文字を含む項（同類項）は、係数を計算してまとめることができます。(5 - 3)x = 2x です。'
    },
    {
      question: '2(3a - 4) を展開すると？',
      options: ['6a - 4', '5a - 2', '6a - 8', 'a - 2'],
      correctAnswerIndex: 2,
      explanation: '分配法則を使います。2 × 3a + 2 × (-4) = 6a - 8 です。'
    }
  ],
  '一次方程式': [
    {
      question: 'x + 5 = 12 の解は？',
      options: ['x = 7', 'x = 17', 'x = -7', 'x = 60'],
      correctAnswerIndex: 0,
      explanation: '5を右辺に移項すると、x = 12 - 5 となり、x = 7 です。'
    },
    {
      question: '3x = 15 の解は？',
      options: ['x = 12', 'x = 18', 'x = 5', 'x = 45'],
      correctAnswerIndex: 2,
      explanation: '両辺を3で割ると、x = 15 ÷ 3 となり、x = 5 です。'
    },
    {
      question: '2x - 4 = 6 の解は？',
      options: ['x = 1', 'x = 5', 'x = 10', 'x = 2'],
      correctAnswerIndex: 1,
      explanation: '-4を移項して 2x = 6 + 4、2x = 10。両辺を2で割って x = 5 です。'
    },
    {
      question: '5x = 2x + 9 の解は？',
      options: ['x = 3', 'x = 1', 'x = 9', 'x = 7'],
      correctAnswerIndex: 0,
      explanation: '2xを左辺に移項して 5x - 2x = 9、3x = 9。両辺を3で割って x = 3 です。'
    },
    {
      question: '方程式 0.2x + 1 = 1.4 を解くために、まず両辺に何をかけるのが一般的？',
      options: ['2', '5', '10', '100'],
      correctAnswerIndex: 2,
      explanation: '小数を整数にするために、10をかけるのが一般的です。2x + 10 = 14 となり解きやすくなります。'
    }
  ],
  '比例と反比例': [
    {
      question: 'yがxに比例し、x=2のときy=6である。比例定数は？',
      options: ['2', '3', '6', '12'],
      correctAnswerIndex: 1,
      explanation: '比例の式 y = ax に代入すると、6 = a × 2。a = 3 となります。'
    },
    {
      question: 'yがxに反比例し、x=3のときy=4である。式は？',
      options: ['y = 12x', 'y = 12/x', 'y = 4/3x', 'y = x/12'],
      correctAnswerIndex: 1,
      explanation: '反比例の式 y = a/x より、a = xy = 3 × 4 = 12。よって y = 12/x です。'
    }
  ],
  '平面図形': [
    {
      question: '半径 5cm の円の周の長さは？（円周率はπとする）',
      options: ['5π cm', '10π cm', '25π cm', '50π cm'],
      correctAnswerIndex: 1,
      explanation: '円周の長さ = 直径 × 円周率 = (5 × 2) × π = 10π cm です。'
    }
  ],
  '空間図形': [
    {
      question: '底面の半径が 3cm、高さが 5cm の円柱の体積は？',
      options: ['15π cm³', '30π cm³', '45π cm³', '75π cm³'],
      correctAnswerIndex: 2,
      explanation: '体積 = 底面積 × 高さ = (3 × 3 × π) × 5 = 45π cm³ です。'
    }
  ],
  'データの活用': [
    {
      question: 'データ 2, 5, 5, 7, 11 の中央値（メジアン）は？',
      options: ['5', '6', '7', '11'],
      correctAnswerIndex: 1,
      explanation: '小さい順に並べたときの中央の値です。5つあるので3番目の「5」が中央値です。'
    }
  ]
};

const generatePositiveNegativeQuestions = (): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < 5; i++) {
    const type = Math.floor(Math.random() * 3); // 0: addition, 1: multiplication, 2: absolute value
    if (type === 0) {
      const a = Math.floor(Math.random() * 20) - 10;
      const b = Math.floor(Math.random() * 20) - 10;
      const result = a + b;
      const options = [result, result + 2, result - 2, result + 5].sort(() => Math.random() - 0.5);
      questions.push({
        question: `(${a > 0 ? '+' : ''}${a}) + (${b > 0 ? '+' : ''}${b}) の計算結果は？`,
        options: options.map(String),
        correctAnswerIndex: options.indexOf(result),
        explanation: `正負の数の加法です。${a} と ${b} を足すと ${result} になります。`
      });
    } else if (type === 1) {
      const a = Math.floor(Math.random() * 10) - 5;
      const b = Math.floor(Math.random() * 10) - 5;
      const result = a * b;
      const options = [result, -result, result + 1, result - 1].sort(() => Math.random() - 0.5);
      questions.push({
        question: `(${a > 0 ? '+' : ''}${a}) × (${b > 0 ? '+' : ''}${b}) の計算結果は？`,
        options: options.map(String),
        correctAnswerIndex: options.indexOf(result),
        explanation: `正負の数の乗法です。符号に注意しましょう。${a} × ${b} = ${result} です。`
      });
    } else {
      const val = Math.floor(Math.random() * 10) + 1;
      const isNegative = Math.random() > 0.5;
      const num = isNegative ? -val : val;
      questions.push({
        question: `${num} の絶対値は？`,
        options: [String(val), String(-val), '0', String(val * 2)].sort(() => Math.random() - 0.5),
        correctAnswerIndex: 0, // Simplified for this example, will fix below
        explanation: `絶対値とは0からの距離のことです。${num} の絶対値は ${val} です。`
      });
      // Fix correctAnswerIndex
      const last = questions[questions.length - 1];
      last.correctAnswerIndex = last.options.indexOf(String(val));
    }
  }
  return questions;
};

const generateEquationQuestions = (): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(Math.random() * 10) - 5; // The answer
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 10) - 5;
    const c = a * x + b;
    
    const options = [x, x + 1, x - 1, -x].sort(() => Math.random() - 0.5);
    questions.push({
      question: `方程式 ${a}x ${b >= 0 ? '+' : ''}${b} = ${c} の解は？`,
      options: options.map(v => `x = ${v}`),
      correctAnswerIndex: options.indexOf(x),
      explanation: `${b >= 0 ? '+' : ''}${b} を移項して ${a}x = ${c - b}、両辺を ${a} で割ると x = ${x} となります。`
    });
  }
  return questions;
};

const generateAlgebraQuestions = (): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < 5; i++) {
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
      // Evaluation
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 10) - 5;
      const x = Math.floor(Math.random() * 6) - 3;
      const result = a * x + b;
      const options = [result, result + 1, result - 1, a + b].sort(() => Math.random() - 0.5);
      questions.push({
        question: `x = ${x} のとき、${a}x ${b >= 0 ? '+' : ''}${b} の値は？`,
        options: options.map(String),
        correctAnswerIndex: options.indexOf(result),
        explanation: `${a} × (${x}) ${b >= 0 ? '+' : ''}${b} = ${a * x} ${b >= 0 ? '+' : ''}${b} = ${result} です。`
      });
    } else if (type === 1) {
      // Simplification
      const a = Math.floor(Math.random() * 10) + 2;
      const b = Math.floor(Math.random() * 10) + 2;
      const result = a + b;
      const options = [`${result}x`, `${a - b}x`, `${result}`, `${a * b}x`].sort(() => Math.random() - 0.5);
      questions.push({
        question: `${a}x + ${b}x を計算すると？`,
        options: options,
        correctAnswerIndex: options.indexOf(`${result}x`),
        explanation: `同じ文字を含む項は係数を足します。(${a} + ${b})x = ${result}x です。`
      });
    } else {
      // Expansion
      const a = Math.floor(Math.random() * 4) + 2;
      const b = Math.floor(Math.random() * 5) + 1;
      const c = Math.floor(Math.random() * 6) + 1;
      const res1 = a * b;
      const res2 = a * c;
      const options = [`${res1}x + ${res2}`, `${res1}x + ${c}`, `${a + b}x + ${res2}`, `${res1}x - ${res2}`].sort(() => Math.random() - 0.5);
      questions.push({
        question: `${a}(${b}x + ${c}) を展開すると？`,
        options: options,
        correctAnswerIndex: options.indexOf(`${res1}x + ${res2}`),
        explanation: `分配法則を使います。${a}×${b}x + ${a}×${c} = ${res1}x + ${res2} です。`
      });
    }
  }
  return questions;
};

const generateProportionQuestions = (): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < 5; i++) {
    const isInverse = Math.random() > 0.5;
    if (!isInverse) {
      const a = Math.floor(Math.random() * 5) + 2;
      const x = Math.floor(Math.random() * 6) + 1;
      const y = a * x;
      const options = [a, a + 1, a - 1, y].sort(() => Math.random() - 0.5);
      questions.push({
        question: `yがxに比例し、x = ${x} のとき y = ${y} である。比例定数 a は？`,
        options: options.map(String),
        correctAnswerIndex: options.indexOf(a),
        explanation: `y = ax に代入すると ${y} = a × ${x}。よって a = ${y} ÷ ${x} = ${a} です。`
      });
    } else {
      const a = (Math.floor(Math.random() * 4) + 2) * 6; // Make it divisible
      const x = Math.floor(Math.random() * 4) + 2;
      const y = a / x;
      const options = [a, a / 2, y, x].sort(() => Math.random() - 0.5);
      questions.push({
        question: `yがxに反比例し、x = ${x} のとき y = ${y} である。比例定数 a は？`,
        options: options.map(String),
        correctAnswerIndex: options.indexOf(a),
        explanation: `y = a/x より a = xy です。a = ${x} × ${y} = ${a} となります。`
      });
    }
  }
  return questions;
};

const generateGeometryQuestions = (): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < 5; i++) {
    const type = Math.floor(Math.random() * 2);
    if (type === 0) {
      // Circle Circumference
      const r = Math.floor(Math.random() * 10) + 1;
      const result = 2 * r;
      const options = [`${result}π`, `${r}π`, `${r * r}π`, `${result * 2}π`].sort(() => Math.random() - 0.5);
      questions.push({
        question: `半径 ${r}cm の円の周の長さは？（円周率はπとする）`,
        options: options.map(v => `${v} cm`),
        correctAnswerIndex: options.indexOf(`${result}π`),
        explanation: `円周の長さ = 直径 × 円周率 = (${r} × 2) × π = ${result}π cm です。`
      });
    } else {
      // Circle Area
      const r = Math.floor(Math.random() * 10) + 1;
      const result = r * r;
      const options = [`${result}π`, `${r * 2}π`, `${result * 2}π`, `${r}π`].sort(() => Math.random() - 0.5);
      questions.push({
        question: `半径 ${r}cm の円の面積は？（円周率はπとする）`,
        options: options.map(v => `${v} cm²`),
        correctAnswerIndex: options.indexOf(`${result}π`),
        explanation: `円の面積 = 半径 × 半径 × 円周率 = ${r} × ${r} × π = ${result}π cm² です。`
      });
    }
  }
  return questions;
};

const generateSolidGeometryQuestions = (): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < 5; i++) {
    const r = Math.floor(Math.random() * 5) + 1;
    const h = Math.floor(Math.random() * 8) + 2;
    const area = r * r;
    const volume = area * h;
    const options = [`${volume}π`, `${area * 2}π`, `${volume / 2}π`, `${volume * 2}π`].sort(() => Math.random() - 0.5);
    questions.push({
      question: `底面の半径が ${r}cm、高さが ${h}cm の円柱の体積は？`,
      options: options.map(v => `${v} cm³`),
      correctAnswerIndex: options.indexOf(`${volume}π`),
      explanation: `体積 = 底面積 × 高さ = (${r} × ${r} × π) × ${h} = ${area}π × ${h} = ${volume}π cm³ です。`
    });
  }
  return questions;
};

export const getFallbackQuestions = (subjectName: string): QuizQuestion[] => {
  if (subjectName === '正負の数') return generatePositiveNegativeQuestions();
  if (subjectName === '一次方程式') return generateEquationQuestions();
  if (subjectName === '文字の式') return generateAlgebraQuestions();
  if (subjectName === '比例と反比例') return generateProportionQuestions();
  if (subjectName === '平面図形') return generateGeometryQuestions();
  if (subjectName === '空間図形') return generateSolidGeometryQuestions();

  return FALLBACK_QUIZZES[subjectName] || [
    {
      question: `${subjectName}に関する問題です。1 + 1 は？`,
      options: ['1', '2', '3', '4'],
      correctAnswerIndex: 1,
      explanation: 'これはサンプル問題です。'
    }
  ];
};
