import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all orders for admin
export const getAdminOrders = createAsyncThunk(
  'adminOrders/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/v3/admin/orders');
      // The controller returns { success: true, count: X, orders: [...] }
      return response.data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// Update order status (Processing -> Shipped -> Delivered)
export const updateAdminOrderStatus = createAsyncThunk(
  'adminOrders/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/v3/admin/orders/${id}`, { status });
      return response.data.updatedOrder;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to update order status');
    }
  }
);

// Delete order
export const deleteAdminOrder = createAsyncThunk(
  'adminOrders/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/api/v3/admin/orders/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to delete order');
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
  successMessage: null
};

const adminOrderSlice = createSlice({
  name: 'adminOrders',
  initialState,
  reducers: {
    clearAdminOrderMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE ORDER STATUS
      .addCase(updateAdminOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.successMessage = `Order status updated to ${action.payload.status}!`;
        state.error = null;
      })
      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE ORDER
      .addCase(deleteAdminOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdminOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(o => o._id !== action.payload);
        state.successMessage = 'Order deleted successfully!';
        state.error = null;
      })
      .addCase(deleteAdminOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAdminOrderMessages } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
