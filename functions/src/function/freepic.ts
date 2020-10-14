import * as functions from "firebase-functions";
import sharp from "sharp";
import fetch from "node-fetch";

module.exports = functions
  .region("asia-northeast1")
  .runWith({
    timeoutSeconds: 30,
    memory: "2GB",
  })
  .https.onRequest(async (req, res) => {
    const domain = req.query.domain as string;
    const size = fileterSize(req.query.size as string);

    const version = req.query.version as string;
    const sourcePath = req.path.substr(1);
    try {
      const imgBuffer = await loadImageFile(domain, sourcePath, version);
      const buffer = await loadImageBuffer(imgBuffer, size);
      const contentType = `image/webp`;
      const age = 86400 * 30;
      res.set("Content-Type", contentType);
      res.set("Cache-Control", `public, max-age=${age}, s-maxage=${age}`);
      res.set("Access-Control-Allow-Origin", "https://quiiz.space");
      res.status(200).send(buffer);
    } catch (error) {
      console.error(error);
      const age = 30;
      res.set("Cache-Control", `public, max-age=${age}, s-maxage=${age}`);
      res.set("Access-Control-Allow-Origin", "https://quiiz.space");
      res.status(500);
    }
  });

const fileterSize = (size: string) => {
  const [width, height] = size.split("x");
  if (Number.isInteger(Number(width)) && Number.isInteger(Number(height))) {
    return {
      width: Number(width),
      height: Number(height),
    };
  }
  return null;
};

const loadImageFile = async (
  domain: string,
  sourcePath: string,
  version?: string
) => {
  return await fetch(
    `https://storage.googleapis.com/${domain}/${sourcePath}${
      version ? `?${version}` : ""
    }`
  ).then((res) => res.buffer());
};

const loadImageBuffer = async (
  imgBuffer: Buffer,
  resize: { height: number; width: number } | null
) => {
  let buffer = sharp(imgBuffer);
  if (resize) {
    buffer = buffer.resize(resize.width, resize.height);
  }
  buffer.webp({
    quality: 80,
  });
  return await buffer.toBuffer();
};
