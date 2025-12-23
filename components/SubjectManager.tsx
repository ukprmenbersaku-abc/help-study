
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

const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, setSubjects, tasks, setTasks, SIDEBAR_COLORS, onAddSuggestedTasks, apiKey }) => {
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectGoal, setNewSubjectGoal] = useState('');
    const [newSubjectColor, setNewSubjectColor] = useState(SIDEBAR_COLORS[0]);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const handleAddSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubjectName.trim()) return;

        const newSubject: Subject = {
            id: crypto.randomUUID(),
            name: newSubjectName,
            goal: newSubjectGoal,
            color: newSubjectColor,
        };
        setSubjects([...subjects, newSubject]);
        setNewSubjectName('');
        setNewSubjectGoal('');
        setNewSubjectColor(SIDEBAR_COLORS[0]);
    };

    const handleUpdateSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSubject) return;
        setSubjects(subjects.map(s => s.id === editingSubject.id ? editingSubject : s));
        setEditingSubject(null);
    };

    const handleDeleteSubject = (subjectId: string) => {
        if (window.confirm('この科目を削除しますか？関連する全てのタスクも削除されます。')) {
            setSubjects(subjects.filter(s => s.id !== subjectId));
            setTasks(tasks.filter(t => t.subjectId !== subjectId));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl border border-slate-200">
                <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight flex items-center gap-3">
                    <Icon name="book" className="w-8 h-8 text-indigo-600" />
                    科目管理
                </h2>
                
                {/* Edit Form */}
                {editingSubject ? (
                    <form onSubmit={handleUpdateSubject} className="space-y-6 p-6 bg-slate-50 rounded-3xl mb-8 border border-slate-200 shadow-inner animate-modal-enter">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl text-slate-800">科目を編集</h3>
                            <button type="button" onClick={() => setEditingSubject(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <Icon name="x" className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="edit-name" className="block text-sm font-bold text-slate-500 mb-1.5 ml-1">科目名</label>
                                <input
                                    id="edit-name" type="text" value={editingSubject.name}
                                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                                    className="w-full px-5 py-3 bg-white text-slate-800 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none text-lg font-medium" 
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-goal" className="block text-sm font-bold text-slate-500 mb-1.5 ml-1">目標</label>
                                <input
                                    id="edit-goal" type="text" value={editingSubject.goal}
                                    onChange={(e) => setEditingSubject({ ...editingSubject, goal: e.target.value })}
                                    placeholder="例: テストで90点以上取る"
                                    className="w-full px-5 py-3 bg-white text-slate-800 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">カラー</label>
                                <div className="flex flex-wrap gap-3">
                                    {SIDEBAR_COLORS.map(color => (
                                        <button 
                                            type="button" 
                                            key={color} 
                                            onClick={() => setEditingSubject({ ...editingSubject, color: color })}
                                            className={`w-9 h-9 rounded-full transition-all transform hover:scale-110 shadow-sm relative ${editingSubject.color === color ? 'ring-2 ring-offset-4 ring-indigo-500 scale-110' : 'hover:ring-2 hover:ring-offset-2 hover:ring-slate-300'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {editingSubject.color === color && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Icon name="check" className="w-5 h-5 text-white drop-shadow-sm" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-2">
                            <button type="button" onClick={() => setEditingSubject(null)} className="px-6 py-3 bg-white text-slate-600 border border-slate-300 font-bold rounded-2xl hover:bg-slate-50 transition active:scale-95 shadow-sm">キャンセル</button>
                            <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition active:scale-95">更新</button>
                        </div>
                    </form>
                ) : (
                /* Add Form */
                    <form onSubmit={handleAddSubject} className="space-y-6 p-6 bg-slate-50/50 rounded-3xl mb-10 border border-slate-200">
                         <h3 className="font-bold text-xl text-slate-800">新しい科目を追加</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="new-name" className="block text-sm font-bold text-slate-500 mb-1.5 ml-1">科目名</label>
                                <input
                                    id="new-name" type="text" value={newSubjectName}
                                    onChange={(e) => setNewSubjectName(e.target.value)}
                                    placeholder="例: 数学I"
                                    className="w-full px-5 py-3 bg-white text-slate-800 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none shadow-sm" 
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="new-goal" className="block text-sm font-bold text-slate-500 mb-1.5 ml-1">目標</label>
                                <input
                                    id="new-goal" type="text" value={newSubjectGoal}
                                    onChange={(e) => setNewSubjectGoal(e.target.value)}
                                    placeholder="例: 期末テストで90点以上"
                                    className="w-full px-5 py-3 bg-white text-slate-800 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none shadow-sm"
                                />
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">カラー</label>
                            <div className="flex flex-wrap gap-3">
                                {SIDEBAR_COLORS.map(color => (
                                    <button 
                                        type="button" 
                                        key={color} 
                                        onClick={() => setNewSubjectColor(color)}
                                        className={`w-9 h-9 rounded-full transition-all transform hover:scale-110 shadow-sm relative ${newSubjectColor === color ? 'ring-2 ring-offset-4 ring-indigo-500 scale-110' : 'hover:ring-2 hover:ring-offset-2 hover:ring-slate-300'}`}
                                        style={{ backgroundColor: color }}
                                    >
                                        {newSubjectColor === color && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Icon name="check" className="w-5 h-5 text-white drop-shadow-sm" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition flex items-center gap-2 transform active:scale-95 group">
                                <Icon name="plus" className="w-6 h-6 transition-transform group-hover:rotate-90" />
                                <span>追加する</span>
                            </button>
                        </div>
                    </form>
                )}
                
                {/* Subject List */}
                <div className="grid grid-cols-1 gap-4">
                    {subjects.map(subject => (
                        <div key={subject.id} className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                            <div className="flex items-center gap-5">
                                <div 
                                    className="w-4 h-4 rounded-full shadow-inner ring-4 ring-slate-50 group-hover:ring-indigo-50 transition-all" 
                                    style={{ backgroundColor: subject.color }}
                                ></div>
                                <div >
                                    <p className="font-black text-slate-800 text-lg tracking-tight">{subject.name}</p>
                                    {subject.goal && <p className="text-sm text-slate-400 font-medium mt-0.5">{subject.goal}</p>}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button 
                                    onClick={() => setEditingSubject(subject)} 
                                    className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                                    title="編集"
                                >
                                    <Icon name="pencil" className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => handleDeleteSubject(subject.id)} 
                                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                    title="削除"
                                >
                                    <Icon name="trash" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                     {subjects.length === 0 && !editingSubject && (
                        <div className="text-center py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                             <p className="text-slate-400 font-medium">まだ科目がありません。<br/>新しい科目を追加して学習を始めましょう！</p>
                        </div>
                    )}
                </div>
            </div>

            <GeminiSuggester subjects={subjects} onAddSuggestedTasks={onAddSuggestedTasks} apiKey={apiKey} />
        </div>
    );
};

export default SubjectManager;
