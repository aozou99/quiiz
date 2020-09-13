// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// エンドポイント
const endpoints = [
  "existDisplayName",
  "updateQuiz",
  "deleteQuiz",
  "getOgpListByUrl",
];
// デプロイ時にすべて読み込む
if (!process.env.FUNCTION_NAME) {
  endpoints.forEach((endpoint) => {
    exports[endpoint] = require(`./function/${endpoint}`);
  });
}
// Cold Start後の実行時に必要な処理だけ読み込む
if (
  process.env.FUNCTION_NAME &&
  endpoints.includes(process.env.FUNCTION_NAME)
) {
  exports[
    process.env.FUNCTION_NAME
  ] = require(`./function/${process.env.FUNCTION_NAME}`);
}

// トリガー
const triggers = [
  "autoDeleteQuizThumbnails",
  "onUserCreate",
  "onDeletePlayList",
  "onSubscribeChannel",
  "onUnSubscribeChannel",
  "onLikeQuiz",
  "onUnLikeQuiz",
  "onCreateQuiz",
  "onDeleteQuiz",
];
triggers.forEach((trigger) => {
  exports[trigger] = require(`./function/${trigger}`);
});
