import config from '~config';
import { AppStore } from '~models';

import { createSlice } from '@reduxjs/toolkit';

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
