'use client';

import { useState } from 'react';
import { Word } from '@/lib/words';

interface WordCardProps {
  word: Word;
  onNext: () => void;
}

export default function WordCard({ word, onNext }: WordCardProps) {
  const [showExample, setShowExample] = useState(false);

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

        <button
          onClick={onNext}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          次の単語へ →
        </button>
      </div>
    </div>
  );
}