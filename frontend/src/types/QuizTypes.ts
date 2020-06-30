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
