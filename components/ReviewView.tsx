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

const GRADES = [
  { id: 'junior-1', label: '中学1年', bg: 'from-blue-500 to-indigo-600', text: 'text-blue-600', desc: '基礎をしっかり身につける段階' },
  { id: 'junior-2', label: '中学2年', bg: 'from-purple-500 to-violet-600', text: 'text-purple-600', desc: '応用力を広げ、苦手を作らない段階' },
  { id: 'junior-3', label: '中学3年', bg: 'from-rose-500 to-amber-600', text: 'text-rose-600', desc: '受験・総仕上げに向けて実践力を磨く段階' },
];

const ReviewView: React.FC<ReviewViewProps> = ({ subjects, apiKey, reviewResults, onSaveResult, onOpenSettings }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [activeGrade, setActiveGrade] = useState<'junior-1' | 'junior-2' | 'junior-3'>('junior-1');

  const handleStartReview = (subject: Subject) => {
    const gradeLabel = GRADES.find(g => g.id === activeGrade)?.label || '中学1年';
    const uniqueId = `${subject.id}-${activeGrade}`;
    setSelectedSubject({
      ...subject,
      id: uniqueId,
      name: `${gradeLabel} ${subject.name}`
    });
    setIsQuizActive(true);
  };

  const handleQuizComplete = (result: ReviewResult) => {
    onSaveResult(result);
    setIsQuizActive(false);
    setSelectedSubject(null);
  };

  if (isQuizActive && selectedSubject) {
    return (
      <div className="min-h-screen flex flex-col animate-fade-in w-full">
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
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-8 pb-12 animate-fade-in px-1.5 sm:px-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            復習・テスト
          </h2>
          <p className="text-slate-500 text-xs sm:text-base md:text-lg font-medium max-w-md">
            学年ごとの単元の理解度を Gemini AI またはプリセット問題でチェックしましょう。
          </p>
        </div>
        {!apiKey && (
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-[10px] sm:text-xs font-bold w-full md:w-auto">
              <Icon name="info" className="w-3.5 h-3.5 shrink-0" />
              <span>APIキー未設定: プリセット問題を使用中</span>
            </div>
            <button 
              onClick={onOpenSettings}
              className="group text-[11px] sm:text-sm font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-2 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <Icon name="settings" className="w-3.5 h-3.5" />
              </div>
              <span className="underline underline-offset-4">APIキーを設定してAI問題を生成</span>
            </button>
          </div>
        )}
      </header>

      {/* 学年選択タブ */}
      <div className="bg-slate-50 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-3 border border-slate-200">
        <div className="flex flex-wrap gap-1.5 p-0.5">
          {GRADES.map((grade) => {
            const isActive = activeGrade === grade.id;
            return (
              <button
                key={grade.id}
                onClick={() => setActiveGrade(grade.id as any)}
                className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all duration-300 active:scale-95 flex items-center gap-1.5 flex-grow sm:flex-grow-0 justify-center ${
                  isActive
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`}></span>
                {grade.label}
              </button>
            );
          })}
        </div>
        <div className="px-3 py-1 text-[10px] sm:text-xs font-bold text-slate-500 flex items-center gap-1.5 md:border-l md:border-slate-200">
          <Icon name="sparkles" className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
          <span>{GRADES.find(g => g.id === activeGrade)?.desc}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {subjects.map((subject) => {
          const uniqueId = `${subject.id}-${activeGrade}`;
          // 学年固有IDまたは（昔解いた互換性のための）ノーマルID
          const results = reviewResults.filter(r => r.subjectId === uniqueId || (activeGrade === 'junior-1' && r.subjectId === subject.id));
          const lastResult = results.length > 0 ? results[results.length - 1] : null;
          const bestResult = results.length > 0 ? [...results].sort((a, b) => b.score - a.score)[0] : null;

          return (
            <div 
              key={subject.id}
              className="group relative bg-white rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-slate-200 hover:border-indigo-400 transition-all duration-500 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4 sm:mb-8">
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center text-white transition-all shrink-0"
                  style={{ backgroundColor: subject.color }}
                >
                  <Icon name={subject.icon || 'book-open'} className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                {bestResult && (
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">Best</p>
                    <p className="text-xl sm:text-2xl font-black text-indigo-600 leading-none">
                      {bestResult.score}<span className="text-xs text-slate-400 font-bold ml-0.5">/ {bestResult.total}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-1.5 sm:mb-3 group-hover:text-indigo-600 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-slate-400 sm:text-slate-500 font-medium text-xs sm:text-sm leading-relaxed mb-6 line-clamp-2">
                  {GRADES.find(g => g.id === activeGrade)?.label}の範囲から出題されます。
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50 mt-1">
                {lastResult && (
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Icon name="calendar" className="w-3.5 h-3.5" />
                      {new Date(lastResult.date).toLocaleDateString()}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-black">
                      前回: {lastResult.score}/{lastResult.total}
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => handleStartReview(subject)}
                  className="w-full py-3 sm:py-4 bg-slate-950 text-white rounded-xl sm:rounded-2xl font-black hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm cursor-pointer active:scale-95 shadow-sm"
                >
                  <Icon name="play" className="w-4 h-4 fill-current shrink-0" />
                  テストを開始
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {reviewResults.length > 0 && (
        <section className="bg-white rounded-2xl sm:rounded-[3rem] p-4 sm:p-12 border border-slate-200 overflow-hidden relative shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
          
          <div className="relative flex items-center justify-between mb-6 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Icon name="history" className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              学習のあゆみ
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 relative z-10">
            {[...reviewResults].reverse().slice(0, 5).map((result, idx) => {
              const [origId, gradeKey] = result.subjectId.split('-');
              const subject = subjects.find(s => s.id === origId || s.id === result.subjectId);
              
              let displaySubjectName = subject?.name || '不明な教科';
              if (gradeKey === 'junior-1') displaySubjectName = `${subject?.name || ''} (中1)`;
              else if (gradeKey === 'junior-2') displaySubjectName = `${subject?.name || ''} (中2)`;
              else if (gradeKey === 'junior-3') displaySubjectName = `${subject?.name || ''} (中3)`;

              return (
                <div 
                  key={idx} 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-slate-50 hover:bg-white rounded-xl sm:rounded-[2rem] border border-transparent hover:border-slate-200 transition-all duration-300 gap-3 sm:gap-4"
                >
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div 
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shrink-0" 
                      style={{ backgroundColor: subject?.color || '#ccc' }}
                    >
                      <Icon name={subject?.icon || 'book'} className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-xl font-black text-slate-900 leading-snug">{displaySubjectName}</p>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 flex items-center gap-1 mt-0.5 sm:mt-1">
                        <Icon name="clock" className="w-3 h-3 text-slate-350 shrink-0" />
                        {new Date(result.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-8 px-1 py-1.5 sm:p-0 bg-slate-100/60 sm:bg-transparent rounded-lg">
                    <div className="text-center sm:text-right flex-1 sm:flex-none pl-3 sm:pl-0">
                      <p className="text-xl sm:text-3xl font-black text-indigo-600 leading-none">{result.score}</p>
                      <p className="text-[8px] sm:text-[10px] font-black text-slate-450 uppercase tracking-[0.1em] mt-0.5">Score</p>
                    </div>
                    <div className="h-6 w-px bg-slate-200/80 sm:h-12"></div>
                    <div className="text-center sm:text-right flex-1 sm:flex-none pr-3 sm:pr-0">
                      <p className="text-xl sm:text-3xl font-black text-slate-350 leading-none">{result.total}</p>
                      <p className="text-[8px] sm:text-[10px] font-black text-slate-450 uppercase tracking-[0.1em] mt-0.5">Total</p>
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
