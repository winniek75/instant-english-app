// 採点結果の共通型と、AI採点が使えないときの「お手本くらべ」。
// 大事なルール: 採点できなかった回答に、点数や正誤をつけない。

export const PORTAL_URL = 'https://wise-english-portal.vercel.app';

export interface JudgeFeedback {
  grammar: string;
  naturalness: string;
  vocabulary: string;
  improvements: string;
}

export type JudgeResult =
  // AIが採点した
  | {
      status: 'graded';
      score: number;
      isCorrect: boolean;
      feedback: JudgeFeedback;
      correctedSentence: string;
      alternativeSentences: string[];
    }
  // AI採点なし。お手本と完全一致（=正解として記録してよい）
  | { status: 'model-match'; model: string }
  // AI採点なし。お手本と見くらべるだけ（正誤は記録しない）
  | { status: 'compare'; model?: string; checks: string[] }
  // 通信失敗・例外など。採点できなかった（何も記録しない）
  | { status: 'ungraded'; model?: string };

// 大文字小文字・前後の空白・文末の記号・アポストロフィの種類のちがいを無視して比べる
export function normalizeSentence(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[.!?,。！？、]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// AI採点が使えないときの確認。完全一致だけを「正解」とし、それ以外は正誤をつけない。
export function localCheck(userInput: string, model?: string, targetWord?: string, spoken = false): JudgeResult {
  if (model && normalizeSentence(userInput) === normalizeSentence(model)) {
    return { status: 'model-match', model };
  }
  const trimmed = userInput.trim();
  const checks: string[] = [];
  if (targetWord) {
    const hasWord = new RegExp(`\\b${escapeRegExp(targetWord)}`, 'i').test(trimmed);
    checks.push(hasWord ? `「${targetWord}」が入っています。` : `「${targetWord}」が入っていないようです。`);
  }
  // 音声入力では大文字・記号は本人が打っていないので、形のチェックはしない
  if (spoken) return { status: 'compare', model, checks };
  checks.push(/^[A-Z]/.test(trimmed) ? '文のはじめが大文字になっています。' : '文のはじめは大文字にしましょう。');
  checks.push(/[.!?]$/.test(trimmed) ? '文のおわりに記号（. ? !）がついています。' : '文のおわりにピリオド（.）や ? をつけましょう。');
  return { status: 'compare', model, checks };
}

// /api/judge の応答を画面用の結果に変換する。形がおかしい応答は「採点できなかった」として扱う。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toJudgeResult(data: any, userInput: string, model?: string, targetWord?: string, spoken = false): JudgeResult {
  if (data && data.isDemo) return localCheck(userInput, model, targetWord, spoken);
  if (
    data && !data.isError &&
    typeof data.score === 'number' && Number.isFinite(data.score) &&
    typeof data.isCorrect === 'boolean' &&
    data.feedback && typeof data.feedback === 'object'
  ) {
    const str = (v: unknown) => (typeof v === 'string' ? v : '');
    return {
      status: 'graded',
      score: Math.max(0, Math.min(100, Math.round(data.score))),
      isCorrect: data.isCorrect,
      feedback: {
        grammar: str(data.feedback.grammar),
        naturalness: str(data.feedback.naturalness),
        vocabulary: str(data.feedback.vocabulary),
        improvements: str(data.feedback.improvements),
      },
      correctedSentence: str(data.correctedSentence),
      alternativeSentences: Array.isArray(data.alternativeSentences)
        ? data.alternativeSentences.filter((s: unknown) => typeof s === 'string' && s.trim() !== '')
        : [],
    };
  }
  return { status: 'ungraded', model };
}

// 回答を送って結果を得る。通信失敗・例外でも必ず 'ungraded' を返し、偽の点数は作らない。
export async function requestJudge(params: {
  userInput: string;
  task: string;
  targetWord?: string;
  level?: string;
  model?: string;
  spoken?: boolean;
}): Promise<JudgeResult> {
  const { userInput, task, targetWord, level, model, spoken } = params;
  try {
    const response = await fetch('/api/judge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput, task, targetWord, level }),
    });
    if (!response.ok) return { status: 'ungraded', model };
    const data = await response.json();
    return toJudgeResult(data, userInput, model, targetWord, spoken);
  } catch (error) {
    console.error('Judge request failed:', error);
    return { status: 'ungraded', model };
  }
}
