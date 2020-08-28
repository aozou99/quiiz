import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import "firebase/auth";
import "firebase/storage";

class OgpService {
  getOpg(urls: string[]) {
    return firebase
      .functions()
      .httpsCallable("getOgpListByUrl")({ urls })
      .then((res) => res.data);
  }
}

export default new OgpService();
