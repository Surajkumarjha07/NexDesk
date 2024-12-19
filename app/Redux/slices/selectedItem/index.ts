import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedItem: ""
}

export const SelectedItemSlice = createSlice({
    initialState,
    name: "selectedItem",
    reducers: {
        setSelectedItem: (state, action) => {
            state.selectedItem = action.payload;
            console.log("sel: ", action.payload);            
        }
    }
})

export const { setSelectedItem } = SelectedItemSlice.actions;
export default SelectedItemSlice.reducer;