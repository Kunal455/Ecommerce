import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'

const AppContent = () => {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password'

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/men" element={<Shop defaultGender="Men" />} />
          <Route path="/women" element={<Shop defaultGender="Women" />} />
          <Route path="/kids" element={<Shop defaultGender="Kids" />} />
          <Route path="/sale" element={<Shop defaultCollection="Sale" />} />
          <Route path="/new-arrivals" element={<Shop defaultSortBy="newest" titleOverride="New Arrivals" />} />
          <Route path="/best-sellers" element={<Shop defaultSortBy="rating_desc" titleOverride="Best Sellers" />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
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
