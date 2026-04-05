'use client';

import { useState, useEffect, useRef } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface VoiceInputProps {
  prompt: string;
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

export default function VoiceInput({ prompt, onSubmit, isLoading = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      (recognitionRef.current as any).stop();
      setIsListening(false);
    } else {
      setTranscript('');
      (recognitionRef.current as any).start();
      setIsListening(true);
    }
  };

  const handleSubmit = () => {
    if (transcript.trim() && !isLoading) {
      onSubmit(transcript);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full mx-auto">
        <div className="text-center text-red-600">
          <p className="text-xl">⚠️ 音声認識がサポートされていません</p>
          <p className="mt-2">ChromeまたはEdgeブラウザをご利用ください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full mx-auto">
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">
            🎤 口頭で英作文！
          </h2>
          <p className="text-lg text-gray-700">{prompt}</p>
          <p className="text-sm text-gray-500">
            マイクボタンを押して話し始めてください
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={toggleListening}
            className={`w-32 h-32 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isListening
                ? 'bg-red-500 animate-pulse'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            <span className="text-white text-5xl">
              {isListening ? '⏸️' : '🎤'}
            </span>
          </button>

          {transcript && (
            <div className="w-full p-4 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-800">{transcript}</p>
            </div>
          )}

          {transcript && (
            <div className="w-full flex gap-4">
              <button
                onClick={() => setTranscript('')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                クリア
              </button>
              <button
                onClick={handleSubmit}
                className={`flex-1 py-3 font-bold rounded-lg transition-all duration-300 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transform hover:scale-105'
                }`}
                disabled={isLoading || !transcript.trim()}
              >
                {isLoading ? '判定中...' : '提出する'}
              </button>
            </div>
          )}
        </div>

        {isListening && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <span className="ml-2 text-red-500">聞き取り中...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}