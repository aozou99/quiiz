export const twitterLink = (account: string) =>
  `https://twitter.com/${account}`;

export const twitterShare = (quiz: any) =>
  `https://twitter.com/share?url=https://quiiz.space/o/play/${
    quiz.id
  }&text=${quiz.question}&hashtags=${['Quiiz']
    .concat(quiz.tags)
    .join(',')}`;

export const shareQuizLink = (quizId: string) =>
  `https://quiiz.space/o/play${quizId}`;
