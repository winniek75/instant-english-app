'use client';

import { useState } from 'react';
import { Word } from '@/lib/words';
import { playCorrectSound, playWrongSound } from '@/lib/sounds';
import { recordAttempt, recordWrongAnswer } from '@/lib/storage';
import { JudgeResult, requestJudge } from '@/lib/judge';

interface WordPracticeCardProps {
  word: Word;
  onNext: () => void;
  onComplete: (score: number) => void;
  // AI採点が使えるか（null = 確認中）
  aiAvailable?: boolean | null;
}

type PracticeMode = 'learn' | 'spelling' | 'sentence';

export default function WordPracticeCard({ word, onNext, onComplete, aiAvailable = null }: WordPracticeCardProps) {
  const [mode, setMode] = useState<PracticeMode>('learn');
  const [showExample, setShowExample] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [judge, setJudge] = useState<JudgeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // null = まだ採点されていない（平均点に入れない）
  const [score, setScore] = useState<number | null>(null);

  const handleSpellingSubmit = async () => {
    const isCorrect = userInput.toLowerCase().trim() === word.english.toLowerCase();
    const currentScore = isCorrect ? 100 : 0;
    setScore(currentScore);

    if (isCorrect) {
      playCorrectSound();
      setFeedback({
        isCorrect: true,
        message: '正解！完璧です！'
      });
    } else {
      playWrongSound();
      recordWrongAnswer({
        question: word.japanese,
        userAnswer: userInput,
        correctAnswer: word.english,
        mode: 'practice-spelling',
        level: word.level,
      });
      setFeedback({
        isCorrect: false,
        message: `正解: ${word.english}`
      });
    }
    recordAttempt('practice', word.level, isCorrect, currentScore);
  };

  const handleSentenceSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    const taskStr = `「${word.english}」を使って英文を作る`;
    // 通信失敗・例外のときは status: 'ungraded' が返る（偽の点数は作らない）
    const res = await requestJudge({
      userInput,
      task: taskStr,
      targetWord: word.english,
      level: word.level,
      model: word.example,
    });
    setJudge(res);
    setIsLoading(false);

    // 記録するのは採点できたものだけ
    if (res.status === 'model-match') {
      setScore(100);
      playCorrectSound();
      recordAttempt('practice', word.level, true, 100);
    } else if (res.status === 'graded') {
      setScore(res.score);
      if (res.isCorrect) {
        playCorrectSound();
      } else {
        playWrongSound();
        recordWrongAnswer({
          question: taskStr,
          userAnswer: userInput,
          correctAnswer: res.correctedSentence || '',
          mode: 'practice-sentence',
          level: word.level,
        });
      }
      recordAttempt('practice', word.level, res.isCorrect, res.score);
    } else {
      setScore(null);
    }
  };

  const handleComplete = () => {
    if (score !== null) onComplete(score);
    onNext();
  };

  const resetExercise = () => {
    setUserInput('');
    setFeedback(null);
    setJudge(null);
    setScore(null);
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
              onClick={() => { resetExercise(); setMode('learn'); }}
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
              onClick={() => { resetExercise(); setMode('learn'); }}
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

          {word.frame && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <p className="text-xs text-amber-700 font-bold mb-1">🧩 この形で書いてみよう</p>
              <p className="text-2xl font-bold text-amber-900 tracking-wide">{word.frame}</p>
              {word.frameJp && <p className="text-sm text-amber-700 mt-1">{word.frameJp}</p>}
            </div>
          )}

          {aiAvailable === false && !judge && (
            <p className="text-center text-sm text-amber-800 bg-amber-50 border border-amber-300 rounded-lg px-3 py-2">
              ℹ️ いまはAI採点が使えません（お手本との比較で確認します）
            </p>
          )}

          {!judge ? (
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
                    isLoading || !userInput.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                  disabled={isLoading || !userInput.trim()}
                >
                  {isLoading ? '確認中...' : aiAvailable === false ? 'お手本でたしかめる' : aiAvailable ? 'AI判定する' : '提出する'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">あなたの回答：</h4>
                <p className="text-gray-700">{userInput}</p>
              </div>

              {judge.status === 'graded' && (
                <div className={`p-4 rounded-lg ${judge.isCorrect ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">
                      {judge.score >= 80 ? '🌟' : judge.score >= 60 ? '👍' : '📚'}
                    </span>
                    <span className="text-2xl font-bold text-gray-800">{judge.score}点</span>
                  </div>
                  {judge.correctedSentence && judge.correctedSentence.trim() !== userInput.trim() && (
                    <p className="text-sm text-green-700 mb-2">✨ 修正版: {judge.correctedSentence}</p>
                  )}
                  {judge.feedback.improvements && (
                    <p className="text-sm text-gray-600">💡 {judge.feedback.improvements}</p>
                  )}
                </div>
              )}

              {judge.status === 'model-match' && (
                <div className="p-4 rounded-lg bg-green-50 text-green-800 text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-lg font-bold">正解！お手本とおなじ文が書けました。</p>
                </div>
              )}

              {judge.status === 'compare' && (
                <div className="p-4 rounded-lg bg-blue-50">
                  <p className="font-bold text-gray-800 mb-1">🔍 お手本とくらべてみよう</p>
                  <p className="text-xs text-gray-500 mb-2">
                    いまはAI採点が使えないので、点数や○×はつきません。お手本とちがっていても、まちがいとはかぎりません。
                  </p>
                  {judge.model && <p className="text-green-700 mb-2">📖 お手本: {judge.model}</p>}
                  <ul className="text-sm text-gray-600 space-y-1">
                    {judge.checks.map((c, i) => <li key={i}>・{c}</li>)}
                  </ul>
                </div>
              )}

              {judge.status === 'ungraded' && (
                <div className="p-4 rounded-lg bg-gray-100 text-center">
                  <div className="text-4xl mb-2">🤔</div>
                  <p className="text-lg font-bold text-gray-700">採点できませんでした</p>
                  <p className="text-sm text-gray-600 mt-1">
                    通信などの問題です。点数はついていません。学習記録にも入りません。
                  </p>
                  {judge.model && <p className="text-green-700 mt-2 text-sm">📖 お手本: {judge.model}</p>}
                  <button
                    onClick={handleSentenceSubmit}
                    disabled={isLoading}
                    className="mt-3 px-5 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 disabled:opacity-50"
                  >
                    {isLoading ? '確認中...' : '🔄 もう一度送る'}
                  </button>
                </div>
              )}

              {judge.status !== 'model-match' && (
                <button
                  onClick={() => { setJudge(null); setScore(null); }}
                  className="w-full py-3 bg-white border-2 border-purple-400 text-purple-600 font-bold rounded-lg hover:bg-purple-50"
                >
                  ✏️ 書き直してみる
                </button>
              )}
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