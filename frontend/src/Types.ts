export type Quiz = {
  id: string
  imgPath: string
  question: string
  choices: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  authorId: string
}