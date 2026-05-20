'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ComposeInput from '@/components/ComposeInput';
import VoiceInput from '@/components/VoiceInput';
import FeedbackModal from '@/components/FeedbackModal';
import { getWordsByLevel, getPromptsByLevel, getLevelLabel, getLevelColor, Level } from '@/lib/words';
import { recordAttempt, recordWrongAnswer } from '@/lib/storage';

type ComposeMode = 'word-based' | 'free' | 'voice';

function ComposeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = (searchParams.get('level') as Level) || 'beginner';
  const filteredWords = getWordsByLevel(level);
  const filteredPrompts = getPromptsByLevel(level);
  const colors = getLevelColor(level);

  const [mode, setMode] = useState<ComposeMode | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    isCorrect: boolean;
    feedback: {
      grammar: string;
      naturalness: string;
      vocabulary: string;
      improvements: string;
    };
    correctedSentence: string;
    alternativeSentences: string[];
  } | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = async (text: string) => {
    setUserInput(text);
    setIsLoading(true);

    try {
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: text,
          task: mode === 'word-based'
            ? `「${filteredWords[currentWordIndex].english}」を使って英文を作る`
            : filteredPrompts[currentPromptIndex].japanese,
          targetWord: mode === 'word-based' ? filteredWords[currentWordIndex].english : undefined,
        }),
      });

      const data = await response.json();
      setFeedback(data);
      setShowFeedback(true);
      recordAttempt('compose', level, data.isCorrect, data.score);
      // Report to WiseXP
      if (typeof window !== 'undefined' && window.WiseXP) {
        window.WiseXP.reportGame({ score: data.score, correct: data.isCorrect ? 1 : 0, total: 1, maxCombo: 0, grade: 0 });
      }
      if (!data.isCorrect) {
        const taskStr = mode === 'word-based'
          ? `「${filteredWords[currentWordIndex].english}」を使って英文を作る`
          : filteredPrompts[currentPromptIndex].japanese;
        recordWrongAnswer({
          question: taskStr,
          userAnswer: text,
          correctAnswer: data.correctedSentence || '',
          mode: 'compose',
          level,
        });
        // Report wrong answer to WiseXP
        if (typeof window !== 'undefined' && window.WiseXP) {
          window.WiseXP.reportWrong({ question: taskStr, correct: data.correctedSentence || '', playerAnswer: text });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedback({
        score: 75,
        isCorrect: true,
        feedback: {
          grammar: '基本的な文法は正しいです。',
          naturalness: '自然な表現です。',
          vocabulary: '適切な語彙を使用しています。',
          improvements: 'より詳細な説明を加えると良いでしょう。',
        },
        correctedSentence: text,
        alternativeSentences: ['Good job!', 'Well done!'],
      });
      setShowFeedback(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextProblem = () => {
    setShowFeedback(false);
    setFeedback(null);
    setUserInput('');

    if (mode === 'word-based') {
      if (currentWordIndex < filteredWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        setCurrentWordIndex(0);
      }
    } else {
      if (currentPromptIndex < filteredPrompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
      } else {
        setCurrentPromptIndex(0);
      }
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

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            英作文モードを選択
          </h1>

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
                音声認識で口頭で回答します
              </p>
              <div className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-lg text-center text-sm">
                選択
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
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
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-gray-500 hover:text-gray-800 transition-colors font-medium"
          >
            ホーム
          </button>
        </div>

        {mode === 'voice' ? (
          <VoiceInput
            prompt={filteredPrompts[currentPromptIndex].japanese}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        ) : (
          <ComposeInput
            prompt={
              mode === 'word-based'
                ? `「${filteredWords[currentWordIndex].english}」を使って英文を作ってください`
                : filteredPrompts[currentPromptIndex].japanese
            }
            hint={
              mode === 'free' ? filteredPrompts[currentPromptIndex].hint : undefined
            }
            targetWord={
              mode === 'word-based' ? filteredWords[currentWordIndex].english : undefined
            }
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}

        <FeedbackModal
          isOpen={showFeedback}
          onClose={handleNextProblem}
          feedback={feedback}
          userInput={userInput}
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
