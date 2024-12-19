import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    noteTextSize: 'text-3xl',
    noteFontFamily: 'font-sans',
    noteBackgroundColor: 'orange-300',
    noteTextBrightness: 100,
    noteTextAlign: 'text-center'
}

export const NoteFeatures = createSlice({
    initialState,
    name: 'NoteFeatures',
    reducers: {
        setNoteTextSize: (state, action) => {
            state.noteTextSize = action.payload;
        },

        setNoteFontFamily: (state, action) => {
            state.noteFontFamily = action.payload;
        },

        setNoteBackgroundColor: (state, action) => {
            state.noteBackgroundColor = action.payload;
        },

        setNoteTextBrightness: (state, action) => {
            state.noteTextBrightness = action.payload;
        },

        setNoteTextAlign: (state, action) => {
            state.noteTextAlign = action.payload;
        }
    }
})

export const {setNoteBackgroundColor, setNoteTextSize, setNoteFontFamily, setNoteTextBrightness, setNoteTextAlign} = NoteFeatures.actions;
export default NoteFeatures.reducer