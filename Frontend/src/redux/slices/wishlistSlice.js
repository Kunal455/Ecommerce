import { createSlice } from '@reduxjs/toolkit';

// Helper to load wishlist from localStorage
const loadWishlistFromStorage = () => {
  try {
    const serialized = localStorage.getItem('wishlist');
    if (serialized === null) {
      return [];
    }
    return JSON.parse(serialized);
  } catch (e) {
    console.warn('Could not load wishlist from localStorage', e);
    return [];
  }
};

const initialState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(item => item._id === product._id);
      
      if (existingIndex >= 0) {
        // Remove from wishlist
        state.items.splice(existingIndex, 1);
      } else {
        // Add to wishlist
        state.items.push(product);
      }
      
      // Sync to localStorage
      try {
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      } catch (e) {
        console.warn('Could not save wishlist to localStorage', e);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    }
  }
});

export const { toggleWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
