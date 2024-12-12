'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
    jwt_token: string
}

const initialState: UserState = {
    jwt_token: ""
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        login: (state, action) => {
            state.jwt_token = action.payload
        },
        logout: (state, action) => {
            state.jwt_token = ""
        },
    }
})

export const {login, logout} = counterSlice.actions

export default counterSlice.reducer