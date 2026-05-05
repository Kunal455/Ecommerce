import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './redux/slices/authSlice'
import { fetchUserCart } from './redux/slices/cartSlice'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageProducts from './pages/admin/ManageProducts'
import ManageUsers from './pages/admin/ManageUsers'
import ManageOrders from './pages/admin/ManageOrders'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Cart from './pages/Cart'

const AppContent = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password'
  const isAdminPage = location.pathname.startsWith('/admin')

  const { isAuthenticated } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserCart())
    }
  }, [isAuthenticated, dispatch])

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/men" element={<Shop defaultGender="Men" />} />
          <Route path="/women" element={<Shop defaultGender="Women" />} />
          <Route path="/kids" element={<Shop defaultGender="Kids" />} />
          <Route path="/sale" element={<Shop defaultCollection="Sale" />} />
          <Route path="/new-arrivals" element={<Shop defaultSortBy="newest" titleOverride="New Arrivals" />} />
          <Route path="/best-sellers" element={<Shop defaultSortBy="rating_desc" titleOverride="Best Sellers" />} />
          
          {/* Protected Routes (Only for logged-in users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
          </Route>
        </Routes>
      </main>
      {!(isAuthPage || isAdminPage) && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
