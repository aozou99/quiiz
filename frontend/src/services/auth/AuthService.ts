import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';

type AuthArgs = {
  displayName?: string
  email: string
  password: string
}

class AuthService {
  
  async init() {
    try {
      firebase.app();  
    } catch (error) {
      return fetch('/__/firebase/init.json').then(async response => {
        const json = await response.json();
        firebase.initializeApp(json);
        if (window.location.hostname === 'localhost') {
          firebase.functions().useFunctionsEmulator('http://localhost:5001');
        }
      });   
    }
  }

  async onAuthStateChanged(callback: (user: firebase.User | null) => any) {
    await this.init();
    firebase
      .auth()
      .onAuthStateChanged(callback);
  }

  async signIn({ email, password }: AuthArgs) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => user.user);
  }

  async signUp({ displayName, email, password }: AuthArgs) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        user.user?.updateProfile({
          displayName
        });
        return user.user;
      });
  }

  async existDisplayName(displayName: string) {
    const res = await firebase
    .functions()
    .httpsCallable('existDisplayName')({
      displayName
    });
    return res.data.message;
  }
}

const authService = new AuthService();

export default authService;