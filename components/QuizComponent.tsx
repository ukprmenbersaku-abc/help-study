
import React, { useState, useEffect } from 'react';
import { QuizQuestion, ReviewResult } from '../types';
import { generateReviewQuestions } from '../services/geminiService';
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

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const data = await generateReviewQuestions(subjectName, apiKey);
      if (data) {
        setQuestions(data);
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
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium">Geminiが問題を生成中...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">問題の生成に失敗しました。</p>
        <button onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded-lg">戻る</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="p-8 text-center animate-modal-enter">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="award" className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">復習完了！</h3>
        <p className="text-slate-600 mb-6 text-lg">
          スコア: <span className="font-bold text-indigo-600">{score}</span> / {questions.length}
        </p>
        <button
          onClick={handleFinish}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          結果を保存して戻る
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-4 animate-modal-enter">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          問題 {currentIndex + 1} / {questions.length}
        </span>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <Icon name="x" className="w-6 h-6" />
        </button>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => {
          let bgColor = 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30';
          let textColor = 'text-slate-700';
          
          if (selectedOption !== null) {
            if (idx === currentQuestion.correctAnswerIndex) {
              bgColor = 'bg-emerald-50 border-emerald-500';
              textColor = 'text-emerald-700';
            } else if (idx === selectedOption) {
              bgColor = 'bg-rose-50 border-rose-500';
              textColor = 'text-rose-700';
            } else {
              bgColor = 'bg-slate-50 border-slate-200 opacity-50';
            }
          }

          return (
            <button
              key={idx}
              disabled={selectedOption !== null}
              onClick={() => handleAnswer(idx)}
              className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-200 flex items-center gap-3 ${bgColor} ${textColor}`}
            >
              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="font-medium">{option}</span>
              {selectedOption !== null && idx === currentQuestion.correctAnswerIndex && (
                <Icon name="check-circle" className="w-5 h-5 ml-auto text-emerald-500" />
              )}
              {selectedOption !== null && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                <Icon name="x-circle" className="w-5 h-5 ml-auto text-rose-500" />
              )}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8 animate-fade-in">
          <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
            <Icon name="info" className="w-5 h-5" />
            <span>解説</span>
          </div>
          <p className="text-indigo-900 leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      {selectedOption !== null && (
        <button
          onClick={handleNext}
          className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
        >
          {currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
          <Icon name="arrow-right" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default QuizComponent;
