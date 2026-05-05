import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../redux/slices/authSlice';
import axios from 'axios';
import { User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('/api/v3/user/profile', formData);
      setSuccess('Profile updated successfully!');
      // Reload user data in redux state
      dispatch(loadUser());
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen py-12">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-[#101828]">My Profile</h1>
          <p className="text-gray-500 mt-2 text-sm tracking-widest uppercase">Update your personal information</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 p-8 rounded-lg">
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-sm font-bold tracking-widest uppercase">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-sm font-bold tracking-widest uppercase">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] focus:ring-0 outline-none text-sm transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] focus:ring-0 outline-none text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] focus:ring-0 outline-none text-sm transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-bold text-[#101828] text-sm tracking-widest uppercase mb-4">Change Password</h3>
              <p className="text-xs text-gray-500 mb-4">Leave blank to keep your current password.</p>
              
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] focus:ring-0 outline-none text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-[#101828] text-white text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-[#1a2e4a] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
