'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { WiseXP?: any; } }
import { Level, LEVELS, parseLevel, getLevelLabel, getLevelColor, getWordsByLevel, getPromptsByLevel, getShuffleSentencesByLevel } from '@/lib/words';
import { useAiStatus } from '@/lib/useAiStatus';
import { PORTAL_URL } from '@/lib/judge';
import { loadProgress, getOverallStats, ProgressData } from '@/lib/storage';

type GameMode = 'practice' | 'compose' | 'shuffle';

const levelDescriptions: Record<Level, string> = {
  starter: 'I like ___. などの文の形を見ながら、3〜4語の文を作ろう',
  beginner: '基本的な単語と短い文章で英語の基礎を固めよう',
  intermediate: 'より実践的な語彙で表現力をアップしよう',
  advanced: '高度な語彙で論理的な英文を作ろう',
};

const levelIcons: Record<Level, string> = {
  starter: '🐣',
  beginner: '🌱',
  intermediate: '🌿',
  advanced: '🌳',
};

const modeConfig: Record<GameMode, { icon: string; title: string; desc: string; gradient: string }> = {
  practice: {
    icon: '📚',
    title: '単語練習',
    desc: '単語の意味・スペリング・例文を学習',
    gradient: 'from-emerald-500 to-teal-600',
  },
  compose: {
    icon: '✍️',
    title: '英作文',
    desc: '単語から・お題から・声で、の3つの英作文モード',
    gradient: 'from-blue-500 to-indigo-600',
  },
  shuffle: {
    icon: '🔀',
    title: 'シャッフル翻訳',
    desc: '単語を正しい順番に並べ替えよう',
    gradient: 'from-orange-500 to-rose-600',
  },
};

export default function Home() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const aiAvailable = useAiStatus();

  // ディープリンク: /?mode=shuffle&level=starter&count=5 、 /?mode=compose&level=beginner&type=free
  // mode があればメニューを出さずに、そのモード・レベルを直接開く
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'practice' || mode === 'compose' || mode === 'shuffle') {
      const next = new URLSearchParams();
      next.set('level', parseLevel(params.get('level')));
      const count = parseInt(params.get('count') || '', 10);
      if (count > 0) next.set('count', String(count));
      const type = params.get('type');
      if (mode === 'compose' && type) next.set('type', type);
      router.replace(`/${mode}?${next.toString()}`);
    }
  }, [router]);

  useEffect(() => {
    setProgress(loadProgress());
    // Initialize WiseXP SDK
    if (typeof window !== 'undefined' && window.WiseXP) {
      window.WiseXP.init('instant-english-app');
    }
  }, []);

  const stats = progress ? getOverallStats(progress) : null;

  const handleStart = (mode: GameMode, level: Level) => {
    router.push(`/${mode}?level=${level}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="gradient-text">瞬間英作文トレーニング</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            楽しく英語力を伸ばそう！
          </p>
          {aiAvailable === false && (
            <p data-testid="ai-notice" className="mt-3 inline-block rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              ℹ️ いまはAI採点が使えません（英作文はお手本との比較で確認します）
            </p>
          )}
        </div>

        {/* Mode selection */}
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
          {(Object.keys(modeConfig) as GameMode[]).map((mode) => {
            const cfg = modeConfig[mode];
            const isSelected = selectedMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setSelectedMode(isSelected ? null : mode)}
                className={`card-base p-6 text-left hover-lift ${
                  isSelected ? 'ring-2 ring-blue-400 border-blue-300 shadow-xl' : ''
                }`}
              >
                <div className="text-4xl mb-3">{cfg.icon}</div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{cfg.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{cfg.desc}</p>
                <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${cfg.gradient} text-white text-sm font-bold`}>
                  {isSelected ? '選択中' : '選択する'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Level selection (shown when mode is selected) */}
        {selectedMode && (
          <div className="max-w-5xl mx-auto mb-10 animate-fadeIn">
            <h3 className="text-center text-xl font-bold text-gray-700 mb-5">
              レベルを選んでスタート
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {LEVELS.map((level) => {
                const colors = getLevelColor(level);
                const wordCount = getWordsByLevel(level).length;
                const promptCount = getPromptsByLevel(level).length;
                const shuffleCount = getShuffleSentencesByLevel(level).length;
                return (
                  <button
                    key={level}
                    onClick={() => handleStart(selectedMode, level)}
                    className={`card-base p-6 text-left hover-lift border-2 ${colors.border} ${colors.bg}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{levelIcons[level]}</span>
                      <div>
                        <div className={`text-lg font-extrabold ${colors.text}`}>
                          {getLevelLabel(level)}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">{level}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{levelDescriptions[level]}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`level-badge ${colors.bg} ${colors.text}`}>
                        単語 {wordCount}個
                      </span>
                      {selectedMode === 'compose' && (
                        <span className={`level-badge ${colors.bg} ${colors.text}`}>
                          お題 {promptCount}問
                        </span>
                      )}
                      {selectedMode === 'shuffle' && (
                        <span className={`level-badge ${colors.bg} ${colors.text}`}>
                          文 {shuffleCount}問
                        </span>
                      )}
                    </div>
                    <div className={`mt-4 w-full py-2 rounded-lg bg-gradient-to-r ${colors.gradient} text-white text-center text-sm font-bold`}>
                      始める
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Progress stats */}
        {stats && stats.totalAttempts > 0 && (
          <div className="card-base p-6 max-w-3xl mx-auto mb-8 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">あなたの学習記録</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-blue-600">{stats.totalAttempts}</div>
                <div className="text-xs text-gray-500 mt-1">総回答数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-green-600">{stats.totalCorrect}</div>
                <div className="text-xs text-gray-500 mt-1">正解数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-purple-600">{stats.accuracy}%</div>
                <div className="text-xs text-gray-500 mt-1">正解率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-red-500">{stats.wrongAnswerCount}</div>
                <div className="text-xs text-gray-500 mt-1">間違い記録</div>
              </div>
            </div>
            {progress && progress.wrongAnswers.length > 0 && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 text-center">
                  最近の間違いを見る ({Math.min(progress.wrongAnswers.length, 5)}件)
                </summary>
                <div className="mt-3 space-y-2">
                  {progress.wrongAnswers.slice(-5).reverse().map((w, i) => (
                    <div key={i} className="bg-red-50 p-3 rounded-lg text-sm">
                      <div className="text-gray-700 font-medium">{w.question}</div>
                      <div className="text-red-600">あなたの回答: {w.userAnswer}</div>
                      <div className="text-green-600">正解: {w.correctAnswer}</div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* Features section */}
        <div className="card-base p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-5 text-center">アプリの特徴</h3>
          <div className="grid md:grid-cols-4 gap-5">
            <div className="text-center">
              <div className="text-3xl mb-2">{aiAvailable ? '🤖' : aiAvailable === false ? '📖' : '✍️'}</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1" data-testid="feature-judge">
                {aiAvailable ? 'AI自動判定' : aiAvailable === false ? 'お手本でたしかめ' : '英作文チェック'}
              </h4>
              <p className="text-xs text-gray-500">
                {aiAvailable
                  ? '直すところを1〜2点おしえます'
                  : aiAvailable === false
                    ? 'いまはAI採点が使えません'
                    : '書いた英文をたしかめよう'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">4段階レベル</h4>
              <p className="text-xs text-gray-500">はじめて・初級・中級・上級</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔀</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">シャッフル翻訳</h4>
              <p className="text-xs text-gray-500">並べ替えで語順を学習</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎮</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">楽しく学習</h4>
              <p className="text-xs text-gray-500">ゲーム感覚で英語力UP</p>
            </div>
          </div>
        </div>

        {/* Mode badges */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white rounded-full px-5 py-3 shadow-md border border-gray-100">
            <span className="text-gray-500 text-sm mr-1">学習モード:</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">単語練習</span>
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">単語から英作文</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">自由英作文</span>
            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">口頭英作文</span>
            <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">シャッフル翻訳</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href={PORTAL_URL} className="text-sm text-gray-400 hover:text-gray-600 underline">
            🏠 学習ホームにもどる
          </a>
        </div>
      </div>
    </div>
  );
}
