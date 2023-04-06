import { configureStore } from "@reduxjs/toolkit";
import { indexApi } from "./api/indexApi";
import authReducer from "./features/auth/authSlice";
import colorModeReducer from "./features/colorMode/colorModeSlice";

export const store = configureStore({
  reducer: {
    [indexApi.reducerPath]: indexApi.reducer,
    auth: authReducer,
    colorMode: colorModeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([indexApi.middleware]),
});
