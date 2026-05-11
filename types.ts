
export interface Subject {
  id: string;
  name: string;
  color: string;
  goal: string;
  icon?: string;
}

export enum TaskType {
  STUDY = 'STUDY',
  DEADLINE = 'DEADLINE',
}

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: TaskType;
  duration?: number; // in hours
  isCompleted: boolean;
  isImportant?: boolean;
  assignment?: string;
  pages?: string;
  memo?: string;
  startTime?: string; // HH:MM
  notificationEnabled?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
  xpReward?: number; // Added XP reward
}

export interface UserProgress {
  level: number;
  xp: number;
  badges: Badge[];
}

export interface SuggestedTask {
    title: string;
    description: string;
    estimatedHours: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ReviewResult {
  subjectId: string;
  score: number;
  total: number;
  date: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  icon?: string;
  tags?: string[];
  relatedWords?: string[];
}
