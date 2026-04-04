import React, { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/slices/authSlice'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '',
    agreeTerms: false,
    updates: true 
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser(formData)).then((action) => {
      if(!action.error) navigate('/')
    })
  }

  return (
    <AuthLayout>
      <div className="max-w-[400px] mx-auto w-full pt-8 pb-12">
        {/* Tabs */}
        <div className="mb-12 w-full border-b border-gray-200 flex">
          <Link to="/login" className="w-1/2 pb-4 text-center text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-gray-400 hover:text-gray-600 uppercase transition-colors">
            SIGN IN
          </Link>
          <Link to="/register" className="w-1/2 pb-4 text-center text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#101828] border-b-[3px] border-[#c9a84c] uppercase">
            CREATE ACCOUNT
          </Link>
        </div>

        {/* Headings */}
        <div className="mb-8">
          <h1 className="font-serif text-[32px] sm:text-[36px] text-[#101828] font-bold leading-tight mb-1">Create account</h1>
          <p className="text-gray-400 text-sm font-sans">Join RAQEEBA and break every trend</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">First Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 focus:border-[#101828] focus:ring-0 transition-colors text-sm font-sans placeholder-gray-300 outline-none rounded-none"
                placeholder="Priya"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Last Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 focus:border-[#101828] focus:ring-0 transition-colors text-sm font-sans placeholder-gray-300 outline-none rounded-none"
                placeholder="Sharma"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-200 focus:border-[#101828] focus:ring-0 transition-colors text-sm font-sans placeholder-gray-300 outline-none rounded-none"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 focus:border-[#101828] focus:ring-0 transition-colors text-sm font-sans placeholder-gray-300 outline-none rounded-none"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button" 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} className="stroke-[1.5px]" /> : <Eye size={18} className="stroke-[1.5px]" />}
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                className="mt-1 w-[14px] h-[14px] text-[#101828] border-gray-300 rounded-sm focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[12px] text-gray-500">
                I agree to RAQEEBA's <a href="#" className="text-[#c9a84c] font-bold hover:text-[#b0923f] transition-colors">Terms & Conditions</a> and <a href="#" className="text-[#c9a84c] font-bold hover:text-[#b0923f] transition-colors">Privacy Policy</a>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.updates}
                onChange={(e) => setFormData({...formData, updates: e.target.checked})}
                className="mt-1 w-[14px] h-[14px] text-[#c9a84c] border-gray-300 rounded-sm focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[12px] text-gray-500">
                Send me exclusive deals and new arrival alerts
              </span>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#101828] text-white py-4 px-4 font-bold tracking-[0.2em] text-[11px] hover:bg-[#1a2e4a] transition-all mt-6 uppercase shadow-sm rounded-none"
          >
            CREATE ACCOUNT
          </button>
          
          <div className="text-center mt-6">
            <span className="text-[12px] text-gray-400">Already have an account? </span>
            <Link to="/login" className="text-[12px] font-bold text-[#c9a84c] hover:text-[#b0923f] transition-colors">Sign in</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Signup
