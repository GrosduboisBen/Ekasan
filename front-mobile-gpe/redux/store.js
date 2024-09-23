import appReducer from './reducers/appReducer';
import imagesSlice from '../components/files/imagesSlice';
import snackbarSlice from '../components/files/snackbarSlice';
import tabbarStyleSlice from '../components/files/tabbarStyleSlice';
import themeSlice from '../components/files/themeSlice';
import { configureStore } from '@reduxjs/toolkit';




export const store = configureStore({
    reducer: {
      users: appReducer,
      images: imagesSlice,
      theme: themeSlice,
      snackbar: snackbarSlice,
      tabbarStyle: tabbarStyleSlice,
    },
  });


export default store;

