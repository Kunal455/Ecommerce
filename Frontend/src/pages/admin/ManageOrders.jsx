import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminOrders, updateAdminOrderStatus, deleteAdminOrder, clearAdminOrderMessages } from '../../redux/slices/adminOrderSlice';
import { AdminSidebar } from './AdminDashboard';
import { Search, Trash2, PackageCheck, Truck, Clock, Loader2, FileText, X } from 'lucide-react';

const ManageOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, successMessage } = useSelector((state) => state.adminOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearAdminOrderMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      dispatch(deleteAdminOrder(id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateAdminOrderStatus({ id, status: newStatus }));
  };

  const filteredOrders = orders?.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.shippingAddress?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 w-max"><PackageCheck size={12} /> Delivered</span>;
      case 'Shipped':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 w-max"><Truck size={12} /> Shipped</span>;
      case 'Processing':
      default:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 w-max"><Clock size={12} /> Processing</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#101828]">Order Fulfillment</h1>
          <p className="text-gray-500 mt-2 text-sm">Track shipments, update order statuses, and view purchase history.</p>
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
              placeholder="Search by Order ID or Customer Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-sm focus:border-[#c9a84c] focus:ring-0 outline-none"
            />
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {filteredOrders.length} Orders
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          {loading && orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <Loader2 size={40} className="animate-spin text-[#1a2b4c]" />
              <p className="mt-4 text-gray-500 text-sm">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <FileText size={48} className="text-gray-300 mb-4 stroke-[1px]" />
              <h3 className="text-lg font-bold text-[#101828]">No orders found</h3>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 font-medium text-[#101828]">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="hover:text-[#c9a84c] transition-colors"
                        >
                          #{order._id.slice(-8).toUpperCase()}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="text-[#101828] font-medium">{order.shippingAddress?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{order.orderItems?.length || 0} items</div>
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4 font-bold text-[#101828]">${order.totalPrice.toFixed(2)}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-[11px] font-bold uppercase tracking-wider py-1.5 px-2 rounded border outline-none cursor-pointer transition-colors ${
                            order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                            order.status === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                            'bg-yellow-50 border-yellow-200 text-yellow-700'
                          }`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button 
                          onClick={() => handleDelete(order._id)}
                          title="Delete Order"
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Order Details Slide-over Panel */}
      <div className={`fixed inset-0 bg-[#101828]/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${selectedOrder ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSelectedOrder(null)} />
      
      <div className={`fixed top-0 right-0 h-full w-[450px] bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${selectedOrder ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedOrder && (
          <>
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="font-serif text-xl tracking-wide text-[#101828]">Order Details</h2>
                <p className="text-xs text-gray-500 font-medium mt-1">#{selectedOrder._id.toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-[#101828] transition-colors">
                <X size={24} className="stroke-[1.5px]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Status Header */}
              <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-100 rounded-lg">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Current Status</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Shipping Info */}
              <div>
                <h3 className="text-sm font-bold text-[#101828] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Shipping Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-[#101828]">{selectedOrder.shippingAddress?.name}</p>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-sm font-bold text-[#101828] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#101828]">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Color: {item.color}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-[#c9a84c]">${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-sm font-bold text-[#101828] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Payment Summary</h3>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-[#101828]">${selectedOrder.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-[#101828]">Free</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100 mt-4">
                  <span className="font-bold text-[#101828] uppercase">Total</span>
                  <span className="font-serif text-xl font-bold text-[#c9a84c]">${selectedOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default ManageOrders;
