import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all users for admin
export const getAdminUsers = createAsyncThunk(
  'adminUsers/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/v3/admin/users');
      // The controller returns an array of users directly
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch users');
    }
  }
);

// Update user (e.g. promote to admin)
export const updateAdminUser = createAsyncThunk(
  'adminUsers/update',
  async ({ id, role }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/v3/admin/users/${id}`, { role });
      return response.data.updatedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to update user');
    }
  }
);

// Delete user
export const deleteAdminUser = createAsyncThunk(
  'adminUsers/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/api/v3/admin/users/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to delete user');
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  successMessage: null
};

const adminUserSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearAdminUserMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE USER
      .addCase(updateAdminUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.successMessage = 'User role updated successfully!';
        state.error = null;
      })
      .addCase(updateAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE USER
      .addCase(deleteAdminUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u._id !== action.payload);
        state.successMessage = 'User deleted successfully!';
        state.error = null;
      })
      .addCase(deleteAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAdminUserMessages } = adminUserSlice.actions;

export default adminUserSlice.reducer;
