import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "瞬間英作文トレーニング",
  description: "瞬間英作文トレーニングアプリ。単語練習、英作文、シャッフル翻訳の3つのモードと、はじめて〜上級の4レベルで、自分で英語を作る練習ができます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <Script
          src="https://cdn.jsdelivr.net/gh/winniek75/wise-xp-sdk@main/wise-xp.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
