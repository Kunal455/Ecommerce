import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all inventory for admin
export const getAdminProducts = createAsyncThunk(
  'adminProducts/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/v3/admin/products');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

// Create a new product
export const createAdminProduct = createAsyncThunk(
  'adminProducts/create',
  async (productData, thunkAPI) => {
    try {
      const response = await axios.post('/api/v3/product', productData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to create product');
    }
  }
);

// Delete a product
export const deleteAdminProduct = createAsyncThunk(
  'adminProducts/delete',
  async (productId, thunkAPI) => {
    try {
      const response = await axios.delete(`/api/v3/product/${productId}`);
      return { id: productId, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to delete product');
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  successMessage: null
};

const adminProductSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {
    clearAdminProductMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET All
      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || action.payload;
        state.error = null;
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // CREATE
      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.product || action.payload);
        state.successMessage = 'Product created successfully!';
        state.error = null;
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE
      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload.id);
        state.successMessage = 'Product deleted successfully!';
        state.error = null;
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAdminProductMessages } = adminProductSlice.actions;
export default adminProductSlice.reducer;
