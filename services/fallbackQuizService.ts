
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
  ],
  '数学': [
    {
      question: '2³ - (-5) の計算結果は？',
      options: ['1', '3', '11', '13'],
      correctAnswerIndex: 3,
      explanation: '2³ = 8 です。8 - (-5) = 8 + 5 = 13 となります。'
    },
    {
      question: '方程式 3x + 5 = 20 の解は？',
      options: ['x = 5', 'x = 15', 'x = 25', 'x = 3'],
      correctAnswerIndex: 0,
      explanation: '3x = 20 - 5 より 3x = 15。両辺を3で割って x = 5 です。'
    },
    {
      question: 'yがxに比例し、x=3のときy=12である。x=5のときのyの値は？',
      options: ['15', '20', '8', '24'],
      correctAnswerIndex: 1,
      explanation: 'y=ax より 12=3a で a=4。よって y=4x。x=5 を代入すると y=4×5=20 です。'
    },
    {
      question: '底辺が 6cm、高さが 4cm の三角形の面積は？',
      options: ['10 cm²', '12 cm²', '24 cm²', '48 cm²'],
      correctAnswerIndex: 1,
      explanation: '三角形の面積 = 底辺 × 高さ ÷ 2 = 6 × 4 ÷ 2 = 12 cm² です。'
    },
    {
      question: '(-0.5) × (-8) の計算結果は？',
      options: ['-4', '-0.4', '0.4', '4'],
      correctAnswerIndex: 3,
      explanation: '負の数どうしの掛け算なので符号はプラスになります。0.5 × 8 = 4 です。'
    },
    {
      question: '1/2 + 1/3 の計算結果は？',
      options: ['2/5', '1/6', '5/6', '1/5'],
      correctAnswerIndex: 2,
      explanation: '通分すると 3/6 + 2/6 = 5/6 となります。'
    },
    {
      question: '2(a + 3b) - 3(a - b) を簡潔にすると？',
      options: ['-a + 9b', '-a + 3b', '5a + 9b', 'a + 3b'],
      correctAnswerIndex: 0,
      explanation: '2a + 6b - 3a + 3b = (2-3)a + (6+3)b = -a + 9b です。'
    },
    {
      question: '√36 の値は？',
      options: ['6', '18', '72', '6と-6'],
      correctAnswerIndex: 0,
      explanation: '√a は「2乗してaになる正の数」を表します。6² = 36 なので 6 です。（平方根を求めよ、と言われた場合は±6になります）'
    },
    {
      question: '五角形の内角の和は何点？',
      options: ['360度', '540度', '720度', '900度'],
      correctAnswerIndex: 1,
      explanation: 'n角形の内角の和は 180 × (n - 2) で求められます。180 × (5 - 2) = 180 × 3 = 540度です。'
    },
    {
      question: 'サイコロを1回振ったとき、素数（2, 3, 5）の目が出る確率は？',
      options: ['1/6', '1/3', '1/2', '2/3'],
      correctAnswerIndex: 2,
      explanation: 'サイコロの目は全部で6通り。素数は2, 3, 5の3通り。確率は 3/6 = 1/2 です。'
    }
  ],
  '国語': [
    {
      question: '「雰囲気」の正しい読み方は？',
      options: ['ふんいき', 'ふいんき', 'ふんいき', 'ふんいぎ'],
      correctAnswerIndex: 0,
      explanation: '正しくは「ふん・い・き」です。「ふいんき」と読み間違えやすいので注意しましょう。'
    },
    {
      question: '「詳細」の正しい読み方は？',
      options: ['しょうさい', 'しょうさ', 'こまさい', 'じょうさい'],
      correctAnswerIndex: 0,
      explanation: '「しょうさい」と読みます。非常にくわしいこと、という意味です。'
    },
    {
      question: '四字熟語「（　）一失」の空欄に入る言葉は？',
      options: ['百慮', '万慮', '千慮', '一慮'],
      correctAnswerIndex: 2,
      explanation: '「千慮（せんりょ）の一失」。賢い人でも、千回に一度くらいは考え違いをすることがあるという意味です。'
    },
    {
      question: 'ことわざ「（　）も筆の誤り」の空欄に入る言葉は？',
      options: ['聖徳太子', '弘法', '小野道風', '菅原道真'],
      correctAnswerIndex: 1,
      explanation: '「弘法（こうぼう）も筆の誤り」。その道の達人でも、時には失敗することがあるというたとえです。'
    },
    {
      question: '「行く」の尊敬語として正しいものは？',
      options: ['うかがう', '行かれる', '参る', 'いらっしゃる'],
      correctAnswerIndex: 3,
      explanation: '「いらっしゃる」や「おいでになる」が尊敬語です。「参る」や「うかがう」は謙譲語です。'
    },
    {
      question: '「慎重」の反対の意味を持つ言葉は？',
      options: ['大胆', '丁寧', '軽率', '冷淡'],
      correctAnswerIndex: 2,
      explanation: '「慎重」は注意深いこと。対義語は、よく考えずに物事を行う「軽率（けいそつ）」です。'
    },
    {
      question: '三字熟語「（　）三昧」の空欄に入る、何かに夢中になる様子を表す言葉は？',
      options: ['娯楽', '読書', '勉強', '生活'],
      correctAnswerIndex: 1,
      explanation: '「読書三昧（どくしょざんまい）」。他のことを忘れて、読書にふけることです。'
    },
    {
      question: '「ひまわり」が季語として使われる季節はいつ？',
      options: ['春', '夏', '秋', '冬'],
      correctAnswerIndex: 1,
      explanation: 'ひまわりは夏に咲く花なので、俳句などでは夏の季語として扱われます。'
    },
    {
      question: '小説『吾輩は猫である』の著者は誰？',
      options: ['芥川龍之介', '太宰治', '夏目漱石', '森鴎外'],
      correctAnswerIndex: 2,
      explanation: '夏目漱石の代表作の一つです。語り手が猫という設定で当時の社会を風刺した作品です。'
    },
    {
      question: '「を」「へ」「は」など、言葉の後に付いて関係を表す言葉を何という？',
      options: ['助動詞', '助詞', '接続詞', '副詞'],
      correctAnswerIndex: 1,
      explanation: 'これらは「助詞」と呼ばれます。自立語の後に付いて、その言葉の役割（主語、目的語など）を示します。'
    }
  ],
  '中学1年 数学': [
    {
      question: '(-7) + (+4) の計算結果は？',
      options: ['-11', '-3', '3', '11'],
      correctAnswerIndex: 1,
      explanation: '負の数と正の数の足し算です。絶対値の大きいほうの符号（マイナス）を使用し、差を求めます。(7 - 4 = 3) なので結果は -3 です。'
    },
    {
      question: '方程式 3x - 5 = 10 の解は？',
      options: ['x = 3', 'x = 5', 'x = 15', 'x = -5'],
      correctAnswerIndex: 1,
      explanation: '-5を右辺に移項すると 3x = 10 + 5 となり 3x = 15 です。両辺を3で割ると x = 5 となります。'
    }
  ],
  '中学2年 数学': [
    {
      question: '連立方程式 x + y = 5, x - y = 1 の解は？',
      options: ['x=3, y=2', 'x=2, y=3', 'x=4, y=1', 'x=3, y=1'],
      correctAnswerIndex: 0,
      explanation: '2つの式を足すと 2x = 6 より x = 3。これを上の式に代入すると 3 + y = 5 より y = 2 となります。'
    },
    {
      question: '一次関数 y = 2x + 3 において、xが 1 から 4 まで増加したとき、yの増加量は？',
      options: ['3', '6', '9', '11'],
      correctAnswerIndex: 1,
      explanation: '一次関数 y = ax + b の変化の割合（yの増加量 / xの増加量）は一定です。yの増加量 = 変化の割合(2) × xの増加量(3) = 6 となります。'
    }
  ],
  '中学3年 数学': [
    {
      question: '(x + 3)(x - 2) を展開した結果は？',
      options: ['x² + 5x - 6', 'x² + x - 6', 'x² - x - 6', 'x² + x + 6'],
      correctAnswerIndex: 1,
      explanation: '公式 (x+a)(x+b) = x² + (a+b)x + ab を使います。a=3, b=-2 なので、x² + (3-2)x + (3×-2) = x² + x - 6 です。'
    },
    {
      question: '√45 を簡単に表したものは？',
      options: ['5√3', '3√5', '9√5', '15√3'],
      correctAnswerIndex: 1,
      explanation: '√45 = √(9 × 5) = √(3² × 5) = 3√5 となります。'
    }
  ],
  '中学1年 英語': [
    {
      question: '「私はテニスが好きです」を表す英語の空欄に入る語は？ "I ( ) tennis."',
      options: ['is', 'like', 'likes', 'am like'],
      correctAnswerIndex: 1,
      explanation: '主語が I（1人称単数）なので、一般動詞の原形 like を使います。'
    },
    {
      question: '「あなたは泳ぐことができますか？」を表す英語の空欄に入る語は？ "( ) you swim?"',
      options: ['Do', 'Are', 'Can', 'Is'],
      correctAnswerIndex: 2,
      explanation: '「〜できる」という能力を表す助動詞 can を使って、疑問文にするため Can you swim? とします。'
    }
  ],
  '中学2年 英語': [
    {
      question: '「英語を勉強することは楽しいです」を表す英語の空欄に入る語は？ "( ) English is fun."',
      options: ['Study', 'Studying', 'Studied', 'Studies'],
      correctAnswerIndex: 1,
      explanation: '「〜すること」という主語を作るために、動名詞 Studying（または不定詞 To study）を使用します。'
    },
    {
      question: '「この本はあの本よりも面白いです」を表す英語の空欄に入る語は？ "This book is ( ) interesting than that one."',
      options: ['more', 'most', 'very', 'as'],
      correctAnswerIndex: 0,
      explanation: '比較級の文です。interesting のような長い単語の比較級は more を前に置きます。'
    }
  ],
  '中学3年 英語': [
    {
      question: '「私は3年間東京に住んでいます（継続）」を表す英語の空欄に入る語は？ "I ( ) in Tokyo for three years."',
      options: ['lived', 'have lived', 'has lived', 'am living'],
      correctAnswerIndex: 1,
      explanation: '過去から現在までの継続を表す現在完了形（have + 過去分詞）を使います。主語が I なので have lived となります。'
    },
    {
      question: '「これは日本で作られた車です」を表す英語の空欄に入る語は？ "This is a car ( ) was made in Japan."',
      options: ['who', 'which', 'whom', 'where'],
      correctAnswerIndex: 1,
      explanation: '先行詞 a car（物）を修飾する主格の関係代名詞 which (または that) を使います。'
    }
  ],
  '理科': [
    {
      question: '植物の葉に日光が当たることで、二酸化炭素と水からデンプンと酸素を作る働きを何という？',
      options: ['呼吸', '光合成', '蒸散', '吸収'],
      correctAnswerIndex: 1,
      explanation: '光のエネルギーを利用して有機物を作る「光合成」です。酸素が放出されます。'
    },
    {
      question: '地震の揺れのうち、最初に届き小さな揺れを引き起こす波を何という？',
      options: ['S波', 'P波', '初期微動', '主要動'],
      correctAnswerIndex: 1,
      explanation: 'もっとも速いプライマリー（Primary）な波である「P波」です。'
    }
  ],
  '社会': [
    {
      question: '日本の本州、四国、九州の間に広がる、古くから海上交通の要衝となっている海を何という？',
      options: ['日本海', 'オホーツク海', '瀬戸内海', '太平洋'],
      correctAnswerIndex: 2,
      explanation: '本州、四国、九州に囲まれた風穏やかな内海「瀬戸内海」です。'
    },
    {
      question: '1603年に江戸幕府を開き、長きにわたる平穏な江戸時代の礎を築いた武将は誰？',
      options: ['織田信長', '豊臣秀吉', '徳川家康', '足利尊氏'],
      correctAnswerIndex: 2,
      explanation: '関ヶ原の戦いに勝利し、江戸幕府の初代将軍となった「徳川家康」です。'
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
  // 1. Exact match checking
  if (FALLBACK_QUIZZES[subjectName]) return FALLBACK_QUIZZES[subjectName];

  let cleanSubject = subjectName.trim();

  if (cleanSubject.includes('正負の数')) return generatePositiveNegativeQuestions();
  if (cleanSubject.includes('一次方程式')) return generateEquationQuestions();
  if (cleanSubject.includes('文字の式')) return generateAlgebraQuestions();
  if (cleanSubject.includes('比例と反比例')) return generateProportionQuestions();
  if (cleanSubject.includes('平面図形')) return generateGeometryQuestions();
  if (cleanSubject.includes('空間図形')) return generateSolidGeometryQuestions();

  // Parse "中学1年 数学" or "中1 数学" etc.
  const gradeMatch = subjectName.match(/(中学[1-3]年|中[1-3])\s*(.*)/);
  if (gradeMatch) {
    const grade = gradeMatch[1];
    const sub = gradeMatch[2].trim();
    
    let normalizedGrade = grade;
    if (grade.startsWith('中') && !grade.endsWith('年')) {
      const num = grade.replace('中', '');
      normalizedGrade = `中学${num}年`;
    }

    const gradeSubjectKey = `${normalizedGrade} ${sub}`;
    if (FALLBACK_QUIZZES[gradeSubjectKey]) return FALLBACK_QUIZZES[gradeSubjectKey];
    if (FALLBACK_QUIZZES[sub]) return FALLBACK_QUIZZES[sub];
    cleanSubject = sub;
  }

  if (cleanSubject === '数学' || cleanSubject.includes('算数')) return FALLBACK_QUIZZES['数学'];
  if (cleanSubject === '国語') return FALLBACK_QUIZZES['国語'];
  if (cleanSubject === '英語') return FALLBACK_QUIZZES['英語'];
  if (cleanSubject === '理科') return FALLBACK_QUIZZES['理科'] || FALLBACK_QUIZZES['数学'];
  if (cleanSubject === '社会') return FALLBACK_QUIZZES['社会'] || FALLBACK_QUIZZES['国語'];

  return FALLBACK_QUIZZES[subjectName] || [
    {
      question: `${subjectName}に関する問題です。1 + 1 は？`,
      options: ['1', '2', '3', '4'],
      correctAnswerIndex: 1,
      explanation: 'これはサンプル問題です。'
    }
  ];
};
