import { createSlice } from '@reduxjs/toolkit';

export const statusSlice = createSlice({
  name: 'status',
  initialState: {
    CREATE: false,
    FETCH: false,
    UPDATE: false,
    DELETE: false,
    ERROR: null,
  },
  reducers: {
    CREATE_REQUEST: (state) => {
      return { ...state, CREATE: true };
    },
    CREATE_SUCCESS: (state) => {
      return { ...state, CREATE: false };
    },
    CREATE_FAIL: (state, action) => {
      return { ...state, CREATE: false, ERROR: action.payload };
    },
    FETCH_REQUEST: (state) => {
      return { ...state, FETCH: true };
    },
    FETCH_SUCCESS: (state) => {
      return { ...state, FETCH: false };
    },
    FETCH_FAIL: (state, action) => {
      return { ...state, FETCH: false, ERROR: action.payload };
    },
    UPDATE_REQUEST: (state) => {
      return { ...state, UPDATE: true };
    },
    UPDATE_SUCCESS: (state) => {
      return { ...state, UPDATE: false };
    },
    UPDATE_FAIL: (state, action) => {
      return { ...state, UPDATE: false, ERROR: action.payload };
    },
    DELETE_REQUEST: (state) => {
      return { ...state, DELETE: true };
    },
    DELETE_SUCCESS: (state) => {
      return { ...state, DELETE: false };
    },
    DELETE_FAIL: (state, action) => {
      return { ...state, DELETE: false, ERROR: action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  FETCH_REQUEST,
  FETCH_FAIL,
  FETCH_SUCCESS,
  UPDATE_REQUEST,
  UPDATE_FAIL,
  UPDATE_SUCCESS,
  DELETE_REQUEST,
  DELETE_SUCCESS,
  DELETE_FAIL,
  CREATE_REQUEST,
  CREATE_SUCCESS,
  CREATE_FAIL,
} = statusSlice.actions;

export default statusSlice.reducer;
