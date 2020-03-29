import pathParse from "path-parse";
import firebase from "firebase/app";
import "firebase/storage";
const storageRef = firebase.storage().ref();

const imageUrl = async (filePath: string, size: string) => {
  const { ext, dir, name } = pathParse(filePath);
  return storageRef
    .child(`${dir}/${name}_${size}${ext}`)
    .getDownloadURL()
    .catch(_err => filePath);
};

export default imageUrl;
