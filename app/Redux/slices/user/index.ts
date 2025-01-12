import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userEmail: "",
    username: "",
    disconnectedUser: "",
    saveWhiteBoard: false
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
        setSaveWhiteBoard: (state, action) => {
            state.saveWhiteBoard = action.payload;
            console.log(state.saveWhiteBoard);            
        }
    }
})

export const { setUserEmail, setUserName, setDisconnectedUser, setSaveWhiteBoard } = UserSlice.actions;
export default UserSlice.reducer;
