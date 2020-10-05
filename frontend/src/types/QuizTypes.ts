export type Quiz = {
  id: string;
  imgPath: string;
  question: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  authorId: string;
};

export type QuizFormTextData = {
  question: string;
  thumbnail?: string;
  selectA: string;
  selectB: string;
  selectC: string;
  selectD: string;
  description?: string;
  tags?: string;
  references?: string;
};

export type QuizFormSelectData = {
  answer: 0 | 1 | 2 | 3;
  privacy: 0 | 1;
};

export type QuizFormData = QuizFormTextData & QuizFormSelectData;

export type QuizData = QuizFormData & {
  id: string;
  thumbnail: string;
  tags: string[];
  references: any[];
};

export type QuizTableRowData = QuizData & {
  accuracyRate: number;
  createdAt: Date;
  limit: string;
};

export type QuizFullData = QuizTableRowData & {
  userId: string;
};

export type QuizResult = "right" | "wrong" | undefined;

export type QuizDisplay = {
  id: string;
  thumbnail: { "256x144": string; "640x360": string };
  question: string;
  authorId: string;
  authorName: string;
  authorImageUrl: string;
  selectA: string;
  selectB: string;
  selectC: string;
  selectD: string;
  answer: 0 | 1 | 2 | 3;
  description: string;
  references: any[];
  tags: string[];
};
