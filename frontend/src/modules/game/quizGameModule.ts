import { Quiz } from "types/ExerciseTypes";
import { createSlice } from "@reduxjs/toolkit";

type State = {
  isGameStart: boolean;
  quiz: Quiz;
  result: "right" | "wrong" | null;
};

const initialState: State = {
  isGameStart: false,
  quiz: {
    id: "userid-timestamp",
    imgPath: "/images/mock/animal/resize_harinezumi.jpg",
    question: "ハリネズミの針は何本ある？",
    choices: ["1000~3000本", "3000~5000本", "5000~7000本", "7000~9000本"],
    answer: 2,
    authorId: "1"
  },
  result: null
};

const quizGameModule = createSlice({
  name: "quizGame",
  initialState,
  reducers: {
    gameStart(state: State) {
      state.isGameStart = true;
    },
    gameOver(state: State) {
      state.result = "wrong";
    },
    gameClear(state: State) {
      state.result = "right";
    }
  }
});

export const { gameStart, gameOver, gameClear } = quizGameModule.actions;

export default quizGameModule;
