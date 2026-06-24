import React, { useState } from 'react';
import { Subject, Task } from '../types';
import Icon from './Icon';
import GeminiSuggester from './GeminiSuggester';

interface SubjectManagerProps {
    subjects: Subject[];
    setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    SIDEBAR_COLORS: string[];
    onAddSuggestedTasks: (tasks: Omit<Task, 'id' | 'isCompleted'>[]) => void;
    apiKey: string;
}

const SUBJECT_ICONS = [
    'book', 'alphabet-a', 'plus-minus', 'variable', 'equal', 'trending-up', 'shapes', 'box', 'bar-chart', 'award', 'sparkles', 'music', 'home', 'brush', 'globe', 'flask', 'math-x', 'ball'
];

const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, setSubjects, tasks, setTasks, SIDEBAR_COLORS, onAddSuggestedTasks, apiKey }) => {
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectGoal, setNewSubjectGoal] = useState('');
    const [newSubjectColor, setNewSubjectColor] = useState(SIDEBAR_COLORS[0]);
    const [newSubjectIcon, setNewSubjectIcon] = useState(SUBJECT_ICONS[0]);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    // Auto-select icon based on subject name
    React.useEffect(() => {
        const name = newSubjectName.toLowerCase();
        if (name.includes('体育') || name.includes('スポーツ') || name.includes('運動')) {
            setNewSubjectIcon('ball');
        } else if (name.includes('数学') || name.includes('算数')) {
            setNewSubjectIcon('plus-minus');
        } else if (name.includes('音楽') || name.includes('ピアノ')) {
            setNewSubjectIcon('music');
        } else if (name.includes('図工') || name.includes('美術') || name.includes('アート')) {
            setNewSubjectIcon('brush');
        } else if (name.includes('理科') || name.includes('科学')) {
            setNewSubjectIcon('flask');
        } else if (name.includes('社会') || name.includes('地理') || name.includes('歴史')) {
            setNewSubjectIcon('globe');
        } else if (name.includes('英語')) {
            setNewSubjectIcon('alphabet-a');
        } else if (name.includes('国語')) {
            setNewSubjectIcon('book');
        }
    }, [newSubjectName]);

    const handleAddSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubjectName.trim()) return;

        const newSubject: Subject = {
            id: crypto.randomUUID(),
            name: newSubjectName,
            goal: newSubjectGoal,
            color: newSubjectColor,
            icon: newSubjectIcon,
        };
        setSubjects([...subjects, newSubject]);
        setNewSubjectName('');
        setNewSubjectGoal('');
        setNewSubjectColor(SIDEBAR_COLORS[0]);
        setNewSubjectIcon(SUBJECT_ICONS[0]);
    };

    const handleUpdateSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSubject) return;
        setSubjects(subjects.map(s => s.id === editingSubject.id ? editingSubject : s));
        setEditingSubject(null);
    };

    const handleDeleteSubject = (subjectId: string) => {
        if (window.confirm('この教科を削除しますか？関連する全てのタスクも削除されます。')) {
            setSubjects(subjects.filter(s => s.id !== subjectId));
            setTasks(tasks.filter(t => t.subjectId !== subjectId));
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 animate-fade-in w-full max-w-4xl mx-auto px-1 sm:px-4">
            <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-4 sm:mb-6 tracking-tight flex items-center gap-2.5">
                    <Icon name="book" className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                    教科管理
                </h2>
                
                {/* Edit Form */}
                {editingSubject ? (
                    <form onSubmit={handleUpdateSubject} className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 border border-slate-200 animate-modal-enter">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg sm:text-xl text-slate-800">教科を編集</h3>
                            <button type="button" onClick={() => setEditingSubject(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <Icon name="x" className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="edit-name" className="block text-xs sm:text-sm font-bold text-slate-500 mb-1 ml-0.5">教科名</label>
                                <input
                                    id="edit-name" type="text" value={editingSubject.name}
                                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                                    className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-white text-slate-800 border border-slate-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none text-base sm:text-lg font-medium" 
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-goal" className="block text-xs sm:text-sm font-bold text-slate-500 mb-1 ml-0.5">目標</label>
                                <input
                                    id="edit-goal" type="text" value={editingSubject.goal}
                                    onChange={(e) => setEditingSubject({ ...editingSubject, goal: e.target.value })}
                                    placeholder="例: テストで90点以上取る"
                                    className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-white text-slate-800 border border-slate-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-slate-500 mb-1.5 ml-0.5">カラー</label>
                                <div className="flex flex-wrap gap-2">
                                    {SIDEBAR_COLORS.map(color => (
                                        <button 
                                            type="button" 
                                            key={color} 
                                            onClick={() => setEditingSubject({ ...editingSubject, color: color })}
                                            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full transition-all relative ${editingSubject.color === color ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : 'hover:ring-2 hover:ring-offset-1 hover:ring-slate-300'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {editingSubject.color === color && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Icon name="check" className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-slate-500 mb-1.5 ml-0.5">アイコン</label>
                                <div className="flex flex-wrap gap-2">
                                    {SUBJECT_ICONS.map(icon => (
                                        <button 
                                            type="button" 
                                            key={icon} 
                                            onClick={() => setEditingSubject({ ...editingSubject, icon: icon })}
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center border-2 ${editingSubject.icon === icon ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50'}`}
                                        >
                                            <Icon name={icon} className="w-4.5 h-4.5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 sm:gap-3 justify-end pt-2">
                            <button type="button" onClick={() => setEditingSubject(null)} className="px-4 py-2 sm:px-6 sm:py-3 bg-white text-slate-600 border border-slate-300 font-bold rounded-xl sm:rounded-2xl hover:bg-slate-50 transition active:scale-95 text-xs sm:text-sm">キャンセル</button>
                            <button type="submit" className="px-6 py-2 sm:px-8 sm:py-3 bg-indigo-600 text-white font-bold rounded-xl sm:rounded-2xl hover:bg-indigo-700 transition active:scale-95 text-xs sm:text-sm">更新</button>
                        </div>
                    </form>
                ) : (
                /* Add Form */
                    <form onSubmit={handleAddSubject} className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-slate-50/50 rounded-2xl sm:rounded-3xl mb-6 sm:mb-10 border border-slate-200">
                         <h3 className="font-bold text-lg sm:text-xl text-slate-800">新しい教科を追加</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                            <div>
                                <label htmlFor="new-name" className="block text-xs sm:text-sm font-bold text-slate-500 mb-1 ml-0.5">教科名</label>
                                <input
                                    id="new-name" type="text" value={newSubjectName}
                                    onChange={(e) => setNewSubjectName(e.target.value)}
                                    placeholder="例: 数学I"
                                    className="w-full px-4 py-2.5 sm:px-5 sm:py-3 bg-white text-slate-800 border border-slate-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none text-sm sm:text-base" 
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="new-goal" className="block text-xs sm:text-sm font-bold text-slate-500 mb-1 ml-0.5">目標</label>
                                <input
                                    id="new-goal" type="text" value={newSubjectGoal}
                                    onChange={(e) => setNewSubjectGoal(e.target.value)}
                                    placeholder="例: 期末テストで90点以上"
                                    className="w-full px-4 py-2.5 sm:px-5 sm:py-3 bg-white text-slate-800 border border-slate-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none text-sm sm:text-base"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-slate-500 mb-1.5 ml-0.5">カラー</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {SIDEBAR_COLORS.slice(0, 6).map(color => (
                                        <button 
                                            type="button" 
                                            key={color} 
                                            onClick={() => setNewSubjectColor(color)}
                                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all relative ${newSubjectColor === color ? 'ring-2 ring-offset-2 ring-indigo-500' : 'hover:ring-2 hover:ring-offset-1 hover:ring-slate-300'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {newSubjectColor === color && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Icon name="check" className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs sm:text-sm font-bold text-slate-500 mb-1.5 ml-0.5">アイコン</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {SUBJECT_ICONS.map(icon => (
                                        <button 
                                            type="button" 
                                            key={icon} 
                                            onClick={() => setNewSubjectIcon(icon)}
                                            className={`w-7.5 h-7.5 sm:w-9 sm:h-9 rounded-xl transition-all flex items-center justify-center border-2 ${newSubjectIcon === icon ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50'}`}
                                        >
                                            <Icon name={icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl sm:rounded-2xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 transform active:scale-95 group text-sm sm:text-base">
                                <Icon name="plus" className="w-5 h-5 transition-transform group-hover:rotate-90" />
                                <span>追加する</span>
                            </button>
                        </div>
                    </form>
                )}
                
                {/* Subject List */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {subjects.map(subject => (
                        <div key={subject.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl hover:border-indigo-400 transition-all duration-300 gap-3">
                            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                                <div 
                                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white transition-all flex-shrink-0" 
                                    style={{ backgroundColor: subject.color }}
                                >
                                    <Icon name={subject.icon || 'book'} className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-slate-800 text-base sm:text-lg tracking-tight truncate">{subject.name}</p>
                                    {subject.goal && <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 truncate">{subject.goal}</p>}
                                </div>
                            </div>
                            <div className="flex gap-1.5 justify-end border-t border-slate-100 sm:border-0 pt-2 sm:pt-0">
                                <button 
                                    onClick={() => setEditingSubject(subject)} 
                                    className="p-2 sm:p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                                    title="編集"
                                >
                                    <Icon name="pencil" className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <button 
                                    onClick={() => handleDeleteSubject(subject.id)} 
                                    className="p-2 sm:p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                    title="削除"
                                >
                                    <Icon name="trash" className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                     {subjects.length === 0 && !editingSubject && (
                        <div className="text-center py-10 sm:py-12 bg-slate-50/50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200 px-4">
                             <p className="text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">まだ教科がありません。<br/>新しい教科を追加して学習を始めましょう！</p>
                        </div>
                    )}
                </div>
            </div>

            <GeminiSuggester subjects={subjects} onAddSuggestedTasks={onAddSuggestedTasks} apiKey={apiKey} />
        </div>
    );
};

export default SubjectManager;
