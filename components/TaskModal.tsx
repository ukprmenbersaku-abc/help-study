import React, { useState, useEffect } from 'react';
import { Subject, Task, TaskType } from '../types';
import Icon from './Icon';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  subjects: Subject[];
  selectedDate: Date;
  taskToEdit?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, subjects, selectedDate, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [type, setType] = useState<TaskType>(TaskType.STUDY);
  const [duration, setDuration] = useState(1);
  const [date, setDate] = useState(selectedDate.toISOString().split('T')[0]);
  const [assignment, setAssignment] = useState('');
  const [pages, setPages] = useState('');
  const [memo, setMemo] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [notificationEnabled, setNotificationEnabled] = useState(false);


  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setSubjectId(taskToEdit.subjectId);
      setType(taskToEdit.type);
      setDuration(taskToEdit.duration || 1);
      setDate(taskToEdit.date);
      setAssignment(taskToEdit.assignment || '');
      setPages(taskToEdit.pages || '');
      setMemo(taskToEdit.memo || '');
      setStartTime(taskToEdit.startTime || '09:00');
      setNotificationEnabled(taskToEdit.notificationEnabled || false);
    } else {
      // Reset form for new task
      setTitle('');
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
      setType(TaskType.STUDY);
      setDuration(1);
      setAssignment('');
      setPages('');
      setMemo('');
      setStartTime('09:00');
      setNotificationEnabled(false);
    }
  }, [taskToEdit, subjects]);

  useEffect(() => {
    setDate(selectedDate.toISOString().split('T')[0]);
  }, [selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subjectId) return;

    onSave({
      title,
      subjectId,
      date,
      type,
      duration: type === TaskType.STUDY ? (duration > 0 ? duration : undefined) : undefined,
      assignment: assignment || undefined,
      pages: pages || undefined,
      memo: memo || undefined,
      startTime: notificationEnabled ? startTime : undefined,
      notificationEnabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all animate-modal-enter flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">{taskToEdit ? 'タスクを編集' : '新しいタスク'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors">
            <Icon name="x" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col min-h-0">
          <div className="overflow-y-auto space-y-4 pr-4 -mr-4 mb-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">タイトル <span className="text-rose-500">*</span></label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="例: 数学の章末問題"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-600 mb-1">科目 <span className="text-rose-500">*</span></label>
              <select
                id="subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                required
              >
                <option value="" disabled>科目を選択</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="assignment" className="block text-sm font-medium text-slate-600 mb-1">課題</label>
                  <input
                    type="text"
                    id="assignment"
                    value={assignment}
                    onChange={(e) => setAssignment(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="例: プリントNo.3"
                  />
                </div>
                <div>
                  <label htmlFor="pages" className="block text-sm font-medium text-slate-600 mb-1">ページ</label>
                  <input
                    type="text"
                    id="pages"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="例: p.24-28"
                  />
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">タイプ</label>
              <div className="flex space-x-4">
                <button type="button" onClick={() => setType(TaskType.STUDY)} className={`flex-1 py-2 rounded-lg text-sm transition ${type === TaskType.STUDY ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>学習</button>
                <button type="button" onClick={() => setType(TaskType.DEADLINE)} className={`flex-1 py-2 rounded-lg text-sm transition ${type === TaskType.DEADLINE ? 'bg-rose-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>提出</button>
              </div>
            </div>
            {type === TaskType.STUDY && (
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-600 mb-1">学習時間 (時間単位)</label>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  min="0"
                  step="0.5"
                />
              </div>
            )}
             <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-600 mb-1">日付 <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
             </div>
             <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="bell" className="w-5 h-5 text-slate-500" />
                      <label htmlFor="notification" className="text-sm font-medium text-slate-600">通知</label>
                    </div>
                    <label htmlFor="notification-switch" className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" id="notification-switch" className="sr-only" checked={notificationEnabled} onChange={() => setNotificationEnabled(!notificationEnabled)} />
                        <div className={`block w-10 h-6 rounded-full transition ${notificationEnabled ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationEnabled ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                    </label>
                </div>
                {notificationEnabled && (
                    <div className="mt-3">
                      <label htmlFor="startTime" className="block text-sm font-medium text-slate-600 mb-1">開始時間</label>
                      <input
                        type="time"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                )}
             </div>
            <div>
                <label htmlFor="memo" className="block text-sm font-medium text-slate-600 mb-1">詳しいメモ</label>
                <textarea
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="持ち物や注意点などをメモ"
                ></textarea>
              </div>
          </div>
          <div className="flex justify-end pt-4 mt-auto border-t border-slate-200 flex-shrink-0">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105">
              {taskToEdit ? '更新' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;