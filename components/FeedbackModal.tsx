'use client';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: {
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
  } | null;
  userInput: string;
}

export default function FeedbackModal({ isOpen, onClose, feedback, userInput }: FeedbackModalProps) {
  if (!isOpen || !feedback) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">判定結果</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-2">{getScoreEmoji(feedback.score)}</div>
            <div className={`text-5xl font-bold ${getScoreColor(feedback.score)}`}>
              {feedback.score}点
            </div>
            <div className="text-gray-600 mt-2">
              {feedback.isCorrect ? '素晴らしい！' : 'もう少し頑張ろう！'}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">あなたの回答：</h3>
            <p className="text-gray-700">{userInput}</p>
          </div>

          {feedback.correctedSentence && feedback.correctedSentence !== userInput && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">✨ 修正版：</h3>
              <p className="text-green-700">{feedback.correctedSentence}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-bold text-gray-800 mb-1">📝 文法</h4>
              <p className="text-gray-600">{feedback.feedback.grammar}</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-bold text-gray-800 mb-1">🌟 自然さ</h4>
              <p className="text-gray-600">{feedback.feedback.naturalness}</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold text-gray-800 mb-1">📚 語彙</h4>
              <p className="text-gray-600">{feedback.feedback.vocabulary}</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-bold text-gray-800 mb-1">💡 改善のヒント</h4>
              <p className="text-gray-600">{feedback.feedback.improvements}</p>
            </div>
          </div>

          {feedback.alternativeSentences && feedback.alternativeSentences.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-3">🎯 他の表現例：</h3>
              <ul className="space-y-2">
                {feedback.alternativeSentences.map((sentence, index) => (
                  <li key={index} className="text-blue-700">
                    • {sentence}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            次の問題へ
          </button>
        </div>
      </div>
    </div>
  );
}