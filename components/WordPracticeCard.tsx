'use client';

import { useState } from 'react';
import { Word } from '@/lib/words';

interface WordPracticeCardProps {
  word: Word;
  onNext: () => void;
  onComplete: (score: number) => void;
}

type PracticeMode = 'learn' | 'spelling' | 'sentence';

export default function WordPracticeCard({ word, onNext, onComplete }: WordPracticeCardProps) {
  const [mode, setMode] = useState<PracticeMode>('learn');
  const [showExample, setShowExample] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{
    isCorrect?: boolean;
    message?: string;
    color?: string;
    score?: number;
    feedback?: {
      grammar?: string;
      improvements?: string;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);

  const handleSpellingSubmit = async () => {
    const isCorrect = userInput.toLowerCase().trim() === word.english.toLowerCase();
    const currentScore = isCorrect ? 100 : 0;
    setScore(currentScore);

    if (isCorrect) {
      setFeedback({
        isCorrect: true,
        message: '正解！完璧です！',
        color: 'green'
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: `正解: ${word.english}`,
        color: 'red'
      });
    }
  };

  const handleSentenceSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput,
          task: `「${word.english}」を使って英文を作る`,
          targetWord: word.english,
        }),
      });

      const data = await response.json();
      setFeedback(data);
      setScore(data.score);
    } catch (error) {
      console.error('Error:', error);
      setFeedback({
        score: 50,
        isCorrect: false,
        feedback: {
          grammar: 'システムエラーが発生しました。',
          improvements: 'もう一度お試しください。'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete(score);
    onNext();
  };

  const resetExercise = () => {
    setUserInput('');
    setFeedback(null);
    setScore(0);
  };

  if (mode === 'learn') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-auto transform transition-all duration-300 hover:scale-105">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-blue-600 mb-2">{word.english}</h2>
            <p className="text-gray-500 text-sm">{word.partOfSpeech}</p>
          </div>

          <div className="text-center">
            <p className="text-2xl text-gray-800">{word.japanese}</p>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={() => setShowExample(!showExample)}
              className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">例文を見る</span>
                <span className="text-2xl">{showExample ? '🔼' : '🔽'}</span>
              </div>
            </button>

            {showExample && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 animate-fadeIn">
                <p className="text-lg text-gray-800">📝 {word.example}</p>
                <p className="text-gray-600">→ {word.exampleJp}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-center text-gray-800">
              📚 アウトプット練習を始めよう！
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('spelling')}
                className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
              >
                📝 スペリング
              </button>
              <button
                onClick={() => setMode('sentence')}
                className="py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                ✍️ 英作文
              </button>
            </div>
            <button
              onClick={onNext}
              className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
              スキップして次へ →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'spelling') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={() => setMode('learn')}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              ← 学習モードに戻る
            </button>
            <h2 className="text-3xl font-bold text-green-600 mb-2">📝 スペリング練習</h2>
            <p className="text-gray-600">日本語を見て英単語を入力してください</p>
          </div>

          <div className="text-center bg-blue-50 p-6 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">{word.japanese}</p>
            <p className="text-sm text-gray-500 mt-1">({word.partOfSpeech})</p>
          </div>

          {!feedback ? (
            <div className="space-y-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="英単語を入力..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-center text-xl focus:border-green-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSpellingSubmit()}
              />
              <div className="flex gap-3">
                <button
                  onClick={resetExercise}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  クリア
                </button>
                <button
                  onClick={handleSpellingSubmit}
                  className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:opacity-50"
                  disabled={!userInput.trim()}
                >
                  チェック
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg text-center ${feedback.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="text-4xl mb-2">
                  {feedback.isCorrect ? '🎉' : '😅'}
                </div>
                <p className="text-lg font-bold">{feedback.message}</p>
              </div>
              <button
                onClick={handleComplete}
                className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
              >
                次の単語へ →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'sentence') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={() => setMode('learn')}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              ← 学習モードに戻る
            </button>
            <h2 className="text-3xl font-bold text-purple-600 mb-2">✍️ 英作文練習</h2>
            <p className="text-gray-600">この単語を使って英文を作ってください</p>
          </div>

          <div className="text-center bg-purple-50 p-6 rounded-lg">
            <p className="text-3xl font-bold text-purple-800">{word.english}</p>
            <p className="text-gray-600 mt-2">{word.japanese} ({word.partOfSpeech})</p>
          </div>

          {!feedback ? (
            <div className="space-y-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="この単語を使った英文を入力してください..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-purple-500 focus:outline-none text-lg"
              />
              <div className="flex gap-3">
                <button
                  onClick={resetExercise}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  クリア
                </button>
                <button
                  onClick={handleSentenceSubmit}
                  className={`flex-1 py-3 font-bold rounded-lg transition-all duration-300 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                  disabled={isLoading || !userInput.trim()}
                >
                  {isLoading ? 'AI判定中...' : 'AI判定する'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">あなたの回答：</h4>
                <p className="text-gray-700">{userInput}</p>
              </div>

              <div className={`p-4 rounded-lg ${feedback.isCorrect ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">
                    {(feedback.score || 0) >= 80 ? '🌟' : (feedback.score || 0) >= 60 ? '👍' : '📚'}
                  </span>
                  <span className="text-2xl font-bold text-gray-800">{feedback.score || 0}点</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{feedback.feedback?.improvements || 'Good job!'}</p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
              >
                次の単語へ →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}