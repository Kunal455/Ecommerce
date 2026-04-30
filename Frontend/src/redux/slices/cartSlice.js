import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  items: JSON.parse(localStorage.getItem('guestCart')) || [],
  total: 0
}

export const addToCartBackend = createAsyncThunk(
  'cart/addToCartBackend',
  async (cartItem, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v3/cart', cartItem)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    loading: false,
    error: null
  },
  reducers: {
    addToGuestCart: (state, action) => {
      const existingProduct = state.items.find(
        i => i.product === action.payload.product && 
             i.size === action.payload.size && 
             i.color === action.payload.color
      )
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      localStorage.setItem('guestCart', JSON.stringify(state.items))
    },
    clearGuestCart: (state) => {
      state.items = []
      localStorage.removeItem('guestCart')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartBackend.pending, (state) => {
        state.loading = true
      })
      .addCase(addToCartBackend.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(addToCartBackend.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { addToGuestCart, clearGuestCart } = cartSlice.actions
export default cartSlice.reducer
