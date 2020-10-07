import * as functions from "firebase-functions";

module.exports = functions
  .region("us-central1")
  .runWith({
    timeoutSeconds: 30,
    memory: "2GB",
  })
  .https.onRequest(async (req, res) => {
    console.log(req.path);
    res.status(200).send(req.path);
  });
