'use client';

import { useEffect, useRef } from 'react';
import { playCorrectSound, playWrongSound } from '@/lib/sounds';
import { JudgeResult } from '@/lib/judge';

interface FeedbackModalProps {
  isOpen: boolean;
  result: JudgeResult | null;
  userInput: string;
  onNext: () => void;
  // 同じ問題のまま、書き直す
  onRewrite: () => void;
  // 採点できなかったとき、同じ回答をもう一度送る
  onResend?: () => void;
}

export default function FeedbackModal({ isOpen, result, userInput, onNext, onRewrite, onResend }: FeedbackModalProps) {
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (isOpen && result && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      // 正誤が決まったときだけ音を鳴らす（未採点・見くらべでは鳴らさない）
      if (result.status === 'graded') {
        if (result.isCorrect) playCorrectSound();
        else playWrongSound();
      } else if (result.status === 'model-match') {
        playCorrectSound();
      }
    }
    if (!isOpen) {
      hasPlayedSound.current = false;
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🌟';
    if (score >= 80) return '😊';
    if (score >= 70) return '👍';
    if (score >= 60) return '💪';
    return '📚';
  };

  const title =
    result.status === 'graded' ? '判定結果'
    : result.status === 'ungraded' ? '採点できませんでした'
    : 'お手本でたしかめよう';

  const model = result.status !== 'graded' ? result.model : undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              onClick={onRewrite}
              aria-label="とじる"
              className="text-white hover:text-gray-200 text-3xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {result.status === 'graded' && (
            <div className="text-center">
              <div className="text-6xl mb-2">{getScoreEmoji(result.score)}</div>
              <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}点
              </div>
              <div className="text-gray-600 mt-2">
                {result.isCorrect ? '素晴らしい！' : 'もう少し頑張ろう！'}
              </div>
            </div>
          )}

          {result.status === 'ungraded' && (
            <div className="text-center" data-testid="ungraded">
              <div className="text-6xl mb-2">🤔</div>
              <div className="text-2xl font-bold text-gray-700">採点できませんでした</div>
              <p className="text-gray-600 mt-2 text-sm">
                通信などの問題で、AIがこの回答を見られませんでした。
                <br />
                点数はついていません。学習記録にも入りません。
              </p>
            </div>
          )}

          {result.status === 'model-match' && (
            <div className="text-center" data-testid="model-match">
              <div className="text-6xl mb-2">🎉</div>
              <div className="text-3xl font-bold text-green-600">正解！</div>
              <p className="text-gray-600 mt-2 text-sm">お手本とおなじ文が書けました。</p>
            </div>
          )}

          {result.status === 'compare' && (
            <div className="text-center" data-testid="compare">
              <div className="text-6xl mb-2">🔍</div>
              <div className="text-2xl font-bold text-gray-700">お手本とくらべてみよう</div>
              <p className="text-gray-600 mt-2 text-sm">
                いまはAI採点が使えないので、点数や○×はつきません。
                <br />
                お手本とちがっていても、まちがいとはかぎりません。
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">あなたの回答：</h3>
            <p className="text-gray-700">{userInput}</p>
          </div>

          {model && result.status !== 'model-match' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">📖 お手本（答えの一例）：</h3>
              <p className="text-green-700">{model}</p>
            </div>
          )}

          {result.status === 'compare' && result.checks.length > 0 && (
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-bold text-gray-800 mb-1">📝 形のチェック</h4>
              <ul className="text-gray-600 space-y-1">
                {result.checks.map((c, i) => (
                  <li key={i}>・{c}</li>
                ))}
              </ul>
            </div>
          )}

          {result.status === 'graded' && (
            <>
              {result.correctedSentence && result.correctedSentence.trim() !== userInput.trim() && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-2">✨ 修正版：</h3>
                  <p className="text-green-700">{result.correctedSentence}</p>
                </div>
              )}

              {result.feedback.improvements && (
                <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 py-3 rounded-r-lg">
                  <h4 className="font-bold text-gray-800 mb-1">💡 つぎに直すところ</h4>
                  <p className="text-gray-700">{result.feedback.improvements}</p>
                </div>
              )}

              <div className="space-y-4">
                {result.feedback.grammar && (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-bold text-gray-800 mb-1">📝 文法</h4>
                    <p className="text-gray-600">{result.feedback.grammar}</p>
                  </div>
                )}
                {result.feedback.naturalness && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-gray-800 mb-1">🌟 自然さ</h4>
                    <p className="text-gray-600">{result.feedback.naturalness}</p>
                  </div>
                )}
                {result.feedback.vocabulary && (
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-bold text-gray-800 mb-1">📚 語彙</h4>
                    <p className="text-gray-600">{result.feedback.vocabulary}</p>
                  </div>
                )}
              </div>

              {/* 言いかえが無いときは、この欄そのものを出さない */}
              {result.alternativeSentences.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-3">🎯 他の表現例：</h3>
                  <ul className="space-y-2">
                    {result.alternativeSentences.map((sentence, index) => (
                      <li key={index} className="text-blue-700">
                        • {sentence}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          <div className="space-y-3">
            {result.status === 'ungraded' && onResend && (
              <button
                onClick={onResend}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300"
              >
                🔄 もう一度送る
              </button>
            )}
            {result.status !== 'model-match' && !(result.status === 'graded' && result.isCorrect && result.score >= 90) && (
              <button
                onClick={onRewrite}
                className="w-full py-3 bg-white border-2 border-blue-400 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
              >
                ✏️ 書き直してみる
              </button>
            )}
            <button
              onClick={onNext}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              次の問題へ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
