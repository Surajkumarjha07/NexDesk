import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userEmail: "",
    username: "",
    disconnectedUser: ""
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
        },
        setDisconnectedUser: (state, action) => {
            state.disconnectedUser = action.payload;
        }
    }
})

export const { setUserEmail, setUserName, setDisconnectedUser } = UserSlice.actions;
export default UserSlice.reducer;
