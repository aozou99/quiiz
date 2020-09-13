import * as functions from "firebase-functions";

export default functions.region("asia-northeast1").runWith({
  timeoutSeconds: 30,
  memory: "2GB",
});
