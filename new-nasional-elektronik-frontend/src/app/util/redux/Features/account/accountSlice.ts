'use client';

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountStruct {
    jwt_token: string,
}

interface AccountState {
    account: AccountStruct | null,
}

const initialState: AccountState = {
    account: null,
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        loginAccount: (state, action: PayloadAction<AccountStruct>) => {
            state.account = action.payload
        },
        logoutAccount: (state, _) => {
            state.account = null
        },
    }
})

export const {loginAccount, logoutAccount} = counterSlice.actions

export default counterSlice.reducer