import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch Site Config
export const fetchSiteConfig = createAsyncThunk(
  'siteConfig/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v3/config');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch config');
    }
  }
);

// Update Hero Slides (Admin)
export const updateHeroSlides = createAsyncThunk(
  'siteConfig/updateHeroSlides',
  async (heroSlides, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/v3/config/hero', { heroSlides }, {
        withCredentials: true // needed for admin auth cookies
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update hero slides');
    }
  }
);

const siteConfigSlice = createSlice({
  name: 'siteConfig',
  initialState: {
    config: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateSuccess: false,
    updateError: null,
  },
  reducers: {
    resetUpdateState: (state) => {
      state.updateLoading = false;
      state.updateSuccess = false;
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Config
      .addCase(fetchSiteConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSiteConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(fetchSiteConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Hero Slides
      .addCase(updateHeroSlides.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.updateError = null;
      })
      .addCase(updateHeroSlides.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.config = action.payload; // updated config
      })
      .addCase(updateHeroSlides.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  }
});

export const { resetUpdateState } = siteConfigSlice.actions;
export default siteConfigSlice.reducer;
