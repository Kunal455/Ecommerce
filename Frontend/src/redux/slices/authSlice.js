import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { clearGuestCart } from './cartSlice'

axios.defaults.withCredentials = true

export const mergeCartAfterAuth = createAsyncThunk(
  'cart/merge',
  async (localItems, thunkAPI) => {
    try {
      if (localItems.length === 0) return null;
      // Send local items to backend to merge
      const response = await axios.post('http://localhost:8000/api/v3/cart/merge', { items: localItems })
      // Clear local cart since it's merged
      thunkAPI.dispatch(clearGuestCart())
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v3/user/register', userData)
      // Retrieve local cart and merge
      const localCart = JSON.parse(localStorage.getItem('guestCart')) || []
      if(localCart.length > 0) {
        thunkAPI.dispatch(mergeCartAfterAuth(localCart))
      }
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v3/user/login', userData)
      // Retrieve local cart and merge
      const localCart = JSON.parse(localStorage.getItem('guestCart')) || []
      if(localCart.length > 0) {
        thunkAPI.dispatch(mergeCartAfterAuth(localCart))
      }
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user || action.payload
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => { state.loading = true })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user || action.payload
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
