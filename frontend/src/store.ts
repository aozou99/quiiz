import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import rootReducer from './modules/core/rootReducer'

// dev環境時にシリアライズチェックがONだと、
// firebaseのauthをstoreに保存する際にエラーメッセージが表示されるためOFFにする
const middleware = [...getDefaultMiddleware({
  serializableCheck: false
})]

const store = configureStore({
  reducer: rootReducer,
  middleware
})

export type AppDispatch = typeof store.dispatch
export default store