import { NextRequest, NextResponse } from 'next/server';
import { systemPrompt, createJudgmentPrompt } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  let userInput = '';

  try {
    const body = await request.json();
    userInput = body.userInput;
    const task = body.task;
    const targetWord = body.targetWord;

    if (!userInput) {
      return NextResponse.json({ error: 'userInput is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey === 'your-actual-api-key-here') {
      console.warn('ANTHROPIC_API_KEY is not properly configured - using demo mode');

      // Enhanced demo mode with basic analysis
      const wordCount = userInput.trim().split(/\s+/).length;
      const hasTargetWord = targetWord ? userInput.toLowerCase().includes(targetWord.toLowerCase()) : true;
      const hasCapitalization = /^[A-Z]/.test(userInput.trim());
      const hasPunctuation = /[.!?]$/.test(userInput.trim());

      let score = 50; // Base score
      if (hasTargetWord) score += 20;
      if (hasCapitalization) score += 10;
      if (hasPunctuation) score += 10;
      if (wordCount >= 3) score += 10;

      const isCorrect = score >= 70;

      return NextResponse.json({
        score: Math.min(score, 95), // Cap at 95 for demo mode
        isCorrect,
        feedback: {
          grammar: hasCapitalization && hasPunctuation
            ? '基本的な文法は正しいです。（デモモード）'
            : '大文字と句読点に注意してください。（デモモード）',
          naturalness: '自然な表現です。',
          vocabulary: hasTargetWord
            ? '指定された単語を正しく使用しています。'
            : targetWord ? `「${targetWord}」という単語が含まれていません。` : '適切な語彙を使用しています。',
          improvements: '環境変数ANTHROPIC_API_KEYを設定すると、より詳細なAI判定が利用できます。',
        },
        correctedSentence: userInput,
        alternativeSentences: isCorrect ? ['Great work!', 'Well done!'] : ['Keep trying!', 'You can do it!'],
      });
    }

    const prompt = createJudgmentPrompt(userInput, task, targetWord);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    try {
      const feedback = JSON.parse(content);
      return NextResponse.json(feedback);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return fallback response if parsing fails
      return NextResponse.json({
        score: 70,
        isCorrect: true,
        feedback: {
          grammar: 'AI判定でエラーが発生しました。',
          naturalness: '文章は理解できます。',
          vocabulary: '語彙は適切です。',
          improvements: 'もう一度お試しください。',
        },
        correctedSentence: userInput,
        alternativeSentences: [],
      });
    }
  } catch (error) {
    console.error('Error in judge API:', error);

    // Return a fallback response for any errors
    return NextResponse.json({
      score: 65,
      isCorrect: true,
      feedback: {
        grammar: 'システムエラーが発生しました。',
        naturalness: '基本的な構造は理解できます。',
        vocabulary: '使用した語彙は適切です。',
        improvements: '技術的な問題により詳細な判定ができませんでした。後でもう一度お試しください。',
      },
      correctedSentence: userInput || '',
      alternativeSentences: [],
    }, { status: 200 });
  }
}