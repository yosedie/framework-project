'use client';

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Features/counter/counterSlice'
import accountReducer from './Features/account/accountSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    account: accountReducer,
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch