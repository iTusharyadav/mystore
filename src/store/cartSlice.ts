import { createSlice } from '@reduxjs/toolkit';
import type { CartState } from '../types';

const initialState: CartState = {
  count: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state) => {
      state.count += 1;
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;