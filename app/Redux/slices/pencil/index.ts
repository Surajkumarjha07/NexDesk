import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    thickness: 5,
    color: '#000000'
}

export const PencilSlice = createSlice({
    initialState,
    name: 'PencilFeatures',
    reducers: {
        setPencilThickness: (state, action) => {
            state.thickness = action.payload;
        },
        setColor: (state, action) => {
            state.color = action.payload;
        }
    }
})

export const {setPencilThickness, setColor} = PencilSlice.actions;
export default PencilSlice.reducer;