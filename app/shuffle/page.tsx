'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getShuffleSentencesByLevel, getLevelLabel, getLevelColor, Level, ShuffleSentence } from '@/lib/words';
import { playCorrectSound, playWrongSound } from '@/lib/sounds';
import { recordAttempt, recordWrongAnswer, incrementSessions } from '@/lib/storage';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ShuffleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = (searchParams.get('level') as Level) || 'beginner';
  const sentences = getShuffleSentencesByLevel(level);
  const colors = getLevelColor(level);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const currentSentence: ShuffleSentence | undefined = sentences[currentIndex];

  const initQuestion = useCallback(() => {
    if (!sentences[currentIndex]) return;
    const words = sentences[currentIndex].english.replace(/[.!?,]/g, '').split(/\s+/);
    setShuffledWords(shuffleArray(words));
    setSelectedWords([]);
    setIsCorrect(null);
  }, [currentIndex, sentences]);

  useEffect(() => {
    initQuestion();
    if (!isRunning) setIsRunning(true);
  }, [initQuestion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (!isRunning || gameComplete) return;
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, gameComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleWordClick = (word: string, index: number) => {
    if (isCorrect !== null) return;
    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);
    setSelectedWords([...selectedWords, word]);
  };

  const handleSelectedClick = (word: string, index: number) => {
    if (isCorrect !== null) return;
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setShuffledWords([...shuffledWords, word]);
  };

  const handleCheck = () => {
    if (!currentSentence) return;
    const userAnswer = selectedWords.join(' ');
    // Remove punctuation from the correct answer for comparison
    const correctAnswer = currentSentence.english.replace(/[.!?,]/g, '').trim();
    const correct = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setTotalAnswered(totalAnswered + 1);
    if (correct) {
      setScore(score + 1);
      playCorrectSound();
    } else {
      playWrongSound();
      recordWrongAnswer({
        question: currentSentence.japanese,
        userAnswer,
        correctAnswer: currentSentence.english,
        mode: 'shuffle',
        level,
      });
    }
    recordAttempt('shuffle', level, correct, correct ? 100 : 0);
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameComplete(true);
      setIsRunning(false);
      incrementSessions();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setTimer(0);
    setGameComplete(false);
    setIsRunning(true);
  };

  if (!currentSentence && !gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-gray-400">データがありません</div>
      </div>
    );
  }

  if (gameComplete) {
    const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50 p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="card-base p-8 text-center animate-popIn mt-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              クリア！
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`${colors.bg} p-4 rounded-xl`}>
                <div className={`text-2xl font-extrabold ${colors.text}`}>{score}/{totalAnswered}</div>
                <div className="text-xs text-gray-500 mt-1">正解数</div>
              </div>
              <div className={`${colors.bg} p-4 rounded-xl`}>
                <div className={`text-2xl font-extrabold ${colors.text}`}>{accuracy}%</div>
                <div className="text-xs text-gray-500 mt-1">正解率</div>
              </div>
              <div className={`${colors.bg} p-4 rounded-xl`}>
                <div className={`text-2xl font-extrabold ${colors.text}`}>{formatTime(timer)}</div>
                <div className="text-xs text-gray-500 mt-1">タイム</div>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className={`w-full py-3 bg-gradient-to-r ${colors.gradient} text-white font-bold rounded-lg hover:shadow-lg transition-all`}
              >
                もう一度挑戦する
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50 p-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-500 hover:text-gray-800 transition-colors font-medium"
            >
              ← ホーム
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">🔀 シャッフル翻訳</h1>
              <span className={`level-badge mt-1 ${colors.bg} ${colors.text}`}>
                {getLevelLabel(level)}
              </span>
            </div>
            <div className="text-right text-sm">
              <div className="font-bold text-gray-700">{formatTime(timer)}</div>
              <div className="text-gray-500">{currentIndex + 1}/{sentences.length}</div>
            </div>
          </div>

          {/* Progress */}
          <div className="progress-bar">
            <div
              className={`progress-bar-fill bg-gradient-to-r ${colors.gradient}`}
              style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}
            ></div>
          </div>

          {/* Score */}
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-green-500 font-bold">⭕ {score}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-red-400 font-bold">❌ {totalAnswered - score}</span>
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className="card-base p-6 mb-5 animate-fadeIn">
          <div className="text-center mb-2">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">日本語</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {currentSentence.japanese}
            </p>
          </div>
        </div>

        {/* Answer area */}
        <div className="card-base p-5 mb-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3 text-center">あなたの回答</p>
          <div className="min-h-[56px] p-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-wrap gap-2 items-center justify-center">
            {selectedWords.length === 0 && (
              <span className="text-gray-300 text-sm">下の単語をタップして並べてください</span>
            )}
            {selectedWords.map((word, idx) => (
              <button
                key={`selected-${idx}`}
                onClick={() => handleSelectedClick(word, idx)}
                className={`word-chip ${
                  isCorrect === null
                    ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                    : isCorrect
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-red-50 border-red-300 text-red-700'
                }`}
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Word bank */}
        {isCorrect === null && (
          <div className="card-base p-5 mb-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3 text-center">単語バンク</p>
            <div className="flex flex-wrap gap-2 justify-center min-h-[48px]">
              {shuffledWords.map((word, idx) => (
                <button
                  key={`shuffled-${idx}`}
                  onClick={() => handleWordClick(word, idx)}
                  className="word-chip bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {isCorrect !== null && (
          <div className={`card-base p-5 mb-5 animate-popIn ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="text-center">
              <div className="text-4xl mb-2">{isCorrect ? '🎉' : '😅'}</div>
              <p className={`text-lg font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '正解！' : '不正解...'}
              </p>
              {!isCorrect && (
                <p className="text-sm text-gray-600 mt-2">
                  正解: <span className="font-bold">{currentSentence.english}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {isCorrect === null ? (
            <>
              <button
                onClick={() => {
                  initQuestion();
                }}
                className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                リセット
              </button>
              <button
                onClick={handleCheck}
                disabled={selectedWords.length === 0}
                className={`flex-1 py-3 font-bold rounded-lg transition-all ${
                  selectedWords.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${colors.gradient} text-white hover:shadow-lg`
                }`}
              >
                チェック
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              className={`flex-1 py-3 bg-gradient-to-r ${colors.gradient} text-white font-bold rounded-lg hover:shadow-lg transition-all`}
            >
              {currentIndex < sentences.length - 1 ? '次の問題へ →' : '結果を見る'}
            </button>
          )}
        </div>

        {/* Level switcher */}
        <div className="flex justify-center gap-2 mt-6">
          {(['beginner', 'intermediate', 'advanced'] as Level[]).map((l) => {
            const c = getLevelColor(l);
            return (
              <button
                key={l}
                onClick={() => {
                  router.push(`/shuffle?level=${l}`);
                  setCurrentIndex(0);
                  setScore(0);
                  setTotalAnswered(0);
                  setTimer(0);
                  setGameComplete(false);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  l === level
                    ? `bg-gradient-to-r ${c.gradient} text-white shadow-md`
                    : `${c.bg} ${c.text} hover:shadow-sm`
                }`}
              >
                {getLevelLabel(l)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ShufflePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-gray-400 text-lg">読み込み中...</div>
      </div>
    }>
      <ShuffleContent />
    </Suspense>
  );
}
