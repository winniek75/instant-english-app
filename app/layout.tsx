import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "瞬間英作文トレーニング",
  description: "中学生向けの瞬間英作文トレーニングアプリ。AIが自動で英作文を判定・フィードバック。単語練習、英作文、シャッフル翻訳の3つのモードで楽しく英語力を伸ばそう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://cdn.jsdelivr.net/gh/winniek75/wise-xp-sdk@main/wise-xp.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
