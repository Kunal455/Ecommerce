import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts, deleteAdminProduct, clearAdminProductMessages } from '../../redux/slices/adminProductSlice';
import { AdminSidebar } from './AdminDashboard';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import AddProductModal from '../../components/admin/AddProductModal';

const ManageProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error, successMessage } = useSelector((state) => state.adminProducts);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearAdminProductMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteAdminProduct(id));
    }
  };

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 p-8">
        
        {/* Header & Actions */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#101828]">Inventory Management</h1>
            <p className="text-gray-500 mt-2 text-sm">Manage your entire product catalog, prices, and stock levels.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#101828] text-white px-6 py-3 text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#1a2e4a] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} />
            Add New Product
          </button>
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
              placeholder="Search by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-sm focus:border-[#c9a84c] focus:ring-0 outline-none"
            />
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {filteredProducts.length} Products
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          {loading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1a2b4c]"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <Package size={48} className="text-gray-300 mb-4 stroke-[1px]" />
              <h3 className="text-lg font-bold text-[#101828]">No products found</h3>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search or add a new product.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    <th className="p-4 pl-6 w-16">Image</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="w-12 h-14 bg-gray-100 overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-[#101828]">
                        <div className="truncate max-w-[250px]">{product.name}</div>
                        {product.brand && <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{product.brand}</div>}
                      </td>
                      <td className="p-4 text-gray-600">
                        {product.category || 'N/A'}
                        {product.gender && <span className="block text-xs text-gray-400 mt-0.5">{product.gender}</span>}
                      </td>
                      <td className="p-4 font-bold text-[#101828]">
                        ${product.price}
                        {product.discountPrice > 0 && <span className="block text-xs text-green-600 mt-0.5 font-medium">Sale: ${product.discountPrice}</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-sm text-[11px] font-bold ${
                          product.countInStock > 10 ? 'bg-green-100 text-green-700' : 
                          product.countInStock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.countInStock} IN STOCK
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white border border-gray-200 shadow-sm">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 shadow-sm">
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

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ManageProducts;
