'use client';

// AI採点の利用可否を、始める前に知らせる小さな帯
export default function AiNotice({ aiAvailable }: { aiAvailable: boolean | null }) {
  if (aiAvailable === null) return null;
  if (aiAvailable) {
    return (
      <div data-testid="ai-notice" className="mb-5 mx-auto max-w-3xl rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm text-blue-700">
        🤖 AIがあなたの英文を見て、直すところを1〜2点おしえます。
      </div>
    );
  }
  return (
    <div data-testid="ai-notice" className="mb-5 mx-auto max-w-3xl rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
      ℹ️ いまはAI採点が使えません（お手本との比較で確認します）。点数はつきません。
    </div>
  );
}
