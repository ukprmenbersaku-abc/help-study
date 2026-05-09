
import React, { useState } from 'react';
import Icon from './Icon';
import { View } from '../App';
import { Article } from '../types';

interface ArticlesViewProps {
  onNavigate: (view: View) => void;
}

const ARTICLES: Article[] = [
  {
    id: 'how-to-use',
    title: 'Study-side の使い方ガイド',
    category: 'チュートリアル',
    date: '2026-04-29',
    icon: 'info',
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
    `
  },
  {
    id: 'history-clans',
    title: '「源・北条・足利」をごっちゃにしない！歴史人物まとめ',
    category: '社会',
    date: '2026-05-05',
    icon: 'globe',
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

- **足利 尊氏（たかうじ）**: 室町幕府を開いた初代将軍。
- **足利 義満（よしみつ）**: 第3代将軍。金閣（鹿苑寺）を建て、日明貿易（勘合貿易）を始めて幕府の全盛期を築いた。
- **足利 義政（よしまさ）**: 第8代将軍。銀閣（慈照寺）を建て、東山文化を広めた。応仁の乱のきっかけにもなった人物。

---
## まとめ：覚え方のコツ
- **源氏** ＝ 鎌倉幕府の **「将軍」**
- **北条氏** ＝ 鎌倉幕府を操る **「執権」** （将軍じゃない！）
- **足利氏** ＝ 室町幕府の **「将軍」**

「鎌倉 ＝ 源 ＆ 北条」、「室町 ＝ 足利」という時代ごとのセットで覚えると、名前が混ざらなくなりますよ！
    `
  }
];

const CATEGORY_THEMES: Record<string, { bg: string; text: string; accent: string; light: string }> = {
  '社会': { bg: 'bg-amber-100', text: 'text-amber-700', accent: 'bg-amber-600', light: 'bg-amber-50' },
  '国語': { bg: 'bg-red-100', text: 'text-red-700', accent: 'bg-red-600', light: 'bg-red-50' },
  '数学': { bg: 'bg-blue-100', text: 'text-blue-700', accent: 'bg-blue-600', light: 'bg-blue-50' },
  '理科': { bg: 'bg-emerald-100', text: 'text-emerald-700', accent: 'bg-emerald-600', light: 'bg-emerald-50' },
  '英語': { bg: 'bg-indigo-100', text: 'text-indigo-700', accent: 'bg-indigo-600', light: 'bg-indigo-50' },
  'チュートリアル': { bg: 'bg-slate-100', text: 'text-slate-700', accent: 'bg-indigo-600', light: 'bg-slate-50' },
  'default': { bg: 'bg-slate-100', text: 'text-slate-700', accent: 'bg-slate-600', light: 'bg-slate-50' }
};

const ArticlesView: React.FC<ArticlesViewProps> = ({ onNavigate }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    const theme = CATEGORY_THEMES[selectedArticle.category] || CATEGORY_THEMES.default;

    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <button 
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-bold group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <Icon name="chevronLeft" className="w-5 h-5" />
          </div>
          記事一覧に戻る
        </button>

        <article className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden mb-12">
          <div className={`${theme.accent} p-8 md:p-12 text-white relative overflow-hidden`}>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                  {selectedArticle.category}
                </span>
                <span className="text-white/80 text-sm font-bold flex items-center gap-1">
                  <Icon name="calendar" className="w-4 h-4" />
                  {selectedArticle.date}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-0 leading-[1.2] drop-shadow-sm">
                {selectedArticle.title}
              </h1>
            </div>
          </div>
          
          <div className="p-8 md:p-16 prose prose-slate max-w-none">
            {selectedArticle.content.split('\n').filter(l => l.trim() !== '').map((line, i) => {
              const trimmed = line.trim();
              
              const parseInlines = (text: string) => {
                const parts = text.split(/(\*\*.*?\*\*)/);
                return parts.map((part, idx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={idx} className={`font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded-md border-b-2 ${theme.accent.replace('bg-', 'border-')} mx-0.5`}>{part.slice(2, -2)}</strong>;
                  }
                  return part;
                });
              };

              if (trimmed.startsWith('# ')) {
                return (
                  <h1 key={i} className="text-4xl md:text-5xl font-black text-slate-800 mb-12 mt-4 text-center">
                    {parseInlines(line.replace('# ', ''))}
                    <div className={`h-2 w-24 ${theme.accent} mx-auto mt-6 rounded-full opacity-30`}></div>
                  </h1>
                );
              }

              if (trimmed.startsWith('## ')) {
                const title = trimmed.replace('## ', '');
                return (
                  <div key={i} className={`mt-16 mb-8 p-6 md:p-8 rounded-[2rem] ${theme.bg} border-2 ${theme.accent.replace('bg-', 'border-')} shadow-inner`}>
                    <h2 className={`text-2xl md:text-3xl font-black ${theme.text} flex items-center gap-4`}>
                      <div className={`w-12 h-12 rounded-2xl ${theme.accent} text-white flex items-center justify-center shadow-lg`}>
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
                    <div key={i} className="bg-white rounded-3xl p-6 mb-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex gap-5 items-start">
                        <div className={`mt-1 w-8 h-8 rounded-xl ${theme.bg} ${theme.text} flex-shrink-0 flex items-center justify-center font-black text-lg`}>
                           {i % 4 === 0 ? '✦' : i % 4 === 1 ? '◆' : i % 4 === 2 ? '■' : '▲'}
                        </div>
                        <div className="text-slate-700 leading-relaxed">
                            {label && desc.length > 0 ? (
                                <>
                                    <strong className="text-slate-900 block font-black text-xl mb-1">{parseInlines(label)}</strong>
                                    <span className="text-slate-600 text-lg">{parseInlines(desc.join(':'))}</span>
                                </>
                            ) : (
                                <span className="font-bold text-lg">{parseInlines(content)}</span>
                            )}
                        </div>
                    </div>
                  );
              }

              if (trimmed === '---') {
                return <div key={i} className="my-16 flex justify-center items-center gap-4 text-slate-200"><div className="h-px w-20 bg-current"></div><Icon name="sparkles" className="w-6 h-6 opacity-40" /><div className="h-px w-20 bg-current"></div></div>;
              }

              if (trimmed.includes('まとめ：') || trimmed.includes('覚え方のコツ')) {
                return (
                   <div key={i} className={`bg-slate-900 rounded-[2.5rem] p-10 my-12 text-white relative overflow-hidden shadow-2xl group`}>
                      <div className={`absolute top-0 right-0 w-48 h-48 ${theme.accent} rounded-full -mr-20 -mt-20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                      <h3 className={`text-2xl font-black mb-6 flex items-center gap-3 relative z-10`}>
                        <div className={`w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center`}>
                          <Icon name="lightbulb" className="w-6 h-6 text-yellow-400" />
                        </div>
                        今日の大事なポイント！
                      </h3>
                      <div className="text-slate-200 leading-loose font-bold text-xl relative z-10">
                        {parseInlines(trimmed)}
                      </div>
                   </div>
                );
              }

              return (
                <p key={i} className="text-slate-600 leading-loose mb-8 text-xl font-medium px-2">
                  {parseInlines(line)}
                </p>
              );
            })}
          </div>
        </article>

        <div className={`mt-10 ${theme.bg} rounded-[3rem] p-10 text-center border-4 border-white shadow-xl relative overflow-hidden`}>
            <div className="relative z-10">
              <h3 className={`text-2xl font-black ${theme.text} mb-3`}>知識は力なり！</h3>
              <p className={`${theme.text} opacity-80 mb-8 font-bold`}>今日学んだことを忘れないうちに、タスクを完了させましょう。</p>
              <button 
                  onClick={() => onNavigate('home')}
                  className={`${theme.accent} text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-all active:scale-95 flex items-center gap-3 mx-auto`}
              >
                  <Icon name="home" className="w-6 h-6" />
                  ホームに戻って学習を続ける
              </button>
            </div>
            {/* Decoration */}
            <div className="absolute top-1/2 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 blur-xl"></div>
            <div className="absolute top-1/2 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 blur-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto pb-20">
      <div className="relative p-10 rounded-[3rem] bg-white shadow-xl border border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Icon name="book-open" className="w-10 h-10" />
              </div>
              <div>
                学習記事ラボ
                <p className="text-slate-500 font-bold text-lg mt-1 tracking-normal">
                  スキマ時間で知識をアップデート！
                </p>
              </div>
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ARTICLES.map(article => {
          const theme = CATEGORY_THEMES[article.category] || CATEGORY_THEMES.default;
          return (
            <div 
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-200 cursor-pointer transition-all hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Category light bg highlight */}
              <div className={`absolute top-0 left-0 w-full h-2 ${theme.accent}`}></div>
              
              <div className={`w-14 h-14 ${theme.bg} ${theme.text} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <Icon name={article.icon || 'book-open'} className="w-8 h-8" />
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className={`${theme.bg} ${theme.text} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>
                  {article.category}
                </span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Icon name="calendar" className="w-3 h-3" />
                  {article.date}
                </span>
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                {article.title}
              </h3>
              
              <p className="text-slate-500 font-medium text-sm line-clamp-3 leading-relaxed mb-6">
                {article.content.replace(/[#*-]/g, '').trim()}
              </p>

              <div className="flex items-center text-indigo-600 font-black text-sm gap-1 group-hover:gap-2 transition-all">
                記事を読む
                <Icon name="chevronRight" className="w-4 h-4" />
              </div>
            </div>
          );
        })}

        {/* Placeholder for more articles */}
        <div className="bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-10 text-center min-h-[320px] transition-all hover:bg-slate-100">
           <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-slate-300 mb-6 scale-110">
             <Icon name="plus" className="w-8 h-8" />
           </div>
           <p className="text-slate-400 font-black text-xl">Coming Soon...</p>
           <p className="text-slate-400 font-bold text-sm mt-2 max-w-[200px]">
             新しい解説記事や学習ハックを準備中です！お楽しみに！
           </p>
        </div>
      </div>
    </div>
  );
};

export default ArticlesView;
