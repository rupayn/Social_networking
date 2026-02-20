/**
 * Redux slice for managing theme state.
 *
 * @module themeSlice
 * @description Handles theme toggling between "light" and "dark" modes using Redux Toolkit.
 *
 * @property {Object} initialState - The initial state of the theme slice
 * @property {string} initialState.value - The current theme mode, defaults to "light"
 *
 * @reducer setTheme - Toggles the theme between "light" and "dark" modes
 * @param {Object} state - The current theme state
 * @returns {void} Updates state.value to the opposite theme
 *
 * @example
 * // In a component:
 * import { useDispatch } from 'react-redux';
 * import { setTheme } from './redux/features/theme.slice';
 *
 * const dispatch = useDispatch();
 * dispatch(setTheme()); // Toggles theme
 */

import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: { value: "light" },
  reducers: {
    setTheme: (state) => {
      if (state.value === "light") {
        state.value = "dark";
      } else {
        state.value = "light";
      }
    },
    setByValue: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setTheme, setByValue } = themeSlice.actions;
export default themeSlice.reducer;
