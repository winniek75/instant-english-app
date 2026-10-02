'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import WordPracticeCard from '@/components/WordPracticeCard';
import { getWordsByLevel, getLevelLabel, getLevelColor, LEVELS, parseLevel } from '@/lib/words';
import { useAiStatus } from '@/lib/useAiStatus';
import { PORTAL_URL } from '@/lib/judge';
import { incrementSessions } from '@/lib/storage';

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = parseLevel(searchParams.get('level'));
  // ディープリンク: /practice?level=beginner&count=10 （count = 先頭から何語やるか）
  const countParam = parseInt(searchParams.get('count') || '', 10);
  const allWords = getWordsByLevel(level);
  const filteredWords = countParam > 0 ? allWords.slice(0, countParam) : allWords;
  const countQuery = countParam > 0 ? `&count=${countParam}` : '';
  const aiAvailable = useAiStatus();

  const colors = getLevelColor(level);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<number[]>([]);
  const [scores, setScores] = useState<number[]>([]);

  const finished = learnedWords.length >= filteredWords.length;

  const handleNext = () => {
    if (finished) return;
    setLearnedWords([...learnedWords, currentIndex]);
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      incrementSessions();
    }
  };

  const handleComplete = (score: number) => {
    setScores([...scores, score]);
  };

  const progress = Math.min(100, ((learnedWords.length + 1) / filteredWords.length) * 100);
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
            {LEVELS.map((l) => {
              const c = getLevelColor(l);
              return (
                <button
                  key={l}
                  onClick={() => {
                    router.push(`/practice?level=${l}${countQuery}`);
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

        {!finished && (
          <WordPracticeCard
            key={filteredWords[currentIndex].id}
            word={filteredWords[currentIndex]}
            onNext={handleNext}
            onComplete={handleComplete}
            aiAvailable={aiAvailable}
          />
        )}

        {finished && (() => {
          const practiceAccuracy = scores.length > 0 ? averageScore : 0;
          // スキップした単語があるときは「PERFECT」と言わない
          const practicedAll = scores.length >= filteredWords.length;
          const nearMissMsg = !practicedAll ? null : practiceAccuracy === 100
            ? 'PERFECT! \uD83D\uDC8E'
            : practiceAccuracy >= 80
              ? `\u3042\u3068${100 - practiceAccuracy}\u70B9\u3067\u30D1\u30FC\u30D5\u30A7\u30AF\u30C8\uFF01`
              : null;
          return (
          <div className="mt-8 text-center animate-popIn">
            <div className="card-base p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">{practicedAll && practiceAccuracy === 100 ? '\uD83D\uDC8E' : '\uD83C\uDF89'}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                さいごの単語まで進みました！
              </h2>
              {nearMissMsg && (
                <p className={`text-lg font-bold mb-2 ${practiceAccuracy === 100 ? 'text-yellow-500' : 'text-blue-500'}`}>
                  {nearMissMsg}
                </p>
              )}
              <div className="mb-6 space-y-2">
                <p className="text-gray-600">
                  {filteredWords.length}個の単語を見ました。おつかれさま！
                </p>
                {scores.length > 0 && (
                  <div className={`${colors.bg} p-4 rounded-lg`}>
                    <p className={`${colors.text} font-bold`}>
                      🏆 最終平均スコア: {averageScore}点
                    </p>
                    <p className={`${colors.text} text-sm opacity-75`}>
                      採点された練習: {scores.length}回
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
                <a href={PORTAL_URL} className="block text-sm text-gray-400 hover:text-gray-600 underline pt-1">
                  🏠 学習ホームにもどる
                </a>
              </div>
            </div>
          </div>
          );
        })()}
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
