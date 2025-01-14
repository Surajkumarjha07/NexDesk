import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    meetingCode: "",
    fetchedMeetingCode: "",
    isNewMeeting: false
}

export const MeetingCodeSlice = createSlice({
    initialState,
    name: 'MeetingCode',
    reducers: {
        setMeetingCode: (state, action) => {
            state.meetingCode = action.payload;
        },
        setFetchedMeetingCode: (state, action) => {
            state.fetchedMeetingCode = action.payload;
        },
        setIsNewMeeting: (state, action) => {
            state.isNewMeeting = action.payload;
        }
    }
})

export const { setMeetingCode, setFetchedMeetingCode, setIsNewMeeting } = MeetingCodeSlice.actions;
export default MeetingCodeSlice.reducer;