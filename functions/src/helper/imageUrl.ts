import pathParse from "path-parse";
import admin from "../core/admin";
type size = "256x144" | "640x360";
const storageRef = admin.storage();

const imageUrl = async (filePath: string, size: size) => {
  if (!filePath) return undefined;
  let path = "";
  const { ext, name, dir } = pathParse(filePath);
  // nameを分解
  const parts = name.split("_");
  if (parts.length >= 2) {
    // basename_createdDate_size.ext
    path = `${dir}/${parts[0]}_${parts[1]}_${size}${ext.replace(/\?.+/, "")}`;
  } else {
    path = `${dir}/${name}_${size}${ext}`;
  }
  // 有効期限を設定
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  const url = await storageRef
    .bucket()
    .file(decodeURIComponent(path))
    .getSignedUrl({
      action: "read",
      expires: expires,
    });
  return url[0];
};

export default imageUrl;
