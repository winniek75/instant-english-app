export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Word {
  id: number;
  english: string;
  japanese: string;
  partOfSpeech: string;
  example: string;
  exampleJp: string;
  level: Level;
}

export interface CompositionPrompt {
  id: number;
  japanese: string;
  hint: string;
  level: Level;
}

export const words: Word[] = [
  // === BEGINNER (30 words) ===
  {
    id: 1,
    english: "achieve",
    japanese: "達成する",
    partOfSpeech: "動詞",
    example: "I want to achieve my goals.",
    exampleJp: "私は目標を達成したい。",
    level: "beginner"
  },
  {
    id: 2,
    english: "believe",
    japanese: "信じる",
    partOfSpeech: "動詞",
    example: "I believe in you.",
    exampleJp: "私はあなたを信じています。",
    level: "beginner"
  },
  {
    id: 3,
    english: "create",
    japanese: "作る、創造する",
    partOfSpeech: "動詞",
    example: "Let's create something new.",
    exampleJp: "何か新しいものを作りましょう。",
    level: "beginner"
  },
  {
    id: 4,
    english: "different",
    japanese: "異なる、違う",
    partOfSpeech: "形容詞",
    example: "This is different from that.",
    exampleJp: "これはあれとは違います。",
    level: "beginner"
  },
  {
    id: 5,
    english: "education",
    japanese: "教育",
    partOfSpeech: "名詞",
    example: "Education is important for everyone.",
    exampleJp: "教育は誰にとっても重要です。",
    level: "beginner"
  },
  {
    id: 6,
    english: "famous",
    japanese: "有名な",
    partOfSpeech: "形容詞",
    example: "She is a famous singer.",
    exampleJp: "彼女は有名な歌手です。",
    level: "beginner"
  },
  {
    id: 7,
    english: "government",
    japanese: "政府",
    partOfSpeech: "名詞",
    example: "The government made a new law.",
    exampleJp: "政府は新しい法律を作りました。",
    level: "beginner"
  },
  {
    id: 8,
    english: "health",
    japanese: "健康",
    partOfSpeech: "名詞",
    example: "Good health is very important.",
    exampleJp: "健康はとても大切です。",
    level: "beginner"
  },
  {
    id: 9,
    english: "important",
    japanese: "重要な",
    partOfSpeech: "形容詞",
    example: "This is an important message.",
    exampleJp: "これは重要なメッセージです。",
    level: "beginner"
  },
  {
    id: 10,
    english: "journey",
    japanese: "旅、旅行",
    partOfSpeech: "名詞",
    example: "Life is a long journey.",
    exampleJp: "人生は長い旅です。",
    level: "beginner"
  },
  {
    id: 11,
    english: "knowledge",
    japanese: "知識",
    partOfSpeech: "名詞",
    example: "Knowledge is power.",
    exampleJp: "知識は力です。",
    level: "beginner"
  },
  {
    id: 12,
    english: "language",
    japanese: "言語",
    partOfSpeech: "名詞",
    example: "English is a global language.",
    exampleJp: "英語は世界共通語です。",
    level: "beginner"
  },
  {
    id: 13,
    english: "moment",
    japanese: "瞬間",
    partOfSpeech: "名詞",
    example: "Wait a moment, please.",
    exampleJp: "少々お待ちください。",
    level: "beginner"
  },
  {
    id: 14,
    english: "necessary",
    japanese: "必要な",
    partOfSpeech: "形容詞",
    example: "Sleep is necessary for health.",
    exampleJp: "睡眠は健康に必要です。",
    level: "beginner"
  },
  {
    id: 15,
    english: "opinion",
    japanese: "意見",
    partOfSpeech: "名詞",
    example: "What's your opinion?",
    exampleJp: "あなたの意見は何ですか？",
    level: "beginner"
  },
  {
    id: 16,
    english: "problem",
    japanese: "問題",
    partOfSpeech: "名詞",
    example: "We need to solve this problem.",
    exampleJp: "この問題を解決する必要があります。",
    level: "beginner"
  },
  {
    id: 17,
    english: "question",
    japanese: "質問",
    partOfSpeech: "名詞",
    example: "Do you have any questions?",
    exampleJp: "何か質問はありますか？",
    level: "beginner"
  },
  {
    id: 18,
    english: "reason",
    japanese: "理由",
    partOfSpeech: "名詞",
    example: "There must be a reason.",
    exampleJp: "何か理由があるはずです。",
    level: "beginner"
  },
  {
    id: 19,
    english: "society",
    japanese: "社会",
    partOfSpeech: "名詞",
    example: "We live in a modern society.",
    exampleJp: "私たちは現代社会に生きています。",
    level: "beginner"
  },
  {
    id: 20,
    english: "technology",
    japanese: "技術",
    partOfSpeech: "名詞",
    example: "Technology changes our lives.",
    exampleJp: "技術は私たちの生活を変えます。",
    level: "beginner"
  },
  {
    id: 21,
    english: "understand",
    japanese: "理解する",
    partOfSpeech: "動詞",
    example: "I understand your feelings.",
    exampleJp: "あなたの気持ちを理解しています。",
    level: "beginner"
  },
  {
    id: 22,
    english: "valuable",
    japanese: "価値のある",
    partOfSpeech: "形容詞",
    example: "Time is valuable.",
    exampleJp: "時間は貴重です。",
    level: "beginner"
  },
  {
    id: 23,
    english: "wonder",
    japanese: "不思議に思う",
    partOfSpeech: "動詞",
    example: "I wonder what will happen.",
    exampleJp: "何が起こるのだろうか。",
    level: "beginner"
  },
  {
    id: 24,
    english: "explain",
    japanese: "説明する",
    partOfSpeech: "動詞",
    example: "Can you explain this to me?",
    exampleJp: "これを説明してもらえますか？",
    level: "beginner"
  },
  {
    id: 25,
    english: "yesterday",
    japanese: "昨日",
    partOfSpeech: "副詞",
    example: "I met him yesterday.",
    exampleJp: "昨日彼に会いました。",
    level: "beginner"
  },
  {
    id: 26,
    english: "environment",
    japanese: "環境",
    partOfSpeech: "名詞",
    example: "We must protect the environment.",
    exampleJp: "環境を守らなければなりません。",
    level: "beginner"
  },
  {
    id: 27,
    english: "experience",
    japanese: "経験",
    partOfSpeech: "名詞",
    example: "This was a great experience.",
    exampleJp: "これは素晴らしい経験でした。",
    level: "beginner"
  },
  {
    id: 28,
    english: "discover",
    japanese: "発見する",
    partOfSpeech: "動詞",
    example: "I discovered a new restaurant.",
    exampleJp: "新しいレストランを発見しました。",
    level: "beginner"
  },
  {
    id: 29,
    english: "improve",
    japanese: "改善する、上達する",
    partOfSpeech: "動詞",
    example: "I want to improve my English.",
    exampleJp: "英語を上達させたいです。",
    level: "beginner"
  },
  {
    id: 30,
    english: "together",
    japanese: "一緒に",
    partOfSpeech: "副詞",
    example: "Let's work together.",
    exampleJp: "一緒に働きましょう。",
    level: "beginner"
  },

  // === INTERMEDIATE (30 words) ===
  {
    id: 31,
    english: "communicate",
    japanese: "伝える、コミュニケーションする",
    partOfSpeech: "動詞",
    example: "It is important to communicate clearly.",
    exampleJp: "はっきり伝えることが大切です。",
    level: "intermediate"
  },
  {
    id: 32,
    english: "opportunity",
    japanese: "機会、チャンス",
    partOfSpeech: "名詞",
    example: "This is a great opportunity to learn.",
    exampleJp: "これは学ぶ素晴らしい機会です。",
    level: "intermediate"
  },
  {
    id: 33,
    english: "responsibility",
    japanese: "責任",
    partOfSpeech: "名詞",
    example: "It is our responsibility to help others.",
    exampleJp: "他の人を助けるのは私たちの責任です。",
    level: "intermediate"
  },
  {
    id: 34,
    english: "appreciate",
    japanese: "感謝する、鑑賞する",
    partOfSpeech: "動詞",
    example: "I appreciate your kindness.",
    exampleJp: "あなたの親切に感謝します。",
    level: "intermediate"
  },
  {
    id: 35,
    english: "influence",
    japanese: "影響、影響を与える",
    partOfSpeech: "名詞/動詞",
    example: "Music has a big influence on people.",
    exampleJp: "音楽は人々に大きな影響を与えます。",
    level: "intermediate"
  },
  {
    id: 36,
    english: "challenge",
    japanese: "挑戦、課題",
    partOfSpeech: "名詞/動詞",
    example: "Learning a new language is a challenge.",
    exampleJp: "新しい言語を学ぶことは挑戦です。",
    level: "intermediate"
  },
  {
    id: 37,
    english: "tradition",
    japanese: "伝統",
    partOfSpeech: "名詞",
    example: "Japan has many beautiful traditions.",
    exampleJp: "日本には多くの美しい伝統があります。",
    level: "intermediate"
  },
  {
    id: 38,
    english: "conversation",
    japanese: "会話",
    partOfSpeech: "名詞",
    example: "We had an interesting conversation.",
    exampleJp: "私たちは面白い会話をしました。",
    level: "intermediate"
  },
  {
    id: 39,
    english: "encourage",
    japanese: "励ます、勧める",
    partOfSpeech: "動詞",
    example: "My teacher encouraged me to study harder.",
    exampleJp: "先生は私にもっと勉強するように励ましました。",
    level: "intermediate"
  },
  {
    id: 40,
    english: "development",
    japanese: "発展、開発",
    partOfSpeech: "名詞",
    example: "The development of technology is amazing.",
    exampleJp: "技術の発展は驚くべきものです。",
    level: "intermediate"
  },
  {
    id: 41,
    english: "represent",
    japanese: "代表する、表す",
    partOfSpeech: "動詞",
    example: "This flag represents our country.",
    exampleJp: "この旗は私たちの国を表しています。",
    level: "intermediate"
  },
  {
    id: 42,
    english: "situation",
    japanese: "状況",
    partOfSpeech: "名詞",
    example: "We need to understand the situation.",
    exampleJp: "状況を理解する必要があります。",
    level: "intermediate"
  },
  {
    id: 43,
    english: "compare",
    japanese: "比較する",
    partOfSpeech: "動詞",
    example: "Let's compare these two books.",
    exampleJp: "この2冊の本を比較しましょう。",
    level: "intermediate"
  },
  {
    id: 44,
    english: "suggest",
    japanese: "提案する",
    partOfSpeech: "動詞",
    example: "I suggest we go to the library.",
    exampleJp: "図書館に行くことを提案します。",
    level: "intermediate"
  },
  {
    id: 45,
    english: "advantage",
    japanese: "利点、有利",
    partOfSpeech: "名詞",
    example: "Speaking English is a big advantage.",
    exampleJp: "英語を話すことは大きな利点です。",
    level: "intermediate"
  },
  {
    id: 46,
    english: "population",
    japanese: "人口",
    partOfSpeech: "名詞",
    example: "The population of Tokyo is very large.",
    exampleJp: "東京の人口はとても多いです。",
    level: "intermediate"
  },
  {
    id: 47,
    english: "consider",
    japanese: "考慮する、考える",
    partOfSpeech: "動詞",
    example: "Please consider my suggestion.",
    exampleJp: "私の提案を考慮してください。",
    level: "intermediate"
  },
  {
    id: 48,
    english: "purpose",
    japanese: "目的",
    partOfSpeech: "名詞",
    example: "What is the purpose of this meeting?",
    exampleJp: "この会議の目的は何ですか？",
    level: "intermediate"
  },
  {
    id: 49,
    english: "recognize",
    japanese: "認識する、気づく",
    partOfSpeech: "動詞",
    example: "I recognized her voice immediately.",
    exampleJp: "彼女の声にすぐ気づきました。",
    level: "intermediate"
  },
  {
    id: 50,
    english: "decision",
    japanese: "決定、決断",
    partOfSpeech: "名詞",
    example: "Making a decision is sometimes difficult.",
    exampleJp: "決断することは時々難しいです。",
    level: "intermediate"
  },
  {
    id: 51,
    english: "experiment",
    japanese: "実験",
    partOfSpeech: "名詞/動詞",
    example: "We did an experiment in science class.",
    exampleJp: "理科の授業で実験をしました。",
    level: "intermediate"
  },
  {
    id: 52,
    english: "according",
    japanese: "〜によると",
    partOfSpeech: "前置詞",
    example: "According to the news, it will rain tomorrow.",
    exampleJp: "ニュースによると、明日は雨になるそうです。",
    level: "intermediate"
  },
  {
    id: 53,
    english: "discussion",
    japanese: "議論、話し合い",
    partOfSpeech: "名詞",
    example: "We had a long discussion about the project.",
    exampleJp: "プロジェクトについて長い議論をしました。",
    level: "intermediate"
  },
  {
    id: 54,
    english: "gradually",
    japanese: "徐々に、だんだん",
    partOfSpeech: "副詞",
    example: "My English is gradually improving.",
    exampleJp: "私の英語は徐々に上達しています。",
    level: "intermediate"
  },
  {
    id: 55,
    english: "independent",
    japanese: "独立した、自立した",
    partOfSpeech: "形容詞",
    example: "She is an independent person.",
    exampleJp: "彼女は自立した人です。",
    level: "intermediate"
  },
  {
    id: 56,
    english: "determine",
    japanese: "決定する、決心する",
    partOfSpeech: "動詞",
    example: "We need to determine the best plan.",
    exampleJp: "最善の計画を決定する必要があります。",
    level: "intermediate"
  },
  {
    id: 57,
    english: "previous",
    japanese: "前の、以前の",
    partOfSpeech: "形容詞",
    example: "I learned this in the previous lesson.",
    exampleJp: "前の授業でこれを学びました。",
    level: "intermediate"
  },
  {
    id: 58,
    english: "participate",
    japanese: "参加する",
    partOfSpeech: "動詞",
    example: "I want to participate in the contest.",
    exampleJp: "コンテストに参加したいです。",
    level: "intermediate"
  },
  {
    id: 59,
    english: "maintain",
    japanese: "維持する、保つ",
    partOfSpeech: "動詞",
    example: "It is important to maintain good health.",
    exampleJp: "健康を維持することが大切です。",
    level: "intermediate"
  },
  {
    id: 60,
    english: "obviously",
    japanese: "明らかに",
    partOfSpeech: "副詞",
    example: "She was obviously happy about the result.",
    exampleJp: "彼女は明らかに結果を喜んでいました。",
    level: "intermediate"
  },

  // === ADVANCED (30 words) ===
  {
    id: 61,
    english: "consequence",
    japanese: "結果、影響",
    partOfSpeech: "名詞",
    example: "Every action has a consequence.",
    exampleJp: "すべての行動には結果があります。",
    level: "advanced"
  },
  {
    id: 62,
    english: "phenomenon",
    japanese: "現象",
    partOfSpeech: "名詞",
    example: "Global warming is a serious phenomenon.",
    exampleJp: "地球温暖化は深刻な現象です。",
    level: "advanced"
  },
  {
    id: 63,
    english: "perspective",
    japanese: "視点、見方",
    partOfSpeech: "名詞",
    example: "Try to see things from a different perspective.",
    exampleJp: "違う視点から物事を見てみましょう。",
    level: "advanced"
  },
  {
    id: 64,
    english: "controversy",
    japanese: "論争、議論",
    partOfSpeech: "名詞",
    example: "The new rule caused a lot of controversy.",
    exampleJp: "新しいルールは多くの論争を引き起こしました。",
    level: "advanced"
  },
  {
    id: 65,
    english: "demonstrate",
    japanese: "実証する、示す",
    partOfSpeech: "動詞",
    example: "The data demonstrates the importance of exercise.",
    exampleJp: "データは運動の重要性を実証しています。",
    level: "advanced"
  },
  {
    id: 66,
    english: "significant",
    japanese: "重要な、意味のある",
    partOfSpeech: "形容詞",
    example: "This discovery is very significant.",
    exampleJp: "この発見はとても重要です。",
    level: "advanced"
  },
  {
    id: 67,
    english: "sophisticated",
    japanese: "洗練された、高度な",
    partOfSpeech: "形容詞",
    example: "This is a sophisticated system.",
    exampleJp: "これは高度なシステムです。",
    level: "advanced"
  },
  {
    id: 68,
    english: "sustainable",
    japanese: "持続可能な",
    partOfSpeech: "形容詞",
    example: "We need sustainable energy sources.",
    exampleJp: "持続可能なエネルギー源が必要です。",
    level: "advanced"
  },
  {
    id: 69,
    english: "hypothesize",
    japanese: "仮説を立てる",
    partOfSpeech: "動詞",
    example: "Scientists hypothesize about the origin of life.",
    exampleJp: "科学者たちは生命の起源について仮説を立てます。",
    level: "advanced"
  },
  {
    id: 70,
    english: "approximately",
    japanese: "およそ、約",
    partOfSpeech: "副詞",
    example: "Approximately 70% of Earth is covered by water.",
    exampleJp: "地球の約70%は水で覆われています。",
    level: "advanced"
  },
  {
    id: 71,
    english: "contradiction",
    japanese: "矛盾",
    partOfSpeech: "名詞",
    example: "There is a contradiction in his argument.",
    exampleJp: "彼の議論には矛盾があります。",
    level: "advanced"
  },
  {
    id: 72,
    english: "inevitable",
    japanese: "避けられない",
    partOfSpeech: "形容詞",
    example: "Change is inevitable in life.",
    exampleJp: "人生において変化は避けられません。",
    level: "advanced"
  },
  {
    id: 73,
    english: "contemporary",
    japanese: "現代の、同時代の",
    partOfSpeech: "形容詞",
    example: "Contemporary art is very creative.",
    exampleJp: "現代アートはとても創造的です。",
    level: "advanced"
  },
  {
    id: 74,
    english: "elaborate",
    japanese: "詳しく述べる、精巧な",
    partOfSpeech: "動詞/形容詞",
    example: "Could you elaborate on your idea?",
    exampleJp: "あなたの考えを詳しく述べてもらえますか？",
    level: "advanced"
  },
  {
    id: 75,
    english: "fundamental",
    japanese: "基本的な、根本的な",
    partOfSpeech: "形容詞",
    example: "Education is a fundamental right.",
    exampleJp: "教育は基本的な権利です。",
    level: "advanced"
  },
  {
    id: 76,
    english: "implication",
    japanese: "含意、影響",
    partOfSpeech: "名詞",
    example: "This decision has many implications.",
    exampleJp: "この決定には多くの含意があります。",
    level: "advanced"
  },
  {
    id: 77,
    english: "predominant",
    japanese: "支配的な、優勢な",
    partOfSpeech: "形容詞",
    example: "English is the predominant language in business.",
    exampleJp: "ビジネスでは英語が支配的な言語です。",
    level: "advanced"
  },
  {
    id: 78,
    english: "simultaneously",
    japanese: "同時に",
    partOfSpeech: "副詞",
    example: "She can speak and write simultaneously.",
    exampleJp: "彼女は同時に話したり書いたりできます。",
    level: "advanced"
  },
  {
    id: 79,
    english: "accumulate",
    japanese: "蓄積する、たまる",
    partOfSpeech: "動詞",
    example: "Knowledge accumulates over time.",
    exampleJp: "知識は時間とともに蓄積されます。",
    level: "advanced"
  },
  {
    id: 80,
    english: "distinguish",
    japanese: "区別する、見分ける",
    partOfSpeech: "動詞",
    example: "It is hard to distinguish the twins.",
    exampleJp: "双子を見分けるのは難しいです。",
    level: "advanced"
  },
  {
    id: 81,
    english: "comprehensive",
    japanese: "包括的な、総合的な",
    partOfSpeech: "形容詞",
    example: "We need a comprehensive plan.",
    exampleJp: "包括的な計画が必要です。",
    level: "advanced"
  },
  {
    id: 82,
    english: "acquisition",
    japanese: "習得、獲得",
    partOfSpeech: "名詞",
    example: "Language acquisition begins in childhood.",
    exampleJp: "言語の習得は子供時代に始まります。",
    level: "advanced"
  },
  {
    id: 83,
    english: "preliminary",
    japanese: "予備の、準備の",
    partOfSpeech: "形容詞",
    example: "We got the preliminary results of the study.",
    exampleJp: "研究の予備的な結果を得ました。",
    level: "advanced"
  },
  {
    id: 84,
    english: "accommodate",
    japanese: "収容する、対応する",
    partOfSpeech: "動詞",
    example: "The hotel can accommodate 200 guests.",
    exampleJp: "そのホテルは200人の宿泊客を収容できます。",
    level: "advanced"
  },
  {
    id: 85,
    english: "substantial",
    japanese: "かなりの、実質的な",
    partOfSpeech: "形容詞",
    example: "There was a substantial increase in sales.",
    exampleJp: "売上にかなりの増加がありました。",
    level: "advanced"
  },
  {
    id: 86,
    english: "bureaucracy",
    japanese: "官僚主義、お役所仕事",
    partOfSpeech: "名詞",
    example: "Bureaucracy can slow down progress.",
    exampleJp: "官僚主義は進歩を遅らせることがあります。",
    level: "advanced"
  },
  {
    id: 87,
    english: "deteriorate",
    japanese: "悪化する",
    partOfSpeech: "動詞",
    example: "The weather will deteriorate by evening.",
    exampleJp: "天候は夕方までに悪化するでしょう。",
    level: "advanced"
  },
  {
    id: 88,
    english: "predominantly",
    japanese: "主に、大部分は",
    partOfSpeech: "副詞",
    example: "The audience was predominantly young people.",
    exampleJp: "聴衆は主に若い人たちでした。",
    level: "advanced"
  },
  {
    id: 89,
    english: "infrastructure",
    japanese: "インフラ、基盤",
    partOfSpeech: "名詞",
    example: "Good infrastructure is essential for growth.",
    exampleJp: "良いインフラは成長に不可欠です。",
    level: "advanced"
  },
  {
    id: 90,
    english: "unprecedented",
    japanese: "前例のない",
    partOfSpeech: "形容詞",
    example: "This is an unprecedented situation.",
    exampleJp: "これは前例のない状況です。",
    level: "advanced"
  }
];

export const compositionPrompts: CompositionPrompt[] = [
  // === BEGINNER (7 prompts) ===
  { id: 1, japanese: "今朝何を食べましたか？", hint: "breakfast, eat, morning", level: "beginner" },
  { id: 2, japanese: "週末は何をしますか？", hint: "weekend, plan, activity", level: "beginner" },
  { id: 3, japanese: "好きな季節は何ですか？", hint: "favorite, season, because", level: "beginner" },
  { id: 4, japanese: "学校での一番好きな科目は？", hint: "favorite, subject, school", level: "beginner" },
  { id: 5, japanese: "将来の夢は何ですか？", hint: "future, dream, want to be", level: "beginner" },
  { id: 6, japanese: "昨日何をしましたか？", hint: "yesterday, did, activities", level: "beginner" },
  { id: 7, japanese: "趣味は何ですか？", hint: "hobby, free time, enjoy", level: "beginner" },

  // === INTERMEDIATE (7 prompts) ===
  { id: 8, japanese: "友達と何をして遊びますか？", hint: "friends, play, together", level: "intermediate" },
  { id: 9, japanese: "どんな音楽が好きですか？", hint: "music, like, listen", level: "intermediate" },
  { id: 10, japanese: "家族について教えてください", hint: "family, members, live", level: "intermediate" },
  { id: 11, japanese: "環境問題について、あなたの考えを教えてください。", hint: "environment, protect, should", level: "intermediate" },
  { id: 12, japanese: "あなたが尊敬する人は誰ですか？その理由は？", hint: "respect, because, admire", level: "intermediate" },
  { id: 13, japanese: "もし外国に住むなら、どこに住みたいですか？", hint: "if, country, would like to", level: "intermediate" },
  { id: 14, japanese: "テクノロジーは私たちの生活をどう変えましたか？", hint: "technology, change, convenient", level: "intermediate" },

  // === ADVANCED (6 prompts) ===
  { id: 15, japanese: "SNSの良い点と悪い点について論じてください。", hint: "social media, advantage, disadvantage, however", level: "advanced" },
  { id: 16, japanese: "グローバル化が文化に与える影響について述べてください。", hint: "globalization, culture, influence, tradition", level: "advanced" },
  { id: 17, japanese: "AIが将来の仕事に与える影響についてどう思いますか？", hint: "artificial intelligence, replace, opportunity, challenge", level: "advanced" },
  { id: 18, japanese: "教育制度をどのように改善すべきだと思いますか？", hint: "education system, improve, creativity, critical thinking", level: "advanced" },
  { id: 19, japanese: "持続可能な社会を実現するために、私たちは何をすべきですか？", hint: "sustainable, society, responsibility, future generations", level: "advanced" },
  { id: 20, japanese: "読書と動画、どちらが学習に効果的だと思いますか？理由を述べてください。", hint: "reading, video, effective, concentration, compare", level: "advanced" },
];

// Shuffle sentences for the shuffle mode
export interface ShuffleSentence {
  id: number;
  japanese: string;
  english: string;
  level: Level;
}

export const shuffleSentences: ShuffleSentence[] = [
  // === BEGINNER ===
  { id: 1, japanese: "私は毎日英語を勉強します。", english: "I study English every day.", level: "beginner" },
  { id: 2, japanese: "彼女は有名な歌手です。", english: "She is a famous singer.", level: "beginner" },
  { id: 3, japanese: "これは重要なメッセージです。", english: "This is an important message.", level: "beginner" },
  { id: 4, japanese: "私たちは一緒に働きましょう。", english: "Let's work together.", level: "beginner" },
  { id: 5, japanese: "英語は世界共通語です。", english: "English is a global language.", level: "beginner" },
  { id: 6, japanese: "知識は力です。", english: "Knowledge is power.", level: "beginner" },
  { id: 7, japanese: "健康はとても大切です。", english: "Good health is very important.", level: "beginner" },
  { id: 8, japanese: "昨日彼に会いました。", english: "I met him yesterday.", level: "beginner" },
  { id: 9, japanese: "何か質問はありますか？", english: "Do you have any questions?", level: "beginner" },
  { id: 10, japanese: "私は目標を達成したい。", english: "I want to achieve my goals.", level: "beginner" },

  // === INTERMEDIATE ===
  { id: 11, japanese: "英語を話すことは大きな利点です。", english: "Speaking English is a big advantage.", level: "intermediate" },
  { id: 12, japanese: "先生は私にもっと勉強するように励ましました。", english: "My teacher encouraged me to study harder.", level: "intermediate" },
  { id: 13, japanese: "図書館に行くことを提案します。", english: "I suggest we go to the library.", level: "intermediate" },
  { id: 14, japanese: "技術の発展は驚くべきものです。", english: "The development of technology is amazing.", level: "intermediate" },
  { id: 15, japanese: "状況を理解する必要があります。", english: "We need to understand the situation.", level: "intermediate" },
  { id: 16, japanese: "コンテストに参加したいです。", english: "I want to participate in the contest.", level: "intermediate" },
  { id: 17, japanese: "あなたの親切に感謝します。", english: "I appreciate your kindness.", level: "intermediate" },
  { id: 18, japanese: "この2冊の本を比較しましょう。", english: "Let's compare these two books.", level: "intermediate" },
  { id: 19, japanese: "私の英語は徐々に上達しています。", english: "My English is gradually improving.", level: "intermediate" },
  { id: 20, japanese: "健康を維持することが大切です。", english: "It is important to maintain good health.", level: "intermediate" },

  // === ADVANCED ===
  { id: 21, japanese: "すべての行動には結果があります。", english: "Every action has a consequence.", level: "advanced" },
  { id: 22, japanese: "違う視点から物事を見てみましょう。", english: "Try to see things from a different perspective.", level: "advanced" },
  { id: 23, japanese: "持続可能なエネルギー源が必要です。", english: "We need sustainable energy sources.", level: "advanced" },
  { id: 24, japanese: "教育は基本的な権利です。", english: "Education is a fundamental right.", level: "advanced" },
  { id: 25, japanese: "人生において変化は避けられません。", english: "Change is inevitable in life.", level: "advanced" },
  { id: 26, japanese: "知識は時間とともに蓄積されます。", english: "Knowledge accumulates over time.", level: "advanced" },
  { id: 27, japanese: "包括的な計画が必要です。", english: "We need a comprehensive plan.", level: "advanced" },
  { id: 28, japanese: "これは前例のない状況です。", english: "This is an unprecedented situation.", level: "advanced" },
  { id: 29, japanese: "良いインフラは成長に不可欠です。", english: "Good infrastructure is essential for growth.", level: "advanced" },
  { id: 30, japanese: "地球の約70%は水で覆われています。", english: "Approximately 70% of Earth is covered by water.", level: "advanced" },
];

export function getWordsByLevel(level: Level): Word[] {
  return words.filter(w => w.level === level);
}

export function getPromptsByLevel(level: Level): CompositionPrompt[] {
  return compositionPrompts.filter(p => p.level === level);
}

export function getShuffleSentencesByLevel(level: Level): ShuffleSentence[] {
  return shuffleSentences.filter(s => s.level === level);
}

export function getLevelLabel(level: Level): string {
  switch (level) {
    case 'beginner': return '初級';
    case 'intermediate': return '中級';
    case 'advanced': return '上級';
  }
}

export function getLevelColor(level: Level): { bg: string; text: string; gradient: string; border: string } {
  switch (level) {
    case 'beginner':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', gradient: 'from-emerald-400 to-teal-500', border: 'border-emerald-300' };
    case 'intermediate':
      return { bg: 'bg-blue-50', text: 'text-blue-700', gradient: 'from-blue-400 to-indigo-500', border: 'border-blue-300' };
    case 'advanced':
      return { bg: 'bg-purple-50', text: 'text-purple-700', gradient: 'from-purple-400 to-pink-500', border: 'border-purple-300' };
  }
}
