export type Quiz = {
  id: string;
  imgPath: string;
  question: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  authorId: string;
};

export type ExerciseFormData = {
  question: string;
  thumbnail?: string;
  selectA: string;
  selectB: string;
  selectC: string;
  selectD: string;
  answer: string;
  description?: string;
  privacy: string;
  tags?: string;
};

export type ExerciseTableRowData = ExerciseFormData & {
  id: string;
  thumbnail: string;
  tags: string[];
  accuracyRate: number;
  createdAt: Date;
  limit: string;
};
