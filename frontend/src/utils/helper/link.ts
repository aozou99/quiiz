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

export const contactUsLink = () => {
  return "https://forms.gle/Rj1a8TQ6aDfRMeUu9";
};

const queryString = (query: URLSearchParams, encode = false) => {
  const WHITE_LIST_KEY = ["list", "index"];
  const qsObj: any = {};
  WHITE_LIST_KEY.forEach(key => {
    const value = query.get(key);
    if (value && value !== "undefined") {
      qsObj[key] = value;
    }
  });
  const qs = new URLSearchParams(qsObj);
  return qs.toString() && qs.get("list") !== "LL"
    ? `?${encode ? encodeURIComponent(qs.toString()) : qs.toString()}`
    : "";
};
