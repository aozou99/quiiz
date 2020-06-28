export type Quiz = {
  id: string;
  imgPath: string;
  question: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  authorId: string;
};

export type ExerciseFormTextData = {
  question: string;
  thumbnail?: string;
  selectA: string;
  selectB: string;
  selectC: string;
  selectD: string;
  description?: string;
  tags?: string;
};

export type ExerciseFormSelectData = {
  answer: 0 | 1 | 2 | 3;
  privacy: 0 | 1;
};

export type ExerciseFormData = ExerciseFormTextData & ExerciseFormSelectData;

export type ExerciseData = ExerciseFormData & {
  id: string;
  thumbnail: string;
  tags: string[];
};

export type ExerciseTableRowData = ExerciseData & {
  accuracyRate: number;
  createdAt: Date;
  limit: string;
};

export type ExerciseFullData = ExerciseTableRowData & {
  userId: string;
};

export type ExerciseResult = "right" | "wrong" | undefined;
