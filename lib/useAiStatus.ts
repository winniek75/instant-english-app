'use client';

import { useEffect, useState } from 'react';

// AI採点が使えるかどうか。null = 確認中、true = 使える、false = 使えない（お手本くらべになる）
export function useAiStatus(): boolean | null {
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/judge')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        if (!cancelled) setAiAvailable(data?.aiAvailable === true);
      })
      .catch(() => {
        // 確認できないときは「使えない」として案内する（使えると言って使えないより安全）
        if (!cancelled) setAiAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return aiAvailable;
}
