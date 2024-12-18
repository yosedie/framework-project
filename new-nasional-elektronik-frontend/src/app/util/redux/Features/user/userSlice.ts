'use client';
import { ProductStruct } from "@/app/types/types";
import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    role: string,
    jwt_token: string,
    payment_info: string,
    shopping_cart: ProductStruct[],
}

const initialState: UserState = {
    role: "",
    jwt_token: "",
    payment_info: "",
    shopping_cart: [],
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setPaymentInfo: (state, action) => {
            state.payment_info = action.payload
        },
        addToCart: (state, action: PayloadAction<ProductStruct>) => {
            state.shopping_cart.push(action.payload)
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.shopping_cart = state.shopping_cart.filter(data => data.id_produk !== action.payload)
        },
        removeAllFromCart: (state, _) => {
            state.shopping_cart = []
        },
        changeRole: (state, action) => {
            state.role = action.payload
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
    setPaymentInfo,
    addToCart, 
    removeFromCart, 
    removeAllFromCart,
    changeRole,
    login, 
    logout
} = counterSlice.actions

export default counterSlice.reducer