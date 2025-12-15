import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuth: false,
    driver: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuth = true;
            state.token = action.payload.token;
            state.driver = action.payload.driver;
        },
        logout: (state) => {
            state.isAuth = false;
            state.token = null;
            state.driver = null;
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
