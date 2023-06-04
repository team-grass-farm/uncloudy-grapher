import { createSlice } from '@reduxjs/toolkit';
import config from 'config';
import { AppStore } from '~models';

const initialState = new AppStore();

export default createSlice({
  name: 'app',
  initialState,
  reducers: {
    init: () => ({
      ...new AppStore(),
      storedVersion: config.VERSION,
    }),
  },
  extraReducers() {},
});
