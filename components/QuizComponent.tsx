
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
      <div className="flex flex-col items-center justify-center p-12 space-y-6 animate-fade-in min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black text-slate-800">問題を準備中...</p>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Generating Questions</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-12 text-center space-y-6 animate-modal-enter">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto">
          <Icon name="alert-circle" className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-800">エラーが発生しました</h3>
          <p className="text-slate-500 font-medium">問題の生成に失敗しました。もう一度お試しください。</p>
        </div>
        <button 
          onClick={onCancel} 
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95"
        >
          戻る
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto p-8 text-center animate-modal-enter space-y-8">
        <div className="relative">
          <div className="w-32 h-32 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto rotate-3">
            <Icon name="award" className="w-16 h-16" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-400 text-white rounded-2xl flex items-center justify-center rotate-12">
            <Icon name="star" className="w-6 h-6 fill-current" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">復習完了！</h3>
          <p className="text-slate-500 font-bold text-lg">お疲れ様でした。結果を確認しましょう。</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">スコア</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-black text-indigo-600">{score}</span>
            <span className="text-2xl font-black text-slate-300">/ {questions.length}</span>
          </div>
        </div>

        <button
          onClick={handleFinish}
          className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-indigo-600 transition-all duration-300 text-xl active:scale-95"
        >
          結果を保存して戻る
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6 animate-modal-enter flex flex-col h-full">
      {/* Header & Progress */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h4 className="text-xs sm:text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">
              {subjectName}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold text-slate-800">
                問題 {currentIndex + 1}
              </span>
              <span className="text-slate-400 font-medium">/ {questions.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
              {isGemini ? 'Gemini AI' : 'プリセット'}
            </span>
            <button 
              onClick={onCancel} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all duration-200"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-6 sm:space-y-8">
        {/* Question Card */}
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-100 overflow-hidden">
          <div className="p-6 sm:p-10 md:p-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-8 sm:mb-12 leading-[1.4] tracking-tight">
              {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {currentQuestion.options.map((option, idx) => {
                let stateClasses = 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 text-slate-700';
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
                    className={`group relative w-full p-4 sm:p-5 text-left border-2 rounded-2xl sm:rounded-[1.5rem] transition-all duration-300 flex items-center gap-4 ${stateClasses} ${selectedOption === null ? 'active:scale-[0.98] hover:border-indigo-400' : ''}`}
                  >
                    <span className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-sm sm:text-base font-black shrink-0 transition-colors duration-300 ${iconContainerClasses}`}>
                      {selectedOption !== null && idx === currentQuestion.correctAnswerIndex ? (
                        <Icon name="check" className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : selectedOption !== null && idx === selectedOption ? (
                        <Icon name="x" className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>
                    <span className="font-bold text-base sm:text-xl leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Explanation & Next Action */}
        <div className="space-y-4 sm:space-y-6 pb-8">
          {showExplanation && (
            <div className="bg-indigo-900 text-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon name="info" className="w-4 h-4" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest opacity-80">解説</span>
              </div>
              <p className="text-base sm:text-lg font-medium leading-relaxed opacity-95">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {selectedOption !== null && (
            <button
              onClick={handleNext}
              className="w-full py-5 sm:py-6 bg-slate-900 text-white rounded-2xl sm:rounded-[1.5rem] font-black hover:bg-indigo-600 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-lg sm:text-xl group"
            >
              <span>{currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}</span>
              <Icon name="arrow-right" className="w-6 h-6 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
