import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/auth';

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