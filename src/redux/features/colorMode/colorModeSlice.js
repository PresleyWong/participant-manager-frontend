import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: localStorage.getItem("chakra-ui-color-mode"),
};

export const colorModeSlice = createSlice({
  initialState,
  name: "colorModeSlice",
  reducers: {
    toggleColorMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export default colorModeSlice.reducer;
export const { toggleColorMode } = colorModeSlice.actions;
export const selectCurrentColorMode = (state) => state.colorMode.mode;
