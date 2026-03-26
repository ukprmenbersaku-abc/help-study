
import React, { useState } from 'react';
import { Subject, ReviewResult } from '../types';
import Icon from './Icon';
import QuizComponent from './QuizComponent';

interface ReviewViewProps {
  subjects: Subject[];
  apiKey: string;
  reviewResults: ReviewResult[];
  onSaveResult: (result: ReviewResult) => void;
}

const ReviewView: React.FC<ReviewViewProps> = ({ subjects, apiKey, reviewResults, onSaveResult }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);

  const handleStartReview = (subject: Subject) => {
    if (!apiKey) {
      alert('Gemini APIキーを設定してください。設定メニューから設定できます。');
      return;
    }
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
      <div className="bg-white rounded-3xl shadow-xl p-6 min-h-[500px] flex flex-col">
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
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">復習・テスト</h2>
        <p className="text-slate-500 font-medium">Geminiを使って、各単元の理解度をチェックしましょう。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const results = reviewResults.filter(r => r.subjectId === subject.id);
          const lastResult = results.length > 0 ? results[results.length - 1] : null;
          const bestResult = results.length > 0 ? [...results].sort((a, b) => b.score - a.score)[0] : null;

          return (
            <div 
              key={subject.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: subject.color }}
                >
                  <Icon name="book-open" className="w-6 h-6" />
                </div>
                {bestResult && (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Best Score</span>
                    <span className="text-lg font-bold text-indigo-600">{bestResult.score} / {bestResult.total}</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {subject.name}
              </h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2 h-10">
                {subject.goal}
              </p>

              <div className="space-y-4">
                {lastResult && (
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                    <span>前回: {new Date(lastResult.date).toLocaleDateString()}</span>
                    <span className="font-bold text-slate-600">{lastResult.score}/{lastResult.total}</span>
                  </div>
                )}
                
                <button
                  onClick={() => handleStartReview(subject)}
                  className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 border border-slate-200 hover:border-indigo-600"
                >
                  <Icon name="play" className="w-4 h-4" />
                  復習を始める
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {reviewResults.length > 0 && (
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Icon name="history" className="w-6 h-6 text-indigo-500" />
            最近の学習履歴
          </h3>
          <div className="space-y-3">
            {[...reviewResults].reverse().slice(0, 5).map((result, idx) => {
              const subject = subjects.find(s => s.id === result.subjectId);
              return (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 rounded-full" style={{ backgroundColor: subject?.color || '#ccc' }}></div>
                    <div>
                      <p className="font-bold text-slate-800">{subject?.name || '不明な科目'}</p>
                      <p className="text-xs text-slate-400">{new Date(result.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">{result.score} / {result.total}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</p>
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
