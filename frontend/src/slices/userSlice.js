import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
    lastViewedUser: {},
  },
  reducers: {
    userSignIn: (state, action) => {
      return { ...state, userInfo: action.payload };
    },
    editProfilePic: (state, action) => {
      return {
        ...state,
        userInfo: { ...state.userInfo, avatarURL: action.payload },
      };
    },
    editCoverPic: (state, action) => {
      return {
        ...state,
        userInfo: { ...state.userInfo, coverURL: action.payload },
      };
    },

    userSignOut: (state) => {
      return {
        ...state,
        userInfo: null,
      };
    },
    viewUserProfile: (state, action) => {
      return {
        ...state,
        lastViewedUser: action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  userSignIn,
  userSignOut,
  editProfilePic,
  editCoverPic,
  viewUserProfile,
} = userSlice.actions;

export default userSlice.reducer;
