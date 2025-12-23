
import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { SuggestedTask, Task, TaskType, Subject } from '../types';
import Icon from './Icon';

interface GeminiSuggesterProps {
    subjects: Subject[];
    onAddSuggestedTasks: (tasks: Omit<Task, 'id' | 'isCompleted'>[]) => void;
    apiKey: string;
}

const GeminiSuggester: React.FC<GeminiSuggesterProps> = ({ subjects, onAddSuggestedTasks, apiKey }) => {
    const [goal, setGoal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = async () => {
        if (!apiKey) {
            setError('APIキーが設定されていません。');
            return;
        }
        if (!goal.trim()) {
            setError('目標を入力してください。');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuggestedTasks([]);
        
        const tasks = await generateStudyPlan(goal, apiKey);
        
        if (tasks) {
            setSuggestedTasks(tasks);
        } else {
            setError('計画の生成に失敗しました。もう一度お試しください。');
        }
        setIsLoading(false);
    };

    const handleAddTasks = (subjectId: string) => {
        if (!subjectId) return;

        const today = new Date();
        const newTasks = suggestedTasks.map((st, index) => {
            const taskDate = new Date(today);
            taskDate.setDate(today.getDate() + index); // Spread tasks over the next few days
            return {
                title: st.title,
                subjectId: subjectId,
                date: taskDate.toISOString().split('T')[0],
                type: TaskType.STUDY,
                duration: st.estimatedHours,
            };
        });

        onAddSuggestedTasks(newTasks);
        setSuggestedTasks([]);
        setGoal('');
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mt-6 bg-gradient-to-br from-white to-indigo-50/30">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-yellow-300 to-amber-500 p-2 rounded-lg text-white shadow-md">
                   <Icon name="sparkles" className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">AI 学習プランナー</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6 ml-1">
                「2週間で物理をマスターしたい」などの目標を入力すると、AIが最適な学習スケジュールを提案します。
            </p>

            {!apiKey ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-fade-in">
                    <div className="p-3 bg-amber-100 rounded-full text-amber-600 flex-shrink-0">
                        <Icon name="settings" className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-900">APIキーの設定が必要です</h4>
                        <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                            AI機能を使用するには、画面右上の設定アイコン <span className="inline-flex align-middle bg-white rounded p-0.5 border border-amber-200"><Icon name="settings" className="w-3 h-3 text-slate-600" /></span> から
                            Google Gemini APIキーを入力してください。
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="例: 中間テストで数学80点以上取るための計画"
                        className="flex-grow px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGeneratePlan}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition flex items-center justify-center gap-2 disabled:bg-indigo-300 active:scale-95 whitespace-nowrap"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>生成中...</span>
                            </>
                        ) : (
                            '計画を提案'
                        )}
                    </button>
                </div>
            )}
            
            {error && apiKey && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm flex items-start gap-2 animate-fade-in">
                     <Icon name="x" className="w-5 h-5 flex-shrink-0" />
                     {error}
                </div>
            )}

            {suggestedTasks.length > 0 && (
                <div className="mt-6 animate-fade-in border-t border-slate-200 pt-6">
                    <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Icon name="check" className="w-5 h-5 text-green-500" />
                        提案されたタスク ({suggestedTasks.length}件)
                    </h4>
                    <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {suggestedTasks.map((task, index) => (
                            <li key={index} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-start gap-3 hover:shadow-md transition-shadow">
                                <div>
                                    <p className="font-bold text-slate-800">{task.title}</p>
                                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{task.description}</p>
                                </div>
                                <span className="flex-shrink-0 text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full whitespace-nowrap">{task.estimatedHours}時間</span>
                            </li>
                        ))}
                    </ul>
                     <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
                        <select
                            onChange={(e) => handleAddTasks(e.target.value)}
                            className="w-full sm:w-auto flex-grow px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white shadow-sm cursor-pointer"
                            defaultValue=""
                        >
                            <option value="" disabled>どの科目に追加しますか？</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                         <button onClick={() => setSuggestedTasks([])} className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">
                            キャンセル
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeminiSuggester;
