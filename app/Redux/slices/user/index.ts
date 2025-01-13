import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userEmail: "",
    username: "",
    disconnectedUser: "",
    confirmSaveWhiteboard: false
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
        },
        setConfirmSaveWhiteboard: (state, action) => {
            state.confirmSaveWhiteboard = action.payload;
        }
    }
})

export const { setUserEmail, setUserName, setDisconnectedUser, setConfirmSaveWhiteboard } = UserSlice.actions;
export default UserSlice.reducer;
