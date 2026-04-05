'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import WordPracticeCard from '@/components/WordPracticeCard';
import { getWordsByLevel, getLevelLabel, getLevelColor, Level } from '@/lib/words';

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = (searchParams.get('level') as Level) || 'beginner';
  const filteredWords = getWordsByLevel(level);
  const colors = getLevelColor(level);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<number[]>([]);
  const [scores, setScores] = useState<number[]>([]);

  const handleNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setLearnedWords([...learnedWords, currentIndex]);
      setCurrentIndex(currentIndex + 1);
    } else {
      setLearnedWords([...learnedWords, currentIndex]);
    }
  };

  const handleComplete = (score: number) => {
    setScores([...scores, score]);
  };

  const progress = ((learnedWords.length + 1) / filteredWords.length) * 100;
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-500 hover:text-gray-800 transition-colors font-medium"
            >
              ← ホーム
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">単語練習モード</h1>
              <span className={`level-badge mt-1 ${colors.bg} ${colors.text}`}>
                {getLevelLabel(level)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-gray-500 text-sm font-medium">
                {currentIndex + 1} / {filteredWords.length}
              </div>
              {scores.length > 0 && (
                <div className="text-sm font-bold text-blue-600">
                  平均: {averageScore}点
                </div>
              )}
            </div>
          </div>

          <div className="progress-bar">
            <div
              className={`progress-bar-fill bg-gradient-to-r ${colors.gradient}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Level switcher */}
          <div className="flex justify-center gap-2 mt-4">
            {(['beginner', 'intermediate', 'advanced'] as Level[]).map((l) => {
              const c = getLevelColor(l);
              return (
                <button
                  key={l}
                  onClick={() => {
                    router.push(`/practice?level=${l}`);
                    setCurrentIndex(0);
                    setLearnedWords([]);
                    setScores([]);
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

        <WordPracticeCard
          word={filteredWords[currentIndex]}
          onNext={handleNext}
          onComplete={handleComplete}
        />

        {learnedWords.length === filteredWords.length && (
          <div className="mt-8 text-center animate-popIn">
            <div className="card-base p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                すべての単語を学習しました！
              </h2>
              <div className="mb-6 space-y-2">
                <p className="text-gray-600">
                  {filteredWords.length}個の単語を完了しました。素晴らしい！
                </p>
                {scores.length > 0 && (
                  <div className={`${colors.bg} p-4 rounded-lg`}>
                    <p className={`${colors.text} font-bold`}>
                      🏆 最終平均スコア: {averageScore}点
                    </p>
                    <p className={`${colors.text} text-sm opacity-75`}>
                      練習回数: {scores.length}回
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setLearnedWords([]);
                    setScores([]);
                  }}
                  className={`w-full py-3 bg-gradient-to-r ${colors.gradient} text-white font-bold rounded-lg hover:shadow-lg transition-all`}
                >
                  もう一度練習する
                </button>
                <button
                  onClick={() => router.push(`/compose?level=${level}`)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  英作文モードへ進む
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
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-gray-400 text-lg">読み込み中...</div>
      </div>
    }>
      <PracticeContent />
    </Suspense>
  );
}
