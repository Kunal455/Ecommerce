import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteConfig, updateHeroSlides } from '../../redux/slices/siteConfigSlice';
import { AdminSidebar } from './AdminDashboard';
import { Plus, Trash2, Upload, Loader2, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageHero = () => {
  const dispatch = useDispatch();
  const { config, loading, updateLoading } = useSelector((state) => state.siteConfig);
  const [slides, setSlides] = useState([]);
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchSiteConfig());
  }, [dispatch]);

  useEffect(() => {
    if (config?.heroSlides) {
      setSlides(config.heroSlides);
    }
  }, [config]);

  const handleAddSlide = () => {
    setSlides([
      ...slides,
      {
        subtitle: 'NEW EVENT',
        title: ['First Line', 'Second Line'],
        description: 'Description here',
        image: '',
        buttons: [{ text: 'SHOP NOW', link: '/shop', primary: true }]
      }
    ]);
  };

  const handleRemoveSlide = (index) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    setSlides(newSlides);
  };

  const handleChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  const handleTitleChange = (slideIndex, lineIndex, value) => {
    const newSlides = [...slides];
    const newTitle = [...(newSlides[slideIndex].title || [])];
    newTitle[lineIndex] = value;
    newSlides[slideIndex] = { ...newSlides[slideIndex], title: newTitle };
    setSlides(newSlides);
  };

  const handleButtonChange = (slideIndex, buttonIndex, field, value) => {
    const newSlides = [...slides];
    const newButtons = [...(newSlides[slideIndex].buttons || [])];
    newButtons[buttonIndex] = { ...newButtons[buttonIndex], [field]: value };
    newSlides[slideIndex] = { ...newSlides[slideIndex], buttons: newButtons };
    setSlides(newSlides);
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImageIndex(index);
    try {
      const { data } = await axios.post('/api/v3/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      handleChange(index, 'image', data.imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const handleSave = () => {
    // Validate
    const invalidSlide = slides.find(s => !s.image);
    if (invalidSlide) {
      return toast.error("All slides must have an image");
    }
    dispatch(updateHeroSlides(slides))
      .unwrap()
      .then(() => toast.success('Hero slides updated successfully!'))
      .catch((err) => toast.error(err || 'Update failed'));
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#101828]">Manage Hero Carousel</h1>
            <p className="text-gray-500 mt-2 text-sm">Update home page banners for sales and events.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={updateLoading || loading}
            className="bg-[#101828] text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
          >
            {updateLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-8">
            {slides.map((slide, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                <button 
                  onClick={() => handleRemoveSlide(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full"
                  title="Remove Slide"
                >
                  <Trash2 size={18} />
                </button>
                
                <h3 className="text-lg font-bold mb-4">Slide {index + 1}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input 
                        type="text" 
                        value={slide.subtitle || ''} 
                        onChange={(e) => handleChange(index, 'subtitle', e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 1</label>
                        <input 
                          type="text" 
                          value={slide.title?.[0] || ''} 
                          onChange={(e) => handleTitleChange(index, 0, e.target.value)}
                          className="w-full border border-gray-300 p-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 2 (Italic)</label>
                        <input 
                          type="text" 
                          value={slide.title?.[1] || ''} 
                          onChange={(e) => handleTitleChange(index, 1, e.target.value)}
                          className="w-full border border-gray-300 p-2 rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        value={slide.description || ''} 
                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                      <input 
                        type="text" 
                        value={slide.buttons?.[0]?.text || ''} 
                        onChange={(e) => handleButtonChange(index, 0, 'text', e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Button Link</label>
                      <input 
                        type="text" 
                        list={`link-options-${index}`}
                        value={slide.buttons?.[0]?.link || ''} 
                        onChange={(e) => handleButtonChange(index, 0, 'link', e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        placeholder="/shop"
                      />
                      <datalist id={`link-options-${index}`}>
                        <option value="/shop">All Products</option>
                        <option value="/men">Men's Collection</option>
                        <option value="/women">Women's Collection</option>
                        <option value="/kids">Kids Collection</option>
                        <option value="/sale">Sale Items</option>
                        <option value="/new-arrivals">New Arrivals</option>
                        <option value="/best-sellers">Best Sellers</option>
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
                    {slide.image ? (
                      <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden mb-2">
                        <img src={slide.image} alt="Slide preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center border-2 border-dashed border-gray-300 mb-2">
                        <span className="text-gray-400">No image uploaded</span>
                      </div>
                    )}
                    
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, index)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingImageIndex === index}
                      />
                      <button 
                        type="button"
                        className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded flex justify-center items-center gap-2 hover:bg-gray-50"
                        disabled={uploadingImageIndex === index}
                      >
                        {uploadingImageIndex === index ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {uploadingImageIndex === index ? 'Uploading...' : 'Upload Image'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}

            <button 
              onClick={handleAddSlide}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-white transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} />
              Add New Slide
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageHero;
