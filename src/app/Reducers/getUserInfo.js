import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userInfoURL } from '../../constants';
import { authAxios } from '../../api/axiosClient';


const initialState = {
    status: 'idle',
    userInfo:{},
    timeSystem:null,
    error:null
};

export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async (token,{rejectWithValue}) => {
    try {
      const response = await authAxios().get(userInfoURL);
      return response.data;
    }
    catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

// export const getSystemInfo = createAsyncThunk(
//   'user/getSystemInfo',
//   async (token,{rejectWithValue}) => {
//     try {
//       const response = await authAxios().get(systemInfoURL);
//       return response.data.time_system;
//     }
//     catch (e) {
//       return rejectWithValue(e.response.data);
//     }
//   }

// );


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.status = 'loading';

      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userInfo = action.payload
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.status = 'idle';
      })
      //   .addCase(getSystemInfo.pending, (state) => {
      //   state.status = 'loading';

      // })
      // .addCase(getSystemInfo.fulfilled, (state, action) => {
      //   state.status = 'idle';
      //   state.timeSystem = action.payload
      // })
      // .addCase(getSystemInfo.rejected, (state, action) => {
      //   state.status = 'idle';
      // })
  },
});

export default userSlice.reducer;