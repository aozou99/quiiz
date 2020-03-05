import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/auth';

type AuthArgs = {
  displayName?: string
  email: string 
  password: string
}

type State = {
  user: firebase.User | null
}

const initialState: State = {
  user: null
}

const authModule = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state: State, action: PayloadAction<{ user: firebase.User | null }>) {
      state.user = action.payload.user;
    },
    signOut(state: State) {
      firebase
        .auth()
        .signOut();
      state.user = null;
    }
  }
})

export const {
  signOut,
  setUser,
} = authModule.actions;

export default authModule;

export const signUp = ({displayName, email, password}: AuthArgs) => {
  return async (dispatch: Dispatch) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        user.user?.updateProfile({
          displayName
        });
        dispatch(setUser({ user: user.user }));
      })
      .catch(reason => {
        console.error(reason);
      })
  }
}

export const signIn = ({ email, password }: AuthArgs) => {
  return async (dispatch: Dispatch) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(setUser({ user: user.user }));
      })
      .catch(reason => {
        console.error(reason);
      })
  }
}
