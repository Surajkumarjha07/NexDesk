import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    functionality: ""
}

export const FunctionalitySlice = createSlice({
    initialState,
    name: 'Functionality',
    reducers: {
        setFunctionality: (state, action) => {
            state.functionality = action.payload;  
        }
    }
})

export const { setFunctionality } = FunctionalitySlice.actions;
export default FunctionalitySlice.reducer;