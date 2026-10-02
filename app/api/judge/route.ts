import { NextRequest, NextResponse } from 'next/server';
import { systemPrompt, createJudgmentPrompt } from '@/lib/prompts';

// 環境変数は実行時に読む（ビルド時に固定しない）
export const dynamic = 'force-dynamic';

function getApiKey(): string | null {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  // 未設定、または .env.example のままのプレースホルダーは「AI採点なし」
  if (!apiKey || apiKey.startsWith('your-')) return null;
  return apiKey;
}

// 採点していないことを示す応答。点数・正誤は絶対に入れない。
function ungraded(kind: 'demo' | 'error') {
  return NextResponse.json({
    isDemo: kind === 'demo',
    isError: kind === 'error',
    score: null,
    isCorrect: null,
  });
}

// AIの返答からJSON部分を取り出す（```json ... ``` で囲まれていても読めるように）
function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('No JSON object in AI response');
  return JSON.parse(text.slice(start, end + 1));
}

// AI採点が使えるかどうか（入口の表示の出し分け用）
export async function GET() {
  return NextResponse.json({ aiAvailable: getApiKey() !== null });
}

export async function POST(request: NextRequest) {
  let body: { userInput?: unknown; task?: unknown; targetWord?: unknown; level?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  const userInput = typeof body.userInput === 'string' ? body.userInput.trim().slice(0, 1000) : '';
  const task = typeof body.task === 'string' ? body.task.slice(0, 300) : undefined;
  const targetWord = typeof body.targetWord === 'string' ? body.targetWord.slice(0, 50) : undefined;
  const level = typeof body.level === 'string' ? body.level : undefined;

  if (!userInput) {
    return NextResponse.json({ error: 'userInput is required' }, { status: 400 });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    // デモモード: AI採点はしない。お手本との見くらべは画面側で行う。
    return ungraded('demo');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: createJudgmentPrompt(userInput, task, targetWord, level),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = extractJson(data?.content?.[0]?.text ?? '') as any;

    if (typeof result?.score !== 'number' || typeof result?.isCorrect !== 'boolean' || typeof result?.feedback !== 'object' || result.feedback === null) {
      throw new Error('AI response has unexpected shape');
    }

    return NextResponse.json({
      isDemo: false,
      isError: false,
      score: result.score,
      isCorrect: result.isCorrect,
      feedback: result.feedback,
      correctedSentence: typeof result.correctedSentence === 'string' ? result.correctedSentence : '',
      alternativeSentences: Array.isArray(result.alternativeSentences) ? result.alternativeSentences : [],
    });
  } catch (error) {
    console.error('Error in judge API:', error);
    // 採点できなかった。偽の点数やコメントは返さない。
    return ungraded('error');
  }
}
