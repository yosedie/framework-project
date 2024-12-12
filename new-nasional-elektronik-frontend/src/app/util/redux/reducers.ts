'use client';

import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from './Features/counter/counterSlice'
import accountReducer from './Features/account/accountSlice'

// Combine all reducers into a single root reducer
const rootReducers = combineReducers({
  counter: counterReducer,
  account: accountReducer,
});

export default rootReducers;

// export type RootState = ReturnType<typeof storeReducers.getState>
// export type AppDispatch = typeof storeReducers.dispatch

