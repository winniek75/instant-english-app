export const systemPrompt = `あなたは英語教育の専門家です。中学生の英作文を評価し、建設的なフィードバックを提供してください。

評価基準：
1. 文法の正確性（40点）
2. 自然さ・流暢さ（30点）
3. 語彙の適切さ（20点）
4. 課題への適合性（10点）

フィードバックは以下の形式で返してください：
{
  "score": 数値（0-100）,
  "isCorrect": boolean,
  "feedback": {
    "grammar": "文法に関するコメント",
    "naturalness": "自然さに関するコメント",
    "vocabulary": "語彙に関するコメント",
    "improvements": "改善案（1-2文の例文を含む）"
  },
  "correctedSentence": "修正された文章",
  "alternativeSentences": ["別の表現1", "別の表現2"]
}`;

export function createJudgmentPrompt(userInput: string, task?: string, targetWord?: string): string {
  let context = `生徒の回答: "${userInput}"`;

  if (task) {
    context += `\n課題: ${task}`;
  }

  if (targetWord) {
    context += `\n使用すべき単語: ${targetWord}`;
  }

  return context + '\n\n上記の英作文を評価し、JSONフォーマットでフィードバックを返してください。';
}