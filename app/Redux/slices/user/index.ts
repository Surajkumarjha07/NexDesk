import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userEmail: "",
    username: ""
}

export const UserSlice = createSlice({
    initialState,
    name: "UserCredential",
    reducers: {
        setUserEmail: (state, action) => {
            state.userEmail = action.payload;
        },
        setUserName: (state, action) => {
            state.username = action.payload;
        }
    }
})

export const { setUserEmail, setUserName } = UserSlice.actions;
export default UserSlice.reducer;
