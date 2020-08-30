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
            // TypeScriptの定義にogVideoが無いので拡張する
            const result: any = res.result;
            results.push({
              requestUrl: result.requestUrl,
              ogTitle: result.ogTitle,
              ogDescription: result.ogDescription,
              ogImage: result.ogImage,
              ogVideo: result.ogVideo,
            });
          }
        })
        .catch((_e) => null)
    );
  }
  await Promise.all(ogpList);
  return results;
});
