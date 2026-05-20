import { Level } from './words';

const STORAGE_KEY = 'instant-english-progress';

export interface WrongAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  mode: 'practice-spelling' | 'practice-sentence' | 'compose' | 'shuffle';
  level: Level;
  timestamp: number;
}

export interface ModeStats {
  totalAttempts: number;
  correctCount: number;
  bestScore: number;
  lastPlayed: number;
}

export interface ProgressData {
  practice: Record<Level, ModeStats>;
  compose: Record<Level, ModeStats>;
  shuffle: Record<Level, ModeStats>;
  wrongAnswers: WrongAnswer[];
  totalSessions: number;
}

function defaultModeStats(): ModeStats {
  return {
    totalAttempts: 0,
    correctCount: 0,
    bestScore: 0,
    lastPlayed: 0,
  };
}

function defaultProgress(): ProgressData {
  return {
    practice: {
      beginner: defaultModeStats(),
      intermediate: defaultModeStats(),
      advanced: defaultModeStats(),
    },
    compose: {
      beginner: defaultModeStats(),
      intermediate: defaultModeStats(),
      advanced: defaultModeStats(),
    },
    shuffle: {
      beginner: defaultModeStats(),
      intermediate: defaultModeStats(),
      advanced: defaultModeStats(),
    },
    wrongAnswers: [],
    totalSessions: 0,
  };
}

export function loadProgress(): ProgressData {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressData>;
    // Merge with defaults to handle missing fields
    const defaults = defaultProgress();
    return {
      practice: { ...defaults.practice, ...parsed.practice },
      compose: { ...defaults.compose, ...parsed.compose },
      shuffle: { ...defaults.shuffle, ...parsed.shuffle },
      wrongAnswers: parsed.wrongAnswers || [],
      totalSessions: parsed.totalSessions || 0,
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export function recordAttempt(
  mode: 'practice' | 'compose' | 'shuffle',
  level: Level,
  isCorrect: boolean,
  score: number
): ProgressData {
  const data = loadProgress();
  const stats = data[mode][level];
  stats.totalAttempts += 1;
  if (isCorrect) stats.correctCount += 1;
  if (score > stats.bestScore) stats.bestScore = score;
  stats.lastPlayed = Date.now();
  saveProgress(data);
  return data;
}

export function recordWrongAnswer(wrong: Omit<WrongAnswer, 'timestamp'>): ProgressData {
  const data = loadProgress();
  data.wrongAnswers.push({ ...wrong, timestamp: Date.now() });
  // Keep only last 100 wrong answers
  if (data.wrongAnswers.length > 100) {
    data.wrongAnswers = data.wrongAnswers.slice(-100);
  }
  saveProgress(data);
  return data;
}

export function incrementSessions(): ProgressData {
  const data = loadProgress();
  data.totalSessions += 1;
  saveProgress(data);
  return data;
}

export function getOverallStats(data: ProgressData): {
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  wrongAnswerCount: number;
} {
  let totalAttempts = 0;
  let totalCorrect = 0;
  for (const mode of ['practice', 'compose', 'shuffle'] as const) {
    for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
      totalAttempts += data[mode][level].totalAttempts;
      totalCorrect += data[mode][level].correctCount;
    }
  }
  return {
    totalAttempts,
    totalCorrect,
    accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    wrongAnswerCount: data.wrongAnswers.length,
  };
}
