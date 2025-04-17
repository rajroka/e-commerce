import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  quantity: number;
  [key: string]: any;
}

const initialState = {
  items: [] as CartItem[],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items[index].quantity += 1;
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        state.items.push(newItem);
      }
    },
    deleteFromCart: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items[index].quantity -= 1;
        if (state.items[index].quantity <= 0) {
          state.items.splice(index, 1);
        }
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    }
  },
});

export const { addToCart, deleteFromCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
