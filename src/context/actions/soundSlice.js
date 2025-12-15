import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    playRequest: false, // sound chalish signal
};

const soundSlice = createSlice({
    name: 'sound',
    initialState,
    reducers: {
        requestPlay: (state) => {
            state.playRequest = !state.playRequest; // toggle qilamiz
        },
    },
});

export const { requestPlay } = soundSlice.actions;
export default soundSlice.reducer;
