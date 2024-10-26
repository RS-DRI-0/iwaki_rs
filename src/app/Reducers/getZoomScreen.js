import { createSlice } from '@reduxjs/toolkit';

const zoomSlice = createSlice({
  name: 'zoom',
  initialState: {
    zoomLevel: window.devicePixelRatio * 100,
  },
  reducers: {
    setZoomLevel: (state, action) => {
      state.zoomLevel = action.payload;
    },
  },
});

export const { setZoomLevel } = zoomSlice.actions;
export default zoomSlice.reducer;