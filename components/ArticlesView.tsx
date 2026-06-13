import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Icon from './Icon';
import { View } from '../App';
import { Article } from '../types';
import MeshBackground from './MeshBackground';

interface ArticlesViewProps {
  onNavigate: (view: View) => void;
  onReadArticle?: (articleId: string) => void;
}

const ARTICLES: Article[] = [
  {
    id: 'how-to-use',
    title: 'Study-side の使い方ガイド',
    category: 'チュートリアル',
    date: '2026-04-29',
    icon: 'info',
    tags: ['使い方', '入門', '全学年'],
    relatedWords: ['チュートリアル', '初心者', '操作方法', 'ガイド', '始め方'],
    content: `
# Study-side へようこそ！

Study-side は、あなたの学習を最大限にサポートするためのデジタル学習手帳です。
このガイドでは、Study-side の主な機能と効果的な使い方をご紹介します。

## 1. 教科の管理
まずは「教科管理」から、あなたが学習している教科を登録しましょう。
各教科に目標（ゴール）を設定することで、モチベーションを維持しやすくなります。

## 2. タスクの登録と完了
カレンダーやホーム画面からタスクを登録できます。
- **学習**: 日々の勉強予定。時間を設定すると、完了時にXP（経験値）が獲得できます。
- **提出・期限**: 宿題やテストの締め切り。期限が近づくとアラートが表示されます。

タスクを完了してチェックを入れると、レベルアップに必要なXPが貯まります！

## 3. 復習・テスト機能
Gemini AI を活用して、学習内容に基づいたクイズを生成できます。
「復習・テスト」画面で教科を選択し、AIに問題を提案してもらいましょう。
解いた結果は履歴として残り、自分の苦手な部分を把握するのに役立ちます。

## 4. 学習検索
何から手をつけていいか分からないときは「学習検索」を利用してください。
教科やトピックを入力すると、Gemini AI がおすすめの学習方法やステップを提案してくれます。

## 5. ゲーミフィケーション
勉強すればするほど、あなたの「レベル」が上がり、「バッジ」を獲得できます。
自分の成長を可視化することで、楽しく勉強を続けましょう。

---
Study-side を活用して、理想の学習習慣を身につけましょう！

## 更新履歴（アップデート情報）

- **v1.3.0 (2026-05-23)**: 「このツールについて」詳細画面＆多機能「似た検索」一覧を追加。ホーム画面のアクション構成を最適化。
- **v1.2.0 (2026-05-09)**: 記事タグ機能（全学年向け/学年別）を追加。UIの視認性を向上し、履歴データを整理。
- **v1.1.0 (2026-05-05)**: Gemini AIによる復習クイズ作成・学習検索機能を追加。
- **v1.0.0 (2026-04-29)**: 初版リリース。主要な学習管理機能を実装。
    `
  },
  {
    id: 'history-clans',
    title: '「源・北条・足利」をごっちゃにしない！歴史人物まとめ',
    category: '社会',
    date: '2026-05-05',
    icon: 'globe',
    tags: ['中1', '中2', '歴史', '暗記'],
    relatedWords: ['鎌倉時代', '室町時代', '将軍', '執権', '武士', '覚え方'],
    content: `
# 「源・北条・足利」をごっちゃにしない！歴史人物まとめ

歴史のテストでよく迷うのが「源（みなもと）」「北条（ほうじょう）」「足利（あしかが）」の名字を持つ人々です。
時代背景と役職をセットで、スッキリ整理しましょう！

## 1. 源氏（みなもと）｜鎌倉幕府を開いたリーダー
源氏は「武士」のトップとして、初めて本格的な武家政権を作りました。

- **源 頼朝（よりとも）**: 鎌倉幕府を開いた初代将軍（1192年）。
- **源 義経（よしつね）**: 頼朝の弟。壇ノ浦の戦いで平氏を倒した天才的な戦いのヒーロー。

## 2. 北条氏（ほうじょう）｜鎌倉幕府の「執権（しっけん）」
源氏の将軍が3代で途絶えた後、実権を握ったのが「北条氏」です。彼らは将軍ではなく「執権」という役職で政治を行いました。

- **北条 政子（まさこ）**: 頼朝の妻。「尼将軍」と呼ばれ、頼朝の死後も幕府を支えた。
- **北条 泰時（やすとき）**: 第3代執権。「御成敗式目（ごせいばいしきもく）」を定め、武士のための公平な法律を作った。
- **北条 時宗（ときむね）**: 第8代執権。モンゴル軍が攻めてきた「元寇（げんこう）」の時に、日本を守る指揮を執った。

## 3. 足利氏（あしかが）｜室町幕府を開いたリーダー
鎌倉幕府を倒し、新しい幕府（室町幕府）を作ったのが足利氏です。また将軍の時代に戻ります。

- **足利 尊氏（たかうじ）**: 室町幕府を開いた初代将軍.
- **足利 義満（よしみつ）**: 第3代将軍. 金閣（鹿苑寺）を建て、日明貿易（勘合貿易）を始めて幕府の全盛期を築いた。
- **足利 義政（よしまさ）**: 第8代将軍. 銀閣（慈照寺）を建て、東山文化を広めた。応仁の乱のきっかけにもなった人物。

---
## まとめ：覚え方のコツ
- **源氏** ＝ 鎌倉幕府の **「将軍」**
- **北条氏** ＝ 鎌倉幕府を操る **「執権」** （将軍じゃない！）
- **足利氏** ＝ 室町幕府の **「将軍」**

「鎌倉 ＝ 源 ＆ 北条」、「室町 ＝ 足利」という時代ごとのセットで覚えると、名前が混ざらなくなりますよ！
    `
  }
];

const CATEGORY_THEMES: Record<string, { bg: string; text: string; accent: string; light: string; mesh: string }> = {
  '社会': { bg: 'bg-amber-50', text: 'text-amber-700', accent: 'bg-amber-400', light: 'bg-amber-50/50', mesh: 'bg-amber-100' },
  '国語': { bg: 'bg-rose-50', text: 'text-rose-700', accent: 'bg-rose-400', light: 'bg-rose-50/50', mesh: 'bg-rose-100' },
  '数学': { bg: 'bg-sky-50', text: 'text-sky-700', accent: 'bg-sky-400', light: 'bg-sky-50/50', mesh: 'bg-sky-100' },
  '理科': { bg: 'bg-emerald-50', text: 'text-emerald-700', accent: 'bg-emerald-400', light: 'bg-emerald-50/50', mesh: 'bg-emerald-100' },
  '英語': { bg: 'bg-indigo-50', text: 'text-indigo-700', accent: 'bg-indigo-400', light: 'bg-indigo-50/50', mesh: 'bg-indigo-100' },
  'チュートリアル': { bg: 'bg-slate-50', text: 'text-slate-700', accent: 'bg-slate-400', light: 'bg-slate-50/50', mesh: 'bg-slate-100' },
  'default': { bg: 'bg-slate-50', text: 'text-slate-700', accent: 'bg-indigo-400', light: 'bg-slate-50/50', mesh: 'bg-indigo-100' }
};

const ArticlesView: React.FC<ArticlesViewProps> = ({ onNavigate, onReadArticle }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = ARTICLES.filter(article => {
    const query = searchQuery.toLowerCase();
    const searchableText = [
      article.title,
      article.content,
      article.category,
      ...(article.tags || []),
      ...(article.relatedWords || []),
    ].join(' ').toLowerCase();

    return searchableText.includes(query);
  });

  if (selectedArticle) {
    const theme = CATEGORY_THEMES[selectedArticle.category] || CATEGORY_THEMES.default;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6"
      >
        <button 
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all mb-6 font-bold group"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center transition-all group-active:scale-95">
            <Icon name="chevronLeft" className="w-5 h-5" />
          </div>
          <span className="tracking-tight text-sm">記事一覧へ戻る</span>
        </button>

        <article className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden mb-12 relative">
          <div className="relative p-10 md:p-14 overflow-hidden bg-white/40 backdrop-blur-xl">
            {/* Mesh Background for Detail Header */}
            <MeshBackground intensity="opacity-100" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className={`${theme.bg} ${theme.text} px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/50`}>
                  {selectedArticle.category}
                </span>
                {selectedArticle.tags?.map(tag => (
                  <span key={tag} className="bg-white/60 text-slate-400 px-4 py-1.5 rounded-xl text-[10px] font-bold border border-white/20 tracking-tight">
                    #{tag}
                  </span>
                ))}
                <span className="text-slate-400 text-xs font-bold flex items-center gap-2 ml-auto bg-white/60 px-4 py-1.5 rounded-xl border border-white/20">
                  <Icon name="calendar" className="w-3.5 h-3.5 opacity-50" />
                  {selectedArticle.date}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-0 leading-[1.2] tracking-tighter text-slate-900">
                {selectedArticle.title}
              </h1>
              <div className={`h-2 w-20 ${theme.accent} mt-6 rounded-full opacity-20`}></div>
            </div>
          </div>
          
          <div className="p-8 md:p-16 prose prose-slate max-w-none">
            {selectedArticle.content.split('\n').filter(l => l.trim() !== '').map((line, i) => {
              const trimmed = line.trim();
              
              const parseInlines = (text: string) => {
                const parts = text.split(/(\*\*.*?\*\*)/);
                return parts.map((part, idx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={idx} className={`font-black text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded-md border-b-2 ${theme.accent.replace('bg-', 'border-')} mx-0.5`}>{part.slice(2, -2)}</strong>;
                  }
                  return part;
                });
              };

              if (trimmed.startsWith('# ')) {
                return (
                  <h1 key={i} className="text-3xl md:text-4xl font-black text-slate-800 mb-12 mt-4 text-center leading-tight">
                    {parseInlines(line.replace('# ', ''))}
                    <div className={`h-2 w-24 ${theme.accent} mx-auto mt-6 rounded-full opacity-20`}></div>
                  </h1>
                );
              }

              if (trimmed.startsWith('## ')) {
                const title = trimmed.replace('## ', '');
                return (
                  <div key={i} className={`mt-14 mb-8 p-8 rounded-[2rem] ${theme.bg} border border-white relative overflow-hidden`}>
                    <MeshBackground intensity="opacity-30" />
                    <h2 className={`text-xl md:text-2xl font-black ${theme.text} flex items-center gap-4 tracking-tight relative z-10`}>
                      <div className={`w-12 h-12 rounded-xl ${theme.accent} text-white flex items-center justify-center`}>
                        <Icon name="book" className="w-6 h-6" />
                      </div>
                      {parseInlines(title)}
                    </h2>
                  </div>
                );
              }

              if (trimmed.startsWith('- ')) {
                  const content = line.replace('- ', '');
                  const [label, ...desc] = content.split(':');
                  
                  return (
                    <div key={i} className="bg-white rounded-[1.5rem] p-6 mb-4 border border-slate-100 transition-all flex gap-5 items-start group">
                        <div className={`mt-1 w-9 h-9 rounded-xl ${theme.bg} ${theme.text} flex-shrink-0 flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform`}>
                           {i % 4 === 0 ? '✦' : i % 4 === 1 ? '◆' : i % 4 === 2 ? '■' : '▲'}
                        </div>
                        <div className="text-slate-700 leading-relaxed text-base">
                            {label && desc.length > 0 ? (
                                <>
                                    <strong className="text-slate-900 block font-black text-lg mb-1 tracking-tight group-hover:text-indigo-600 transition-colors">{parseInlines(label)}</strong>
                                    <span className="text-slate-600 font-medium">{parseInlines(desc.join(':'))}</span>
                                </>
                            ) : (
                                <span className="font-bold">{parseInlines(content)}</span>
                            )}
                        </div>
                    </div>
                  );
              }

              if (trimmed === '---') {
                return (
                  <div key={i} className="my-14 flex justify-center items-center gap-4 text-slate-200">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-current"></div>
                    <Icon name="sparkles" className="w-6 h-6 text-indigo-300" />
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-current"></div>
                  </div>
                );
              }

              if (trimmed.includes('まとめ：') || trimmed.includes('覚え方のコツ')) {
                return (
                   <div key={i} className={`bg-slate-900 rounded-[2rem] p-10 my-12 text-white relative overflow-hidden group border border-white/10`}>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-32 -mt-32 blur-3xl opacity-20"></div>
                      
                      <h3 className={`text-xl md:text-2xl font-black mb-6 flex items-center gap-4 relative z-10 tracking-tight`}>
                        <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md`}>
                          <Icon name="lightbulb" className="w-6 h-6 text-yellow-400" />
                        </div>
                        学習のゴールドポイント！
                      </h3>
                      <div className="text-slate-200 leading-relaxed font-bold text-lg md:text-xl relative z-10 px-2 italic">
                        {parseInlines(trimmed)}
                      </div>
                   </div>
                );
              }

              return (
                <p key={i} className="text-slate-600 leading-relaxed mb-6 text-base md:text-lg font-medium px-4 border-l-[3px] border-slate-50 hover:border-indigo-100 transition-colors">
                  {parseInlines(line)}
                </p>
              );
            })}
          </div>
        </article>

        <div className={`mt-8 bg-white rounded-[2.5rem] p-10 text-center border border-slate-100 relative overflow-hidden group`}>
            <MeshBackground intensity="opacity-100" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">知的好奇心を、習慣に。</h3>
              <p className="text-slate-500 font-bold text-base mb-8 opacity-70">今日学んだ知識は、あなたの明日を支える武器になります。</p>
              <button 
                  onClick={() => onNavigate('home')}
                  className="bg-indigo-600 text-white px-10 py-3.5 rounded-2xl font-black transition-all active:scale-95 flex items-center gap-3 mx-auto hover:bg-indigo-700"
              >
                  <Icon name="home" className="w-5 h-5" />
                  ホームへ戻る
              </button>
            </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto pb-20 px-4">
      {/* Header Section - Refined Size & Glass Search Bar */}
      <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-white border border-white overflow-hidden">
        {/* Modern Mesh Background with User Palette */}
        <MeshBackground intensity="opacity-100" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex-grow">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-white backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Learning Hub
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter leading-tight mb-2">
              学習記事集
            </h2>
            <p className="text-slate-500 font-bold text-sm md:text-base tracking-tight max-w-md mb-0 leading-relaxed opacity-80">
              世界は驚きに満ちている。<br />
              一歩先ゆく知識で、未来の色を変えよう。
            </p>
          </div>

          <div className="relative w-full lg:w-[400px] group">
             <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
             <div className="relative z-10 p-[2px] rounded-[1.6rem] bg-gradient-to-br from-indigo-100 via-white to-amber-100">
               <input 
                 type="text" 
                 placeholder="記事を検索..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-14 pr-6 py-5 bg-white/90 border-0 rounded-[1.5rem] transition-all outline-none text-lg font-bold text-slate-800 backdrop-blur-2xl placeholder:text-slate-400 placeholder:font-semibold"
               />
               <Icon name="search" className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 group-focus-within:scale-110 group-focus-within:text-indigo-600 transition-all z-20" />
               {searchQuery && (
                 <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full transition-colors z-20 border border-white"
                 >
                   <Icon name="x" className="w-4 h-4 text-slate-400" />
                 </button>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Articles Grid - Balanced Intensity */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((article, idx) => {
              const theme = CATEGORY_THEMES[article.category] || CATEGORY_THEMES.default;
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  key={article.id}
                  onClick={() => {
                    setSelectedArticle(article);
                    if (onReadArticle) {
                      onReadArticle(article.id);
                    }
                  }}
                  className="group bg-white rounded-[2.5rem] p-10 border border-white cursor-pointer transition-all hover:-translate-y-2 relative overflow-hidden flex flex-col h-full active:scale-98 duration-300"
                >
                  {/* Subtle card mesh hover */}
                  <div className={`absolute inset-0 ${theme.mesh} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  <div className={`absolute top-0 left-0 w-full h-2 ${theme.accent} opacity-30`}></div>
                  
                  <div className={`w-14 h-14 ${theme.bg} ${theme.text} rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 duration-500 relative z-10`}>
                    <Icon name={article.icon || 'book-open'} className="w-8 h-8" />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <span className={`${theme.bg} ${theme.text} px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/50`}>
                      {article.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 ml-auto">
                      <Icon name="calendar" className="w-3 h-3 opacity-50" />
                      {article.date}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors leading-tight tracking-tight relative z-10">
                    {article.title}
                  </h3>

                  {article.tags && (
                    <div className="flex flex-wrap gap-2.5 mb-6 relative z-10">
                      {article.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold text-slate-400 bg-white/80 px-3 py-1 rounded-xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-slate-500 font-medium text-base line-clamp-3 leading-relaxed mb-8 flex-grow relative z-10 opacity-70">
                    {article.content.replace(/[#*-]/g, '').trim()}
                  </p>

                  <div className="flex items-center text-indigo-600 font-black text-xs gap-2 mt-auto group-hover:gap-3 transition-all relative z-10">
                    詳しく見る
                    <Icon name="chevronRight" className="w-4 h-4" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/40 rounded-[2.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-10 text-center min-h-[350px] transition-all hover:bg-white/60 hover:border-slate-200 group"
          >
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-8 transform group-hover:scale-105 transition-transform">
               <Icon name="plus" className="w-8 h-8" />
             </div>
             <p className="text-slate-400 font-black text-xl tracking-tight">Coming Soon...</p>
             <p className="text-slate-400 font-bold text-sm mt-3 max-w-[180px] leading-relaxed opacity-60">
               新しい解説記事を<br />準備中です！
             </p>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-white rounded-[3.5rem] border border-slate-100"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Icon name="search" className="w-8 h-8 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">見つかりませんでした</h3>
          <p className="text-slate-500 font-bold text-lg max-w-sm mx-auto leading-relaxed opacity-70">
            別のキーワードを試してみてください。
          </p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-8 px-8 py-3 bg-indigo-600 text-white font-black rounded-xl active:scale-95 transition-all text-sm"
          >
            クリア
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ArticlesView;
