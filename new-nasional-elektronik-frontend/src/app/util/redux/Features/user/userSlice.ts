'use client';
import { ProductStruct, VerifyTokenData } from "@/app/types/types";
import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    role: string,
    jwt_token: string,
    shopping_cart: ProductStruct[],
    userData: VerifyTokenData,
}

const initialState: UserState = {
    role: "",
    jwt_token: "",
    shopping_cart: [],
    userData: {
        role: "",
        nama: "",
        email: "",
        telepon: "",
        picture_profile: "",
    },
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
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
        changePictureProfile: (state, action: PayloadAction<string>) => {
            state.userData.picture_profile = action.payload
        },
        changeUserData: (state, action: PayloadAction<VerifyTokenData>) => {
            state.userData = action.payload
        },
        login: (state, action) => {
            state.jwt_token = action.payload
        },
        logout: (state, action) => {
            state.jwt_token = ""
            state.userData = {
                role: "",
                nama: "",
                email: "",
                telepon: "",
                picture_profile: "",
            }
        },
    }
})

export const {
    addToCart, 
    removeFromCart, 
    removeAllFromCart,
    changeRole,
    changePictureProfile,
    changeUserData,
    login, 
    logout
} = counterSlice.actions

export default counterSlice.reducer