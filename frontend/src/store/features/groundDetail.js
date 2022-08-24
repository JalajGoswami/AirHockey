import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    width: 300,
    height: 525,
}

const groundDetail = createSlice({
  name: 'ground',
  initialState,
  reducers: {
    setDim: (state,{payload}) => {
        state.width = payload.width;
        state.height = payload.height
    }
  }
});

export const { setDim } = groundDetail.actions

export default groundDetail.reducer