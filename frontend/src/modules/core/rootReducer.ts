import { combineReducers } from '@reduxjs/toolkit';
import { firebaseReducer } from "react-redux-firebase";
import quizGameModule from 'modules/game/quizGameModule';
import authModule from 'modules/auth/authModule';
import { firestoreReducer } from 'redux-firestore';


const rootReducer = combineReducers({
  quizGame: quizGameModule.reducer,
  auth: authModule.reducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer