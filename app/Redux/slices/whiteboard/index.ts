import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openedWhiteboard: {
        texts: [],
        shapes: [],
        notes: [],
        images: []
    },
}

export const WhiteboardSlice = createSlice({
    initialState,
    name: "Whiteboard",
    reducers: {
        setOpenedWhiteboard: (state, action) => {
            state.openedWhiteboard = action.payload;
        }
    }
})

export const { setOpenedWhiteboard } = WhiteboardSlice.actions;
export default WhiteboardSlice.reducer; 