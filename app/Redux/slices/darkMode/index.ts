import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isDarkMode: false
}

export const DarkModeSlice = createSlice({
    initialState,
    name: "DarkMode",
    reducers: {
        setIsDarkMode: (state, action) => {
            state.isDarkMode = action.payload;
        }
    }
})

export const { setIsDarkMode } = DarkModeSlice.actions;
export default DarkModeSlice.reducer;