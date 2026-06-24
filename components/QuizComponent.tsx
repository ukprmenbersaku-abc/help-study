import React, { useState, useEffect } from 'react';
import { QuizQuestion, ReviewResult } from '../types';
import { generateReviewQuestions } from '../services/geminiService';
import { getFallbackQuestions } from '../services/fallbackQuizService';
import Icon from './Icon';

interface QuizComponentProps {
  subjectId: string;
  subjectName: string;
  apiKey: string;
  onComplete: (result: ReviewResult) => void;
  onCancel: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ subjectId, subjectName, apiKey, onComplete, onCancel }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isGemini, setIsGemini] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      if (apiKey) {
        const data = await generateReviewQuestions(subjectName, apiKey);
        if (data) {
          setQuestions(data);
          setIsGemini(true);
        } else {
          // Fallback if Gemini fails
          setQuestions(getFallbackQuestions(subjectName));
          setIsGemini(false);
        }
      } else {
        // No API Key, use fallback
        setQuestions(getFallbackQuestions(subjectName));
        setIsGemini(false);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [subjectName, apiKey]);

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    onComplete({
      subjectId,
      score,
      total: questions.length,
      date: new Date().toISOString(),
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 space-y-6 animate-fade-in min-h-[300px] sm:min-h-[400px] w-full">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-100 rounded-full"></div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-center space-y-1.5">
          <p className="text-lg sm:text-xl font-black text-slate-800">問題を準備中...</p>
          <p className="text-[10px] sm:text-sm text-slate-400 font-bold uppercase tracking-widest">Generating Questions</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-6 sm:p-12 text-center space-y-6 shadow-sm max-w-lg mx-auto bg-white rounded-2xl border my-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 text-rose-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto">
          <Icon name="alert-circle" className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-black text-slate-800">エラーが発生しました</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">問題の生成に失敗しました。もう一度お試しください。</p>
        </div>
        <button 
          onClick={onCancel} 
          className="px-6 py-3.5 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black hover:bg-slate-850 transition-all active:scale-95 text-xs sm:text-sm w-full"
        >
          戻る
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-8 text-center animate-modal-enter space-y-6 sm:space-y-8 w-full">
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-600 text-white rounded-2xl sm:rounded-[2.5rem] flex items-center justify-center mx-auto rotate-3 shadow-md">
            <Icon name="award" className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-9 h-9 sm:w-12 sm:h-12 bg-amber-400 text-white rounded-xl sm:rounded-2xl flex items-center justify-center rotate-12">
            <Icon name="star" className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
          </div>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">復習完了！</h3>
          <p className="text-xs sm:text-lg text-slate-500 font-bold">お疲れ様でした。結果を確認しましょう。</p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 border-2 border-slate-100 shadow-sm">
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 sm:mb-2">スコア</p>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-4xl sm:text-6xl font-black text-indigo-600">{score}</span>
            <span className="text-lg sm:text-2xl font-black text-slate-300">/ {questions.length}</span>
          </div>
        </div>

        <button
          onClick={handleFinish}
          className="w-full py-4 sm:py-6 bg-slate-950 text-white rounded-xl sm:rounded-[1.5rem] font-black hover:bg-indigo-600 transition-all duration-300 text-sm sm:text-xl active:scale-95 shadow-sm"
        >
          結果を保存して戻る
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto w-full px-1.5 sm:px-4 py-3 sm:py-6 animate-modal-enter flex flex-col h-full">
      {/* Header & Progress */}
      <div className="mb-4 sm:mb-8 flex-shrink-0">
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <h4 className="text-[10px] sm:text-xs font-black text-indigo-600 uppercase tracking-[0.15em] truncate max-w-[200px]">
              {subjectName}
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-xl font-black text-slate-800">
                問題 {currentIndex + 1}
              </span>
              <span className="text-slate-400 font-bold text-xs sm:text-base">/ {questions.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] sm:text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
              {isGemini ? 'Gemini AI' : 'プリセット'}
            </span>
            <button 
              onClick={onCancel} 
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-450 hover:bg-rose-50 hover:text-rose-500 transition-all duration-200"
            >
              <Icon name="x" className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 sm:h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-grow space-y-4 sm:space-y-8">
        {/* Question Card */}
        <div className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="p-4.5 sm:p-10 md:p-12">
            <h3 className="text-base sm:text-xl md:text-3xl font-extrabold text-slate-800 mb-6 sm:mb-12 leading-relaxed tracking-tight">
              {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-1 gap-2.5 sm:gap-4">
              {currentQuestion.options.map((option, idx) => {
                let stateClasses = 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 text-slate-700';
                let iconContainerClasses = 'bg-slate-100 text-slate-500';
                
                if (selectedOption !== null) {
                  if (idx === currentQuestion.correctAnswerIndex) {
                    stateClasses = 'bg-emerald-50 border-emerald-500 text-emerald-800';
                    iconContainerClasses = 'bg-emerald-500 text-white';
                  } else if (idx === selectedOption) {
                    stateClasses = 'bg-rose-50 border-rose-500 text-rose-800';
                    iconContainerClasses = 'bg-rose-500 text-white';
                  } else {
                    stateClasses = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                    iconContainerClasses = 'bg-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`group relative w-full p-3 sm:p-5 text-left border rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center gap-3 ${stateClasses} ${selectedOption === null ? 'active:scale-[0.98] cursor-pointer' : ''}`}
                  >
                    <span className={`w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-base font-black shrink-0 transition-colors duration-200 ${iconContainerClasses}`}>
                      {selectedOption !== null && idx === currentQuestion.correctAnswerIndex ? (
                        <Icon name="check" className="w-4.5 h-4.5" />
                      ) : selectedOption !== null && idx === selectedOption ? (
                        <Icon name="x" className="w-4.5 h-4.5" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>
                    <span className="font-bold text-sm sm:text-lg leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Explanation & Next Action */}
        <div className="space-y-3 sm:space-y-6 pb-6 text-slate-800">
          {showExplanation && (
            <div className="bg-indigo-950 text-white rounded-2xl sm:rounded-[2rem] p-4.5 sm:p-8 animate-fade-in border border-indigo-900 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon name="info" className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest opacity-85">解説</span>
              </div>
              <p className="text-xs sm:text-base font-semibold leading-relaxed opacity-95">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {selectedOption !== null && (
            <button
              onClick={handleNext}
              className="w-full py-4 sm:py-5 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black hover:bg-indigo-600 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-lg group"
            >
              <span>{currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}</span>
              <Icon name="arrow-right" className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
