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
      const response = await axios.post('/api/v3/cart', cartItem)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const removeFromCartBackend = createAsyncThunk(
  'cart/removeFromCartBackend',
  async (cartItem, thunkAPI) => {
    try {
      const response = await axios.delete('/api/v3/cart', { data: cartItem })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/v3/cart')
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch cart')
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
    removeFromGuestCart: (state, action) => {
      state.items = state.items.filter(
        i => !(
          (i.product === action.payload.productId || i.productId === action.payload.productId) && 
          i.size === action.payload.size && 
          i.color === action.payload.color
        )
      )
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
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        if (action.payload.cart && action.payload.cart.products) {
          state.items = action.payload.cart.products
        }
      })
      .addCase(addToCartBackend.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        if (action.payload.cart && action.payload.cart.products) {
          state.items = action.payload.cart.products
        }
      })
      .addCase(fetchUserCart.rejected, (state) => {
        // If fetch fails (e.g., no cart exists), default to empty or keep local
        state.items = []
      })
      .addCase(removeFromCartBackend.pending, (state) => {
        state.loading = true
      })
      .addCase(removeFromCartBackend.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        if (action.payload.cart && action.payload.cart.products) {
          state.items = action.payload.cart.products
        }
      })
      .addCase(removeFromCartBackend.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { addToGuestCart, removeFromGuestCart, clearGuestCart } = cartSlice.actions
export default cartSlice.reducer
