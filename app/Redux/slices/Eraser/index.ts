import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isEraserOpen: false
}

export const EraserSlice = createSlice({
    initialState,
    name: 'Eraser',
    reducers: {
        setEraser: (state, action) => {
            state.isEraserOpen = action.payload;
        },
    }
})

export const {setEraser} = EraserSlice.actions;
export default EraserSlice.reducer;