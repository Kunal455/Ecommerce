import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/v3/order/my-orders');
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <Clock size={16} className="text-yellow-500" />;
      case 'Shipped': return <Truck size={16} className="text-blue-500" />;
      case 'Delivered': return <CheckCircle size={16} className="text-green-500" />;
      case 'Cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Package size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen py-12">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#101828]">My Orders</h1>
            <p className="text-gray-500 mt-2 text-sm tracking-widest uppercase">View your order history and status</p>
          </div>
          <Link to="/shop" className="text-[11px] font-bold tracking-[0.2em] text-[#c9a84c] uppercase hover:underline">
            Continue Shopping
          </Link>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-md">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4 stroke-[1px]" />
            <h3 className="text-xl font-serif text-[#101828] mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't made your first purchase.</p>
            <Link 
              to="/shop"
              className="inline-block px-8 py-4 bg-[#101828] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#1a2e4a] transition-all"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
                
                {/* Order Header */}
                <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-1">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                    <p className="text-sm text-gray-800 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-1">Total</p>
                      <p className="text-lg font-serif font-bold text-[#101828]">₹{order.totalPrice?.toLocaleString()}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="text-[10px] font-bold tracking-[0.15em] uppercase">{order.status}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <div className="w-16 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                          {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-[#101828] mb-1">{item.name}</h4>
                          <div className="text-xs text-gray-500 flex items-center gap-3">
                            <span>Color: {item.color || 'N/A'}</span>
                            <span>Size: {item.size || 'N/A'}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#101828] text-sm">₹{item.price?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Paid via {order.paymentMethod || 'Razorpay'}</span>
                  <Link to={`/product/${order.orderItems[0]?.product}`} className="text-[11px] font-bold tracking-[0.15em] text-[#101828] uppercase hover:text-[#c9a84c] transition-colors">
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
