
import React, { useState } from 'react';
import { Subject, ReviewResult } from '../types';
import Icon from './Icon';
import QuizComponent from './QuizComponent';

interface ReviewViewProps {
  subjects: Subject[];
  apiKey: string;
  reviewResults: ReviewResult[];
  onSaveResult: (result: ReviewResult) => void;
  onOpenSettings: () => void;
}

const ReviewView: React.FC<ReviewViewProps> = ({ subjects, apiKey, reviewResults, onSaveResult, onOpenSettings }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);

  const handleStartReview = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsQuizActive(true);
  };

  const handleQuizComplete = (result: ReviewResult) => {
    onSaveResult(result);
    setIsQuizActive(false);
    setSelectedSubject(null);
  };

  if (isQuizActive && selectedSubject) {
    return (
      <div className="min-h-screen flex flex-col animate-fade-in">
        <QuizComponent
          subjectId={selectedSubject.id}
          subjectName={selectedSubject.name}
          apiKey={apiKey}
          onComplete={handleQuizComplete}
          onCancel={() => setIsQuizActive(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            復習・テスト
          </h2>
          <p className="text-slate-500 text-lg font-medium max-w-md">
            Gemini AI またはプリセット問題で、各単元の理解度をチェックしましょう。
          </p>
        </div>
        {!apiKey && (
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-xs font-bold shadow-sm">
              <Icon name="info" className="w-4 h-4" />
              <span>APIキー未設定: プリセット問題を使用中</span>
            </div>
            <button 
              onClick={onOpenSettings}
              className="group text-sm font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-2 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <Icon name="settings" className="w-4 h-4" />
              </div>
              <span className="underline underline-offset-4">APIキーを設定してAI問題を生成</span>
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {subjects.map((subject) => {
          const results = reviewResults.filter(r => r.subjectId === subject.id);
          const lastResult = results.length > 0 ? results[results.length - 1] : null;
          const bestResult = results.length > 0 ? [...results].sort((a, b) => b.score - a.score)[0] : null;

          return (
            <div 
              key={subject.id}
              className="group relative bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-500 flex flex-col"
            >
              <div className="flex items-start justify-between mb-8">
                <div 
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transform group-hover:rotate-6 transition-transform duration-500"
                  style={{ backgroundColor: subject.color }}
                >
                  <Icon name={subject.icon || 'book-open'} className="w-8 h-8" />
                </div>
                {bestResult && (
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Best</p>
                    <p className="text-2xl font-black text-indigo-600 leading-none">
                      {bestResult.score}<span className="text-sm text-slate-400 font-bold ml-1">/ {bestResult.total}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-2">
                  {subject.goal}
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                {lastResult && (
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Icon name="calendar" className="w-3.5 h-3.5" />
                      {new Date(lastResult.date).toLocaleDateString()}
                    </span>
                    <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                      前回: {lastResult.score}/{lastResult.total}
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => handleStartReview(subject)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-slate-200 group-hover:scale-[1.02]"
                >
                  <Icon name="play" className="w-5 h-5 fill-current" />
                  テストを開始
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {reviewResults.length > 0 && (
        <section className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
          
          <div className="relative flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Icon name="history" className="w-6 h-6" />
              </div>
              学習のあゆみ
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[...reviewResults].reverse().slice(0, 5).map((result, idx) => {
              const subject = subjects.find(s => s.id === result.subjectId);
              return (
                <div 
                  key={idx} 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 hover:bg-white rounded-[2rem] border border-transparent hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 gap-4"
                >
                  <div className="flex items-center gap-5">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0" 
                      style={{ backgroundColor: subject?.color || '#ccc' }}
                    >
                      <Icon name={subject?.icon || 'book'} className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900">{subject?.name || '不明な科目'}</p>
                      <p className="text-sm font-bold text-slate-400 flex items-center gap-1.5 mt-1">
                        <Icon name="clock" className="w-3.5 h-3.5" />
                        {new Date(result.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-8 px-2 sm:px-0">
                    <div className="text-right">
                      <p className="text-3xl font-black text-indigo-600 leading-none">{result.score}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Score</p>
                    </div>
                    <div className="h-12 w-px bg-slate-200 hidden sm:block"></div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-slate-300 leading-none">{result.total}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Total</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ReviewView;
