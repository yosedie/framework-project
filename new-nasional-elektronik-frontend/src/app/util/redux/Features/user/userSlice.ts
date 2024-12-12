'use client';
import { ProductStruct } from "@/app/types/types";
import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    jwt_token: string,
    shopping_cart: ProductStruct[],
}

const initialState: UserState = {
    jwt_token: "",
    shopping_cart: [],
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<ProductStruct>) => {
            state.shopping_cart.push(action.payload)
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.shopping_cart.splice(action.payload, 1)
        },
        removeAllFromCart: (state, _) => {
            state.shopping_cart = []
        },
        login: (state, action) => {
            state.jwt_token = action.payload
        },
        logout: (state, action) => {
            state.jwt_token = ""
        },
    }
})

export const {
    addToCart, 
    removeFromCart, 
    removeAllFromCart, 
    login, 
    logout
} = counterSlice.actions

export default counterSlice.reducer