
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
  }
];

const ArticlesView: React.FC<ArticlesViewProps> = ({ onNavigate }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <button 
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-bold"
        >
          <Icon name="chevronLeft" className="w-5 h-5" />
          記事一覧に戻る
        </button>

        <article className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-8 md:p-12 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              <span className="text-white/60 text-xs font-medium">
                {selectedArticle.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-0 leading-tight">
              {selectedArticle.title}
            </h1>
          </div>
          
          <div className="p-8 md:p-12 prose prose-slate max-w-none">
            {selectedArticle.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-3xl font-black text-slate-800 mb-6 mt-8">{line.replace('# ', '')}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold text-slate-800 mb-4 mt-8 border-l-4 border-indigo-600 pl-4">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('- ')) {
                  return <li key={i} className="text-slate-600 mb-2 ml-4 list-disc">{line.replace('- ', '')}</li>;
              }
              if (line.trim() === '---') {
                return <hr key={i} className="my-8 border-slate-200" />;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              return <p key={i} className="text-slate-600 leading-relaxed mb-4">{line}</p>;
            })}
          </div>
        </article>

        <div className="mt-10 bg-indigo-50 rounded-3xl p-8 text-center border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">準備はできましたか？</h3>
            <p className="text-indigo-700/80 mb-6">さっそく今日の学習スケジュールを立ててみましょう。</p>
            <button 
                onClick={() => onNavigate('home')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
            >
                ホームに戻る
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Icon name="book-open" className="w-10 h-10 text-indigo-600" />
            学習記事を見る
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            学習のコツやツールの活用方法をチェックしましょう。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map(article => (
          <div 
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group bg-white rounded-[2rem] p-6 shadow-lg border border-slate-200 cursor-pointer transition-all hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <Icon name={article.icon || 'book-open'} className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                {article.date}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
              {article.title}
            </h3>
            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
              {article.content.replace(/[#*-]/g, '').trim()}
            </p>
          </div>
        ))}

        {/* Placeholder for more articles */}
        <div className="bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center min-h-[240px]">
           <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4">
             <Icon name="plus" className="w-6 h-6" />
           </div>
           <p className="text-slate-400 font-bold">今後の更新をお楽しみに！</p>
           <p className="text-slate-400 text-xs mt-1">学習のアドバイスや新しい機能を随時紹介していきます。</p>
        </div>
      </div>
    </div>
  );
};

export default ArticlesView;
