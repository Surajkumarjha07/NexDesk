import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";

const initialState = {
    isLogin: false
}

export const LoginSlice = createSlice({
    initialState,
    name: 'Login',
    reducers: {
        setLogin: (state, action) => {
            // let 
        }
    }
})