export const twitterLink = (account: string) =>
  `https://twitter.com/${account}`;

export const twitterShare = (quiz: any, query: URLSearchParams) =>
  `https://twitter.com/share?url=https://quiiz.space/o/play/${
    quiz.id
  }${queryString(query, true)}&text=${quiz.question}&hashtags=${["Quiiz"]
    .concat(quiz.tags)
    .join(",")}`;

export const shareQuizLink = (quizId: string, query: URLSearchParams) =>
  `${process.env.REACT_APP_QUIZ_SHARE_URL}${quizId}${queryString(query)}`;

const queryString = (query: URLSearchParams, encode = false) =>
  query.toString()
    ? `?${encode ? encodeURIComponent(query.toString()) : query.toString()}`
    : "";
