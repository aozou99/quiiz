import pathParse from "path-parse";
import firebase from "firebase/app";
import "firebase/storage";
const storageRef = firebase.storage().ref();

const imageUrl = async (filePath: string, size: string) => {
  const { ext, dir, name } = pathParse(filePath);
  const url = await storageRef
    .child(`${dir}/${name}_${size}${ext}`)
    .getDownloadURL();
  return url;
};

export default imageUrl;
