import React, { useState } from 'react';
import Icon from './Icon';

interface SearchOption {
  name: string;
  description: string;
  urlPattern: string; // url including [QUERY] placeholder
  icon: string;
  category: 'dictionary' | 'academic' | 'student' | 'translation';
}

const SEARCH_OPTIONS: SearchOption[] = [
  {
    name: 'Wikipedia',
    description: '歴史や科学、一般的な概念を詳しく調べられます（オンライン百科事典）',
    urlPattern: 'https://ja.wikipedia.org/wiki/[QUERY]',
    icon: 'globe',
    category: 'dictionary'
  },
  {
    name: 'Weblio 国語・国語辞典',
    description: '言葉の正確な意味や、類語・表現を調べることができます',
    urlPattern: 'https://www.weblio.jp/content/[QUERY]',
    icon: 'book',
    category: 'dictionary'
  },
  {
    name: 'コトバンク (Kotobank)',
    description: '複数の日本大百科全書から一気に用語を引ける高信頼な辞書サイト',
    urlPattern: 'https://kotobank.jp/word/[QUERY]',
    icon: 'book-open',
    category: 'dictionary'
  },
  {
    name: 'Google Scholar',
    description: '探究学習や自由研究の際に、学術論文や解説を検索できます',
    urlPattern: 'https://scholar.google.co.jp/scholar?q=[QUERY]',
    icon: 'search',
    category: 'academic'
  },
  {
    name: 'CiNii Research',
    description: '日本の学術論文や博士論文、研究データを探すのに最適な国立情報学研究所のサーチ',
    urlPattern: 'https://ciniis.rdis.nii.ac.jp/search?q=[QUERY]',
    icon: 'award',
    category: 'academic'
  },
  {
    name: 'Yahoo!きっず学習検索',
    description: '小中学生に適した、わかりやすくて安全なウェブサイトを優先して検索します',
    urlPattern: 'https://kids.yahoo.co.jp/search/results?p=[QUERY]',
    icon: 'sparkles',
    category: 'student'
  },
  {
    name: 'Google 翻訳',
    description: '入力した日本語を瞬時に英語や他の言語に変換・発音確認できます',
    urlPattern: 'https://translate.google.co.jp/?sl=ja&tl=en&text=[QUERY]&op=translate',
    icon: 'alphabet-a',
    category: 'translation'
  },
  {
    name: '英辞郎 on the WEB (ALC)',
    description: '最先端の単語やリアルな英文法例文が載っている高品質の英和・和英データベース',
    urlPattern: 'https://eow.alc.co.jp/search?q=[QUERY]',
    icon: 'alphabet',
    category: 'translation'
  },
];

const CATEGORIES = [
  { id: 'all', name: 'すべてを表示', icon: 'sparkles' },
  { id: 'dictionary', name: '言葉・辞書・百科事典', icon: 'book' },
  { id: 'student', name: '小中学校・学習向け', icon: 'home' },
  { id: 'translation', name: '翻訳・外国語', icon: 'alphabet-a' },
  { id: 'academic', name: '探究・学術・専門データ', icon: 'search' },
];

const AboutView: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleLaunchSearch = (pattern: string) => {
    const finalQuery = searchKeyword.trim() ? encodeURIComponent(searchKeyword.trim()) : '';
    // If no query, we just open the home URL of the search engine by stripping the suffix
    const finalUrl = pattern.replace('[QUERY]', finalQuery);
    window.open(finalUrl, '_blank');
  };

  const filteredOptions = activeCategory === 'all' 
    ? SEARCH_OPTIONS 
    : SEARCH_OPTIONS.filter(opt => opt.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fade-in">
      {/* Header card info */}
      <div className="bg-gradient-to-tr from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-4 text-center md:text-left">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 font-black text-xs uppercase tracking-wider border border-indigo-500/30">
              Tool Information
            </span>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Study-side について
            </h1>
            <p className="text-slate-300 font-medium leading-relaxed max-w-xl text-sm lg:text-base">
              Study-side は、学校の日程（2026年5月予定表など）と日々の家庭学習課題を美しく一本化し、XP報酬・バッジシステムを伴ったゲーム感覚で計画を実行できる「勉強・タスク管理支援プラットフォーム」です。
            </p>
          </div>
          <div className="p-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center shrink-0">
            <Icon name="info" className="w-16 h-16 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Core Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 flex gap-4 items-start shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
            <Icon name="calendar" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1">行事予定の自動ハイライト</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              「生徒総会」や「鑑賞音楽会」といった極めて重要な学校行事が自動でカレンダーに組み込まれ、重要なアイテムは視覚的に目立つ警告色とスパークルマークで表現されます。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 flex gap-4 items-start shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-2xl shrink-0">
            <Icon name="chart-bar" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1">報酬・ゲーミフィケーション</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              タスクをこなすごとに獲得できる学習経験値（XP）によってレベルアップ！また、各種条件（最初のタスク、勉強時間の節目、締め切り遵守）を満たすとバッジを解放できます。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 flex gap-4 items-start shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
            <Icon name="search" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1">学習検索 ＆ AI支援システム</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              外部のノイズを完全に遮断した高速学習検索機能を搭載。さらに、Gemini AI キーを設定することで、教科に関連したテスト対策教材をその場で自動生成可能です。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 flex gap-4 items-start shadow-sm">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl shrink-0">
            <Icon name="book" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1">カスタマイズ教科管理</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              自身に合わせた学習教科の設定ができ、新規科目の名前に応じて最適なアイコンを自動マッチ。英語教科には専用シンボルのアルファベット「A」を搭載しています。
            </p>
          </div>
        </div>
      </div>

      {/* Special Similar Searches Section */}
      <div className="bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 p-6 lg:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-800">
            <Icon name="search" className="w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight">学習用の高機能「似た検索」一覧</h2>
          </div>
          <p className="text-slate-500 font-medium text-xs sm:text-sm">
            インターネットで確実な情報を調べるための、優良な教育向・辞書系・論文系の類似検索サービスを集約しました。キーワードを入力して下部のエンジンをクリックすると、探究学習をブーストできます！
          </p>
        </div>

        {/* Unified Search Input for multi-engine launching */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-indigo-100 space-y-4 shadow-sm">
          <div className="text-xs font-black text-indigo-700">【クイック一括入力】調べたいキーワード</div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="search" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="キーワードをここに入力すると、各エンジンで一発検索できます（例：メディアリテラシー、憲法、眼科検診）"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 focus:bg-white border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-sm sm:text-base text-slate-800"
            />
          </div>
          {searchKeyword.trim() ? (
            <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-2">
              <Icon name="check" className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>「<strong className="underline">{searchKeyword.trim()}</strong>」をお好みの検索エンジンで開きましょう！</span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 font-medium">
              💡 <span>下部にある「SEO・よく間違われる検索ワード」をクリックすると、ワンタップでここにセットして検索を体験できます。</span>
            </div>
          )}
        </div>

        {/* Category filtering tab */}
        <div className="flex flex-wrap gap-1.5 border-b border-indigo-100 pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === category.id 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              <Icon name={category.icon} className="w-3.5 h-3.5" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Search grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOptions.map((opt) => (
            <div 
              key={opt.name} 
              className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                    <Icon name={opt.icon} className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">{opt.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-black">
                    {opt.category === 'dictionary' && '国語・辞書'}
                    {opt.category === 'academic' && '専門・探究'}
                    {opt.category === 'student' && '安全・学生向け'}
                    {opt.category === 'translation' && '翻訳・語学'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{opt.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold max-w-[60%] truncate">
                  {opt.urlPattern.replace('[QUERY]', searchKeyword.trim() ? searchKeyword.trim() : '検索ワード')}
                </span>
                <button
                  onClick={() => handleLaunchSearch(opt.urlPattern)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold rounded-lg transition-all active:scale-95"
                >
                  <span>検索を開く</span>
                  <Icon name="arrow-right" className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Section: Commonly Mistyped or Related Search Queries */}
      <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-2 text-indigo-900 border-b border-slate-200 pb-3">
          <Icon name="award" className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-black tracking-tight">SEO対策 ＆ 誤入力・関連想定ワード一覧</h2>
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
          Study-sideは、日本の学校予定に合わせた独自のドメイン名や英語表記を持つため、検索の際に表記揺れや誤記が発生しやすくなっています。
          ここではSEO検索エンジン評価を向上させるとともに、ユーザーが迷わずに正しい情報と機能に到達できるよう、よく間違われる文字列・類義語をインデックス化しました。
          <strong className="text-indigo-600">（※各ワードをクリックすると、上のクイック一発検索フィールドに一発自動セットされます！）</strong>
        </p>

        <div className="space-y-6">
          {/* Category 1: Standard Brand typos */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              【ブランド表記・スペルミス系】
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { word: 'StadySide', description: 'スペル誤り（Stady）' },
                { word: 'Study Side', description: 'スペース区切り' },
                { word: 'Studyside', description: 'ハイフンなし' },
                { word: 'スタディサイド', description: 'カタカナ読み' },
                { word: 'スタディーサイド', description: 'カタカナ長音符' },
                { word: 'すたでぃさいど', description: 'ひらがな' },
                { word: 'StadeySide', description: 'スペル誤り（Stadey）' },
                { word: 'SutadySido', description: 'ローマ字風誤記' },
                { word: 'スタディ・サイド', description: '中黒区切り' },
                { word: 'ｓｔｕｄｙ－ｓｉｄｅ', description: '全角英数表記' },
              ].map(item => (
                <button
                  key={item.word}
                  onClick={() => setSearchKeyword(item.word)}
                  className="bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-slate-700 flex items-center gap-1 group"
                  title={item.description}
                >
                  <span className="font-mono text-indigo-600 group-hover:text-rose-600 font-extrabold">{item.word}</span>
                  <span className="text-[9px] text-slate-400 font-medium">({item.description})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 2: Function & School Scheduled words */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              【機能的類語・目的ワード】
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { word: '勉強タスク管理', description: 'タスク管理' },
                { word: '宿題カレンダー', description: 'カレンダー' },
                { word: '家庭学習 ゲーム化', description: 'ゲーミフィケーション' },
                { word: '学校行事 2026年5月', description: '行事表示' },
                { word: '生徒総会 校内体育館', description: '学校イベント例' },
                { word: '鑑賞音楽会 近隣施設', description: '学校イベント例2' },
                { word: 'XP獲得 勉強アプリ', description: '経験値システム' },
                { word: '学習ブログ 記事解説', description: '学習指導' },
                { word: 'Gemini 復習クイズ生成', description: 'AI連動' },
                { word: '勉強時間 タイマーバッジ', description: '実績システム' },
                { word: '教科追加 アイコン変更', description: 'カスタマイズ' },
                { word: '英語 アルファベット記号A', description: '英語教科' },
              ].map(item => (
                <button
                  key={item.word}
                  onClick={() => setSearchKeyword(item.word)}
                  className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-slate-700 flex items-center gap-1 group"
                  title={item.description}
                >
                  <span className="font-mono text-slate-800 group-hover:text-indigo-700 font-extrabold">{item.word}</span>
                  <span className="text-[9px] text-slate-400 font-medium">({item.description})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 3: Regional & General Academic queries */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              【探究学習・リサーチ関連重要ワード】
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { word: 'メディアリテラシー 探究学習', description: '学習テーマ' },
                { word: 'CiNii 論文検索のコツ', description: '外部連携' },
                { word: 'Kotobank 百科事典 使い方', description: '辞書連携' },
                { word: 'デジタルノート 著作権ルール', description: '安全指導' },
                { word: '英辞郎 辞書 英語暗記', description: '語学対策' },
                { word: 'Google Scholar 引用方法', description: '研究方法' },
                { word: 'Yahooキッズ 安全にググる', description: '安全探究' },
                { word: 'みどりの日 こどもの日 由来', description: '祝日トピックス' },
              ].map(item => (
                <button
                  key={item.word}
                  onClick={() => setSearchKeyword(item.word)}
                  className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-slate-700 flex items-center gap-1 group"
                  title={item.description}
                >
                  <span className="font-mono text-slate-800 group-hover:text-emerald-700 font-extrabold">{item.word}</span>
                  <span className="text-[9px] text-slate-400 font-medium">({item.description})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
