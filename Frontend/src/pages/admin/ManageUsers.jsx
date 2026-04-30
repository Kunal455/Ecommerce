import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminUsers, deleteAdminUser, updateAdminUser, clearAdminUserMessages } from '../../redux/slices/adminUserSlice';
import { AdminSidebar } from './AdminDashboard';
import { Search, Trash2, Shield, User, Loader2, MoreVertical } from 'lucide-react';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error, successMessage } = useSelector((state) => state.adminUsers);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAdminUsers());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearAdminUserMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      dispatch(deleteAdminUser(id));
    }
  };

  const handleRoleChange = (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) {
      dispatch(updateAdminUser({ id, role: newRole }));
    }
  };

  const filteredUsers = users?.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#101828]">User Management</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage customer accounts, permissions, and platform access.</p>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-t-2xl border border-gray-100 border-b-0 flex justify-between items-center shadow-sm">
          <div className="relative w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-sm focus:border-[#c9a84c] focus:ring-0 outline-none"
            />
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {filteredUsers.length} Users
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          {loading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <Loader2 size={40} className="animate-spin text-[#1a2b4c]" />
              <p className="mt-4 text-gray-500 text-sm">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <User size={48} className="text-gray-300 mb-4 stroke-[1px]" />
              <h3 className="text-lg font-bold text-[#101828]">No users found</h3>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    <th className="p-4 pl-6">Customer Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#f9fafb] border border-gray-100 flex items-center justify-center text-[#c9a84c] font-serif font-bold text-lg">
                            {user.firstName ? user.firstName.charAt(0) : 'U'}
                          </div>
                          <span className="font-medium text-[#101828]">{user.firstName} {user.lastName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-[#101828] text-[#c9a84c]' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleRoleChange(user._id, user.role)}
                            title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white border border-gray-200 shadow-sm"
                          >
                            <Shield size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id)}
                            title="Delete User"
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageUsers;
