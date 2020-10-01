import * as functions from "firebase-functions";
import sharp from "sharp";
import fetch from "node-fetch";

const prefixPath = "/freepic/";

module.exports = functions
  .region("us-central1")
  .runWith({
    timeoutSeconds: 30,
    memory: "2GB",
  })
  .https.onRequest(async (req, res) => {
    const domain = req.query.domain as string;
    const version = req.query.version as string;
    console.log(version);
    const sourcePath = req.path.split(prefixPath)[1];
    const imgBuffer = await loadImageFile(domain, sourcePath, version);
    const buffer = await loadImageBuffer(imgBuffer);
    const contentType = `image/webp`;
    const age = 86400 * 30;

    res.set("Content-Type", contentType);
    res.set("Cache-Control", `public, max-age=${age}, s-maxage=${age}`);
    // add Vary header only for reqs that need auto detection
    // res.set("Vary", "Accept-Encoding, Accept");
    res.status(200).send(buffer);
  });

const loadImageFile = async (
  domain: string,
  sourcePath: string,
  version: string
) => {
  return await fetch(
    `https://storage.googleapis.com/${domain}/${sourcePath}?${version}`
  ).then((res) => res.buffer());
};

const loadImageBuffer = async (imgBuffer: Buffer) => {
  const buffer = sharp(imgBuffer);
  buffer.webp({
    quality: 80,
  });
  return await buffer.toBuffer();
};
