'use client';

import { useState } from 'react';

interface ComposeInputProps {
  prompt: string;
  hint?: string;
  targetWord?: string;
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

export default function ComposeInput({
  prompt,
  hint,
  targetWord,
  onSubmit,
  isLoading = false
}: ComposeInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full mx-auto">
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">
            📝 英作文にチャレンジ！
          </h2>
          <p className="text-lg text-gray-700">{prompt}</p>

          {targetWord && (
            <div className="inline-block px-4 py-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-800 font-medium">
                必須単語: <strong className="text-yellow-900">{targetWord}</strong>
              </span>
            </div>
          )}

          {hint && (
            <p className="text-sm text-gray-500">
              💡 ヒント: {hint}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="英文を入力してください..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none transition-colors text-lg"
            disabled={isLoading}
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setInput('')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              クリア
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 font-bold rounded-lg transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transform hover:scale-105'
              }`}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? '判定中...' : '提出する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}