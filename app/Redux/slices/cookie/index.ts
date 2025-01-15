import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cookie: ""
}

export const CookieSlice = createSlice({
    initialState,
    name: "Cookie",
    reducers: {
        setCookie: (state, action) => {
            state.cookie = action.payload;
        }
    }
})

export const { setCookie } = CookieSlice.actions;
export default CookieSlice.reducer;