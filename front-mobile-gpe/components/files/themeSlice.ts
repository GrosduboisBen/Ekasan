import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
import { LightTheme, DarkTheme } from '../utils/theme';

interface themeSliceState {
  theme: typeof LightTheme;
}

const initialState: themeSliceState = {
  theme: LightTheme,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setLightTheme: (state) => {
      state.theme = LightTheme;
    },
    setDarkTheme: (state) => {
      state.theme = DarkTheme;
    },
  },
});

export const { setLightTheme, setDarkTheme } = themeSlice.actions;

export const selectTheme = (state: RootState) => state.theme.theme;

export default themeSlice.reducer;
