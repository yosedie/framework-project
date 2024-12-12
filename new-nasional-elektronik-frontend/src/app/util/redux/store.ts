'use client';

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Features/counter/counterSlice'
import userReducer from './Features/user/userSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch