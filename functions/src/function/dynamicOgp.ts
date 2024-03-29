import * as functions from "firebase-functions";
import admin from "../core/admin";
import convertQuizResponse from "../helper/convertQuizResponse";

const db = admin.firestore();
const prefixPath = "/play/";

module.exports = functions
  .region("us-central1")
  .runWith({
    timeoutSeconds: 30,
    memory: "2GB",
  })
  .https.onRequest(async (req, res) => {
    const list = req.query.list as string;
    const index = req.query.index as string;
    const queryString = new URLSearchParams(
      filterQueryString({ list, index })
    ).toString();
    const quizId = req.path.split(prefixPath)[1];
    const result = await db
      .collectionGroup("quizzes")
      .where("id", "==", quizId)
      .get();
    if (result.size < 1) {
      res.status(404).send("Not Found Quizz");
      return;
    }
    const quiz = await convertQuizResponse(result.docs[0]);
    const age = 86400 * 30;
    res.set("Cache-Control", `public, max-age=${age}, s-maxage=${age}`);
    res.status(200).send(
      buildHtml(
        quizId,
        {
          title: quiz.question,
          text: `①${quiz.selectA} ②${quiz.selectB} ③${quiz.selectC} ④${quiz.selectD}`,
          img: quiz.thumbnail["640x360"],
        },
        queryString
      )
    );
  });

const buildHtml = (id: string, obj: any, queryString: string) => {
  return `
  <!DOCTYPE html>
    <head>
      <title>${obj.title}</title>
      <meta property="og:title" content="${obj.title}">
      <meta property="og:image" content="${obj.img}">
      <meta
        property="og:description"
        content="${obj.text}"
      />
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${obj.title}">
      <meta name="twitter:description" content="${obj.text}">
      <meta name="twitter:image" content="${obj.img}">
      <link rel="canonical" href="/play/${id}">
    </head>
    <body>
      <script>window.location="/play/${id}${
    queryString ? `?${queryString}` : ""
  }";</script>
    </body>
  </html>`;
};

const filterQueryString = (queryObj: any) => {
  const rs: any = {};
  for (const key in queryObj) {
    if (queryObj[key]) rs[key] = queryObj[key];
  }
  return rs;
};
