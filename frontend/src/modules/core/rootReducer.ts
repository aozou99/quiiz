import { combineReducers } from '@reduxjs/toolkit';
import quizGameModule from 'modules/game/quizGameModule';
import authModule from 'modules/auth/authModule';

const rootReducer = combineReducers({
  quizGame: quizGameModule.reducer,
  auth: authModule.reducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer