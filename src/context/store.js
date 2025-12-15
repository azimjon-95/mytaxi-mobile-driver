import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api"; // api.js faylidan import
import orderSlice from "./actions/orderSlice";
import { requestPlay } from "./actions/soundSlice";
import authReducer from "./actions/authSlice";



export const store = configureStore({
    reducer: {
        // RTK Query reducer
        [api.reducerPath]: api.reducer,
        // Boshqa slice'lar
        order: orderSlice,
        sound: requestPlay,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});
