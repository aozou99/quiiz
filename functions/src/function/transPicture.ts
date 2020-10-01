import * as functions from "firebase-functions";
import admin from "../core/admin";
import path from "path";
import os from "os";
import sharp from "sharp";
import fs from "fs";

const storage = admin.storage();
const prefixPath = "/freepic/";

module.exports = functions
  .region("us-central1")
  .runWith({
    timeoutSeconds: 30,
    memory: "2GB",
  })
  .https.onRequest(async (req, res) => {
    const sourcePath = req.path.split(prefixPath)[1];
    const tempPath = await loadImageFile(sourcePath);
    const buffer = await loadImageBuffer(tempPath);
    fs.unlinkSync(tempPath);
    const contentType = `image/webp`;
    const age = 86400 * 30;

    res.set("Content-Type", contentType);
    res.set("Cache-Control", `public, max-age=${age}, s-maxage=${age}`);
    // add Vary header only for reqs that need auto detection
    // res.set("Vary", "Accept-Encoding, Accept");
    res.status(200).send(buffer);
  });

const loadImageFile = async (sourcePath: string) => {
  const bucket = storage.bucket();
  const tempPath = path.join(
    os.tmpdir(),
    `dl_${Math.random()}_${Math.random()}`
  );
  await bucket
    .file(sourcePath)
    .download({
      destination: tempPath,
    })
    .catch((err) => {
      console.warn(err);
      return;
    });
  return tempPath;
};

const loadImageBuffer = async (tempPath: string) => {
  const buffer = sharp(tempPath);
  buffer.webp({
    quality: 70,
  });
  return await buffer.toBuffer();
};
