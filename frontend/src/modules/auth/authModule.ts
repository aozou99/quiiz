import { createSlice } from '@reduxjs/toolkit';

type State = {
  auth: boolean
}

const initialState: State = {
  auth: true
}

const authModule = createSlice({
  name: 'mosaicQuizGame',
  initialState,
  reducers: {
    login(state:State) {
      state.auth = true;
    },
    logout(state:State) {
      state.auth = false;
    }
  }
})

export const {
  login,
  logout
} = authModule.actions;

export default authModule;