import pathParse from "path-parse";
import firebase from "firebase/app";
import "firebase/storage";
type size = "256x144" | "640x360";
const storageRef = firebase.storage().ref();

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
  return storageRef
    .child(decodeURIComponent(path))
    .getDownloadURL()
    .catch((_err) => filePath);
};

export default imageUrl;
