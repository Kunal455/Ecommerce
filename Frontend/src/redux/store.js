import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import adminProductReducer from './slices/adminProductSlice'
import adminOrderReducer from './slices/adminOrderSlice'
import adminUserReducer from './slices/adminUserSlice'
import wishlistReducer from './slices/wishlistSlice'
import siteConfigReducer from './slices/siteConfigSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrderReducer,
    adminUsers: adminUserReducer,
    wishlist: wishlistReducer,
    siteConfig: siteConfigReducer
  }
})
