import React, { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, googleLoginUser } from '../redux/slices/authSlice'
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.auth)

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(googleLoginUser(tokenResponse.credential || tokenResponse.access_token)).then((action) => {
        if(!action.error) {
          toast.success("Account created successfully!");
          navigate('/');
        } else {
          toast.error(action.payload?.message || action.payload || "Google signup failed");
        }
      })
    },
    onError: () => {
      console.log('Google Signup Failed');
      toast.error("Google Signup Failed");
    },
  })

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
      if(!action.error) {
        toast.success("Account created successfully!");
        navigate('/');
      } else {
        toast.error(action.payload?.message || action.payload || "Failed to create account");
      }
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-[#c14a4a] text-[12px] font-bold tracking-wide">
            {error?.message || error?.error || (typeof error === 'string' ? error : "Failed to create account. Please check your details.")}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">First Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 focus:border-[#101828] focus:ring-0 transition-colors text-sm font-sans placeholder-gray-300 outline-none rounded-none"
                placeholder="Kunal"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Last Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 focus:border-[#101828] focus:ring-0 transition-colors text-sm font-sans placeholder-gray-300 outline-none rounded-none"
                placeholder="Verma"
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
              placeholder="kunal@gmail.com"
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
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#f9f6f0] text-gray-400 text-[10px] font-medium tracking-widest uppercase">or</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => googleLogin()}
            className="w-full bg-white text-[#101828] py-3.5 px-4 font-bold tracking-[0.2em] text-[11px] border border-gray-200 shadow-sm hover:bg-gray-50 flex items-center justify-center gap-3 uppercase transition-all rounded-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" fillRule="evenodd" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" clipRule="evenodd"></path>
              <path fill="#34A853" fillRule="evenodd" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" clipRule="evenodd"></path>
              <path fill="#FBBC05" fillRule="evenodd" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" clipRule="evenodd"></path>
              <path fill="#EA4335" fillRule="evenodd" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" clipRule="evenodd"></path>
            </svg>
            CONTINUE WITH GOOGLE
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
