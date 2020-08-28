import functions from "../core/functions";
import { HttpsError } from "firebase-functions/lib/providers/https";
import ogs from "open-graph-scraper";

module.exports = functions.https.onCall(async (data, _context) => {
  if (!data.urls || !Array.isArray(data.urls)) {
    throw new HttpsError("invalid-argument", "urls is required");
  }

  const targetUrls: string[] = data.urls;
  const ogpList = [];
  const results: any = [];

  for (const url of targetUrls) {
    ogpList.push(
      ogs({
        url,
      })
        .then((res) => {
          if (!res.error) {
            results.push({
              requestUrl: res.result.requestUrl,
              ogTitle: res.result.ogTitle,
              ogDescription: res.result.ogDescription,
              ogImage: res.result.ogImage,
            });
          }
        })
        .catch((_e) => null)
    );
  }
  await Promise.all(ogpList);
  return results;
});
