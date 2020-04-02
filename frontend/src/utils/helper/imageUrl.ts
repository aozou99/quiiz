import pathParse from "path-parse";
import firebase from "firebase/app";
import "firebase/storage";
type size = "256x144" | "640x360";
const storageRef = firebase.storage().ref();

const imageUrl = async (filePath: string, size: size) => {
  if (!filePath) return undefined;
  const { ext, dir, name } = pathParse(filePath);
  return storageRef
    .child(`${dir}/${name}_${size}${ext}`)
    .getDownloadURL()
    .catch(_err => filePath);
};

export default imageUrl;
