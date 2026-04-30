import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createAdminProduct } from '../../redux/slices/adminProductSlice';
import axios from 'axios';

const AddProductModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: 0,
    countInStock: '',
    category: '',
    brand: '',
    gender: 'Unisex',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      
      // Step 1: Upload Image to Cloudinary via Backend
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        
        const uploadResponse = await axios.post('/api/v3/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        imageUrl = uploadResponse.data.imageUrl;
      }

      // Step 2: Create Product
      const productPayload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice),
        countInStock: Number(formData.countInStock),
        images: imageUrl ? [{ url: imageUrl, altText: formData.name }] : []
      };

      await dispatch(createAdminProduct(productPayload)).unwrap();
      
      // Reset & Close
      setFormData({ name: '', description: '', price: '', discountPrice: 0, countInStock: '', category: '', brand: '', gender: 'Unisex' });
      setImageFile(null);
      setPreview(null);
      onClose();
      
    } catch (error) {
      console.error("Failed to create product:", error);
      alert(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#101828]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-serif font-bold text-[#101828]">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Product Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] focus:ring-0 outline-none text-sm" placeholder="e.g. Classic White Tee" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Price ($) *</label>
                    <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] outline-none text-sm" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Discount ($)</label>
                    <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] outline-none text-sm" placeholder="0.00" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Category *</label>
                    <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] outline-none text-sm" placeholder="Topwear" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Stock *</label>
                    <input type="number" name="countInStock" required value={formData.countInStock} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] outline-none text-sm" placeholder="100" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] outline-none text-sm" placeholder="Raqeeba" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] outline-none text-sm">
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Product Image *</label>
                  <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden group">
                    {preview ? (
                      <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold tracking-widest uppercase">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500 font-medium">Click or drag image to upload</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} required={!preview} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">Description</label>
                  <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c9a84c] outline-none text-sm resize-none" placeholder="Enter product details..."></textarea>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-6 py-3 text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <button type="submit" form="add-product-form" disabled={loading} className="px-8 py-3 bg-[#101828] text-white text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#1a2e4a] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Uploading...' : 'Save Product'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddProductModal;
