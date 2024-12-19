import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    textColor: 'black',
    textSize: 'text-3xl',
    fontFamily: 'font-sans',
    textBrightness: 100,
    textAlign: "text-start"
}

export const TextFeatures = createSlice({
    initialState,
    name: 'TextFeatures',
    reducers: {
        setTextColor: (state, action) => {
            state.textColor = action.payload;   
        },
        setTextSize: (state, action) => {
            state.textSize = action.payload;
        },
        setFontFamily: (state, action) => {
            state.fontFamily = action.payload;
        },
        setTextBrightness: (state, action) => {
            state.textBrightness = action.payload;
        },
        setTextAlign: (state, action) => {
            state.textAlign = action.payload;
        }
    }
})

export const {setTextColor, setTextSize, setFontFamily, setTextBrightness, setTextAlign} = TextFeatures.actions;
export default TextFeatures.reducer;