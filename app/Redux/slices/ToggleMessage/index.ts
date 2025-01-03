import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    toggle: false,
    users: false,
    chat: false
}

export const ToggleMessageSlice = createSlice({
    initialState,
    name: "ToggleMessage",
    reducers: {
        setToggleUsers: (state,action) => {
            state.users = action.payload;
        },
        setToggleChat: (state, action) => {
            state.chat = action.payload;
        },
        setToggle: (state, action) => {
            state.toggle = action.payload;
        }
    }
})

export const { setToggleChat, setToggleUsers, setToggle } = ToggleMessageSlice.actions;
export default ToggleMessageSlice.reducer;