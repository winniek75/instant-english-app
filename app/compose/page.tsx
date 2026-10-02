'use client';

import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { WiseGame?: any; } }
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ComposeInput from '@/components/ComposeInput';
import VoiceInput from '@/components/VoiceInput';
import FeedbackModal from '@/components/FeedbackModal';
import AiNotice from '@/components/AiNotice';
import { getWordsByLevel, getPromptsByLevel, getLevelLabel, getLevelColor, parseLevel } from '@/lib/words';
import { recordAttempt, recordWrongAnswer } from '@/lib/storage';
import { JudgeResult, requestJudge, PORTAL_URL } from '@/lib/judge';
import { useAiStatus } from '@/lib/useAiStatus';

type ComposeMode = 'word-based' | 'free' | 'voice';

// ディープリンク: /compose?level=starter&type=word|free|voice
function parseType(value: string | null): ComposeMode | null {
  if (value === 'word' || value === 'word-based') return 'word-based';
  if (value === 'free') return 'free';
  if (value === 'voice') return 'voice';
  return null;
}

function ComposeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = parseLevel(searchParams.get('level'));
  const filteredWords = getWordsByLevel(level);
  const filteredPrompts = getPromptsByLevel(level);
  const colors = getLevelColor(level);
  const aiAvailable = useAiStatus();

  const [mode, setMode] = useState<ComposeMode | null>(() => parseType(searchParams.get('type')));
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const currentWord = filteredWords[currentWordIndex];
  const currentPrompt = filteredPrompts[currentPromptIndex];

  const handleSubmit = async (text: string) => {
    setUserInput(text);
    setIsLoading(true);

    const isWord = mode === 'word-based';
    const taskStr = isWord
      ? `「${currentWord.english}」を使って英文を作る`
      : currentPrompt.japanese;

    // 通信失敗・例外のときは status: 'ungraded' が返る（偽の点数は作らない）
    const res = await requestJudge({
      userInput: text,
      task: taskStr,
      targetWord: isWord ? currentWord.english : undefined,
      level,
      model: isWord ? currentWord.example : currentPrompt.model,
      spoken: mode === 'voice',
    });

    setResult(res);
    setShowFeedback(true);
    setIsLoading(false);

    // ---- 記録: 採点できたものだけ。未採点・お手本との見くらべは記録しない ----
    if (res.status === 'model-match') {
      // AIなしでも、お手本と完全一致なら正解として記録
      recordAttempt('compose', level, true, 100);
      if (typeof window !== 'undefined' && window.WiseXP) {
        window.WiseXP.reportGame({ score: 100, correct: 1, total: 1, maxCombo: 0, grade: 0 });
      }
      return;
    }
    if (res.status !== 'graded') return;

    recordAttempt('compose', level, res.isCorrect, res.score);
    // Report to WiseXP
    if (typeof window !== 'undefined' && window.WiseXP) {
      window.WiseXP.reportGame({ score: res.score, correct: res.isCorrect ? 1 : 0, total: 1, maxCombo: 0, grade: 0 });
    }
    if (!res.isCorrect) {
      recordWrongAnswer({
        question: taskStr,
        userAnswer: text,
        correctAnswer: res.correctedSentence || '',
        mode: 'compose',
        level,
      });
      // Report wrong answer to WiseXP
      if (typeof window !== 'undefined' && window.WiseXP) {
        window.WiseXP.reportWrong({ question: taskStr, correct: res.correctedSentence || '', playerAnswer: text });
      }
      // Report to MoWISE portal
      try {
        window.WiseGame?.reportComplete?.({
          score: res.score, maxScore: 100, accuracy: res.score,
          metadata: { level, wrongAnswers: [{ q: taskStr, correct: res.correctedSentence || '', chosen: text, tag: 'other_grammar' }] }
        });
      } catch {}
    }
  };

  // 同じ問題のまま書き直す（入力はそのまま残る）
  const handleRewrite = () => {
    setShowFeedback(false);
    setResult(null);
  };

  const handleNextProblem = () => {
    setShowFeedback(false);
    setResult(null);
    setUserInput('');

    if (mode === 'word-based') {
      setCurrentWordIndex((currentWordIndex + 1) % filteredWords.length);
    } else {
      setCurrentPromptIndex((currentPromptIndex + 1) % filteredPrompts.length);
    }
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 flex justify-between items-center">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-500 hover:text-gray-800 transition-colors font-medium"
            >
              ← ホーム
            </button>
            <span className={`level-badge ${colors.bg} ${colors.text}`}>
              {getLevelLabel(level)}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            英作文モードを選択
          </h1>

          <AiNotice aiAvailable={aiAvailable} />

          <div className="grid md:grid-cols-3 gap-5">
            <button
              onClick={() => setMode('word-based')}
              className="card-base p-7 text-left hover-lift"
            >
              <div className="text-4xl mb-3">🎯</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">単語から英作文</h2>
              <p className="text-sm text-gray-500 mb-4">
                指定された単語を使って英文を作ります
              </p>
              <div className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-lg text-center text-sm">
                選択
              </div>
            </button>

            <button
              onClick={() => setMode('free')}
              className="card-base p-7 text-left hover-lift"
            >
              <div className="text-4xl mb-3">✏️</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">自由英作文</h2>
              <p className="text-sm text-gray-500 mb-4">
                日本語のお題から自由に英文を作ります
              </p>
              <div className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg text-center text-sm">
                選択
              </div>
            </button>

            <button
              onClick={() => setMode('voice')}
              className="card-base p-7 text-left hover-lift"
            >
              <div className="text-4xl mb-3">🎤</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">口頭英作文</h2>
              <p className="text-sm text-gray-500 mb-4">
                お題を見て、マイクに向かって英語で答えます
              </p>
              <div className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-lg text-center text-sm">
                選択
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <a href={PORTAL_URL} className="text-sm text-gray-400 hover:text-gray-600 underline">
              🏠 学習ホームにもどる
            </a>
          </div>
        </div>
      </div>
    );
  }

  const hasData = mode === 'word-based' ? !!currentWord : !!currentPrompt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setMode(null)}
            className="px-4 py-2 text-gray-500 hover:text-gray-800 transition-colors font-medium"
          >
            ← モード選択
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">
              {mode === 'word-based' && '単語から英作文'}
              {mode === 'free' && '自由英作文'}
              {mode === 'voice' && '口頭英作文'}
            </h1>
            <span className={`level-badge mt-1 ${colors.bg} ${colors.text}`}>
              {getLevelLabel(level)}
            </span>
            <div className="text-xs text-gray-400 mt-1">
              {mode === 'word-based'
                ? `${currentWordIndex + 1} / ${filteredWords.length}`
                : `${currentPromptIndex + 1} / ${filteredPrompts.length}`}
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-gray-500 hover:text-gray-800 transition-colors font-medium"
          >
            ホーム
          </button>
        </div>

        <AiNotice aiAvailable={aiAvailable} />

        {!hasData ? (
          <div className="text-center text-gray-400">データがありません</div>
        ) : mode === 'voice' ? (
          <VoiceInput
            key={`voice-${currentPrompt.id}`}
            prompt={currentPrompt.japanese}
            hint={currentPrompt.hint}
            frame={currentPrompt.frame}
            aiAvailable={aiAvailable}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        ) : mode === 'word-based' ? (
          <ComposeInput
            key={`word-${currentWord.id}`}
            prompt={`「${currentWord.english}」を使って英文を作ってください`}
            targetWord={currentWord.english}
            meaning={currentWord.japanese}
            frame={currentWord.frame}
            frameJp={currentWord.frameJp}
            example={currentWord.example}
            exampleJp={currentWord.exampleJp}
            aiAvailable={aiAvailable}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        ) : (
          <ComposeInput
            key={`free-${currentPrompt.id}`}
            prompt={currentPrompt.japanese}
            hint={currentPrompt.hint}
            frame={currentPrompt.frame}
            aiAvailable={aiAvailable}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}

        <FeedbackModal
          isOpen={showFeedback}
          result={result}
          userInput={userInput}
          onNext={handleNextProblem}
          onRewrite={handleRewrite}
          onResend={() => { setShowFeedback(false); handleSubmit(userInput); }}
        />
      </div>
    </div>
  );
}

export default function ComposePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-gray-400 text-lg">読み込み中...</div>
      </div>
    }>
      <ComposeContent />
    </Suspense>
  );
}
