import firebase from 'firebase/app';
import 'firebase/auth';

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
}

const authService = new AuthService();

export default authService;