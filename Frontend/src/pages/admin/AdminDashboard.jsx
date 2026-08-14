import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Package, ShoppingBag, LayoutDashboard, Settings, LogOut, DollarSign, ArrowUpRight, Image } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { getAdminOrders } from '../../redux/slices/adminOrderSlice';
import { getAdminUsers } from '../../redux/slices/adminUserSlice';

// --- Shared Admin Sidebar Component ---
export const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Hero Carousel', path: '/admin/hero', icon: <Image size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#101828] min-h-screen text-white flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-800 px-6">
        <Link to="/" className="text-xl font-serif tracking-widest text-[#d4af37]">RAQEEBA ADMIN</Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors font-medium text-sm tracking-wide ${
              location.pathname === item.path
                ? 'bg-[#c9a84c] text-[#101828]'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-[#e27c62] hover:bg-[#e27c62]/10 rounded-lg w-full transition-colors text-sm font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  const { orders, loading: ordersLoading } = useSelector(state => state.adminOrders);
  const { users, loading: usersLoading } = useSelector(state => state.adminUsers);

  useEffect(() => {
    dispatch(getAdminOrders());
    dispatch(getAdminUsers());
  }, [dispatch]);

  // Compute dynamic stats
  const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const activeOrdersCount = orders.filter(order => order.status !== 'Delivered').length;
  const totalUsersCount = users.length;

  // Get 5 most recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Processing': default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      {/* Sidebar fixed on the left */}
      <AdminSidebar />

      {/* Main Content pushed to the right */}
      <div className="flex-1 ml-64 p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#101828]">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2 text-sm">Welcome back, Admin. Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Sales</p>
              <h3 className="text-3xl font-bold text-[#101828]">
                {ordersLoading ? '...' : `₹${totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-2 flex items-center">
                Across all time
              </p>
            </div>
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-[#101828]">
                {usersLoading ? '...' : totalUsersCount}
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-2 flex items-center">
                Registered accounts
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Active Orders</p>
              <h3 className="text-3xl font-bold text-[#101828]">
                {ordersLoading ? '...' : activeOrdersCount}
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-2 flex items-center">
                Needs fulfillment
              </p>
            </div>
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
              <ShoppingBag size={24} className="text-orange-600" />
            </div>
          </div>

        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#101828]">Recent Transactions</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-[#c9a84c] hover:text-[#b0923f]">View All Orders</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {ordersLoading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">Loading recent transactions...</td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">No recent transactions found.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 font-medium text-[#101828]">...{order._id.slice(-6).toUpperCase()}</td>
                      <td className="p-4 text-gray-600">{order.shippingAddress?.name || 'N/A'}</td>
                      <td className="p-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4 font-medium text-[#101828]">₹{order.totalPrice?.toFixed(2) || '0.00'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
