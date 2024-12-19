import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    meetingCode: ""
}

export const MeetingCodeSlice = createSlice({
    initialState,
    name: 'MeetingCode',
    reducers: {
        setMeetingCode: (state, action) => {
            state.meetingCode = action.payload;
        }
    }
})

export const { setMeetingCode } = MeetingCodeSlice.actions;
export default MeetingCodeSlice.reducer;