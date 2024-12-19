import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    toggle: false
}

export const ToggleSlice = createSlice({
    initialState,
    name: 'Toggle',
    reducers: {
        setToggle: (state, action) => {
            state.toggle = action.payload;
        }
    }
})

export const {setToggle} = ToggleSlice.actions;
export default ToggleSlice.reducer;