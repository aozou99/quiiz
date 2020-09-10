import { functions } from "utils/firebase/functions";

class OgpService {
  getOpg(urls: string[]) {
    return functions
      .httpsCallable("getOgpListByUrl")({ urls })
      .then((res) => res.data);
  }
}

export default new OgpService();
