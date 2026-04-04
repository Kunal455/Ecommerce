import React, { useState } from 'react'
import { Search, User, Heart, ShoppingBag, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password'
  
  const { isAuthenticated, user } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    setIsProfileOpen(false)
    navigate('/')
  }

  const closeProfile = () => setIsProfileOpen(false)

  return (
    <>
      <header className="w-full flex flex-col font-sans relative z-30 shadow-sm">
        {/* Top Banner */}
        <div className="bg-[#1a2b4c] text-[#d4af37] text-[11px] sm:text-xs font-bold text-center py-2.5 tracking-[0.2em] uppercase flex items-center justify-center gap-2">
          <span>✦</span>
          <span>MIN 50% OFF ON THOUSANDS OF STYLES | CODE: RQB50 | FREE DELIVERY ABOVE ₹2,999</span>
        </div>

        {/* Main Navbar */}
        <div className="bg-white border-b border-gray-100 relative">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-[88px] gap-8">
              
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center w-64">
                <Link to="/" className="flex items-center">
                  <img 
                    src="/logo.png" 
                    alt="RAQEEBA The Trend Breaker" 
                    className="h-14 w-auto object-contain"
                  />
                </Link>
              </div>

              {/* Desktop Menu */}
              <nav className="hidden lg:flex space-x-12 items-center">
                <Link to="/men" className="text-gray-800 hover:text-[#d4af37] text-[13px] font-bold tracking-[0.15em] uppercase transition-colors">MEN</Link>
                <Link to="/women" className="text-gray-800 hover:text-[#d4af37] text-[13px] font-bold tracking-[0.15em] uppercase transition-colors">WOMEN</Link>
                <Link to="/kids" className="text-gray-800 hover:text-[#d4af37] text-[13px] font-bold tracking-[0.15em] uppercase transition-colors">KIDS</Link>
              </nav>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-xl">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={20} className="text-gray-400 stroke-[2px]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-[#f5f5f5] text-gray-800 placeholder-gray-500 rounded-sm py-3.5 pl-12 pr-4 text-[14px] font-medium outline-none focus:ring-1 focus:ring-gray-300 transition-all border-none"
                  />
                </div>
              </div>

              {/* Icons */}
              <div className="flex items-center gap-10 w-72 justify-end">
                
                {/* Profile Drawer Button */}
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="text-gray-800 hover:text-[#1a2b4c] flex flex-col items-center group transition-colors bg-transparent border-none cursor-pointer"
                >
                  <User size={24} className="stroke-[2px] group-hover:scale-110 transition-transform"/>
                  <span className="text-[10px] mt-1.5 font-bold tracking-[0.15em] uppercase">Profile</span>
                </button>

                <Link to="/wishlist" className="text-gray-800 hover:text-[#1a2b4c] flex flex-col items-center group transition-colors">
                  <Heart size={24} className="stroke-[2px] group-hover:scale-110 transition-transform"/>
                  <span className="text-[10px] mt-1.5 font-bold tracking-[0.15em] uppercase">Wishlist</span>
                </Link>
                <Link to="/cart" className="text-gray-800 hover:text-[#1a2b4c] flex flex-col items-center group transition-colors relative">
                  <div className="relative">
                    <ShoppingBag size={24} className="stroke-[2px] group-hover:scale-110 transition-transform"/>
                    <span className="absolute -top-1.5 -right-2 bg-[#d4af37] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">1</span>
                  </div>
                  <span className="text-[10px] mt-1.5 font-bold tracking-[0.15em] uppercase">Bag</span>
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Marquee Banner */}
        {!isAuthPage && (
          <div className="bg-[#faf5e8] border-b border-gray-200 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex justify-between items-center text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#1a2b4c] uppercase">
              <span>COLLECTION NOW LIVE</span>
              <span className="text-[#d4af37]">●</span>
              <span>FREE SHIPPING ABOVE ₹2,999</span>
              <span className="text-[#d4af37]">●</span>
              <span>MEMBERS GET 10% OFF</span>
              <span className="text-[#d4af37]">●</span>
              <span>BREAK EVERY TREND</span>
            </div>
          </div>
        )}
      </header>

      {/* Profile Slide-over Drawer */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-[#101828]/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isProfileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeProfile}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[340px] bg-white z-[110] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <h2 className="font-serif text-[22px] tracking-wide text-[#101828]">My Account</h2>
          <button onClick={closeProfile} className="text-gray-400 hover:text-[#101828] transition-colors">
            <X size={24} className="stroke-[1.5px]" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto pt-6">
          {isAuthenticated ? (
            <div className="px-6 mb-8 text-center">
              <div className="w-16 h-16 bg-[#faf5e8] rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-[#c9a84c] text-xl font-serif">{user?.firstName?.charAt(0) || 'U'}</span>
              </div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Welcome back,</p>
              <p className="text-[18px] text-[#101828] font-serif truncate">{user?.firstName || 'User'} {user?.lastName || ''}</p>
            </div>
          ) : (
            <div className="px-6 mb-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-4">
                <User size={28} className="text-gray-400 stroke-[1.5px]" />
              </div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Welcome to Raqeeba</p>
              <Link 
                to="/login" 
                onClick={closeProfile}
                className="block w-full bg-[#101828] text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#1a2e4a] transition-colors shadow-sm"
              >
                Login / Register
              </Link>
            </div>
          )}
          
          <div className="flex flex-col">
            {isAuthenticated && (
              <>
                <Link to="/profile" onClick={closeProfile} className="px-6 py-4 hover:bg-[#faf5e8] text-[12px] font-bold tracking-[0.15em] text-[#101828] uppercase transition-colors border-l-2 border-transparent hover:border-[#c9a84c]">My Profile</Link>
                <Link to="/orders" onClick={closeProfile} className="px-6 py-4 hover:bg-[#faf5e8] text-[12px] font-bold tracking-[0.15em] text-[#101828] uppercase transition-colors border-l-2 border-transparent hover:border-[#c9a84c]">Orders</Link>
              </>
            )}
            <Link to="/wishlist" onClick={closeProfile} className="px-6 py-4 hover:bg-[#faf5e8] text-[12px] font-bold tracking-[0.15em] text-[#101828] uppercase transition-colors border-l-2 border-transparent hover:border-[#c9a84c]">Wishlist</Link>
            <Link to="/cart" onClick={closeProfile} className="px-6 py-4 hover:bg-[#faf5e8] text-[12px] font-bold tracking-[0.15em] text-[#101828] uppercase transition-colors border-l-2 border-transparent hover:border-[#c9a84c]">Cart / Bag</Link>
          </div>
        </div>

        {/* Drawer Footer */}
        {isAuthenticated && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 text-[11px] font-bold tracking-[0.2em] text-[#c9a84c] uppercase hover:bg-gray-100 transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar
