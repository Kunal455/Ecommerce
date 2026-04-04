import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('guestCart')) || [],
  total: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToGuestCart: (state, action) => {
      // Mock logic for adding to local cart
      const existingProduct = state.items.find(i => i.product === action.payload.product)
      if (existingProduct) {
        existingProduct.quantity += 1
      } else {
        state.items.push({...action.payload, quantity: 1})
      }
      localStorage.setItem('guestCart', JSON.stringify(state.items))
    },
    clearGuestCart: (state) => {
      state.items = []
      localStorage.removeItem('guestCart')
    }
  }
})

export const { addToGuestCart, clearGuestCart } = cartSlice.actions
export default cartSlice.reducer
