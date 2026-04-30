import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToGuestCart, addToCartBackend } from '../redux/slices/cartSlice';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Minus, Plus, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

const COLOR_MAP = {
  'Black': { hex: '#000000' },
  'White': { hex: '#ffffff', border: true },
  'Navy': { hex: '#1c2941' },
  'Grey': { hex: '#808080' },
  'Beige': { hex: '#d4c4a8' },
  'Green': { hex: '#006400' },
  'Yellow': { hex: '#ffd700' },
  'Red': { hex: '#b22222' },
  'Pink': { hex: '#ffc0cb' },
  'Blue': { hex: '#4169e1' }
};

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selections
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0); // Reset scroll on load
        
        // Fetch Product Details
        const res = await axios.get(`http://localhost:8000/api/v3/product/${id}`);
        const fetchedProduct = res.data; // Backend returns the product object directly
        setProduct(fetchedProduct);
        
        // Set Defaults based on product data
        if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
          setSelectedSize(fetchedProduct.sizes[0]);
        }
        if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
          setSelectedColor(fetchedProduct.colors[0]);
        }
        
        // Fetch Similar Products
        try {
          const similarRes = await axios.get(`http://localhost:8000/api/v3/product/similar/${id}`);
          setSimilarProducts(similarRes.data.similarProducts || []); // Backend returns similarProducts
        } catch (simErr) {
          console.error("Error fetching similar products", simErr);
        }

      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Ensure size and color are selected if they are required options
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }
    
    setAddingToCart(true);
    
    const cartPayload = {
      product: product._id,
      name: product.name,
      price: product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price,
      image: product.images?.[0]?.url || '',
      quantity,
      size: selectedSize,
      color: selectedColor
    };

    try {
      if (isAuthenticated) {
        await dispatch(addToCartBackend(cartPayload)).unwrap();
      } else {
        dispatch(addToGuestCart(cartPayload));
      }
      
      // Show success feedback (could be a toast in the future)
      const btn = document.getElementById('add-to-cart-btn');
      if (btn) {
        const originalText = btn.innerText;
        btn.innerText = 'ADDED TO CART ✓';
        btn.classList.add('bg-[#1e4620]');
        setTimeout(() => {
          btn.innerText = originalText;
          btn.classList.remove('bg-[#1e4620]');
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center">
        <h2 className="font-serif text-2xl text-[#101828] mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-[#c9a84c] hover:underline font-bold text-sm tracking-widest uppercase">Return to Shop</Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-20">
      
      {/* Breadcrumb */}
      <div className="border-b border-[#e5e7eb]/50 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">
            <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-[#c9a84c] transition-colors">Shop</Link>
            {product.category && (
              <>
                <ChevronRight size={12} />
                <Link to={`/shop?category=${product.category}`} className="hover:text-[#c9a84c] transition-colors">{product.category}</Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-[#101828] truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-white border border-[#e5e7eb] aspect-[3/4] sm:aspect-[4/5] flex items-center justify-center p-8 relative group overflow-hidden">
              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-white z-10 bg-[#c9a84c]">
                  {product.badge}
                </div>
              )}
              <img 
                src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600x800'} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`bg-white border aspect-square flex items-center justify-center p-2 transition-all ${
                      selectedImage === idx ? 'border-[#101828] ring-1 ring-[#101828]' : 'border-[#e5e7eb] hover:border-[#c9a84c]'
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:w-1/2 flex flex-col">
            <span className="text-[#c9a84c] text-[11px] font-bold tracking-[0.2em] mb-3 uppercase">
              {product.brand || 'RAQEEBA'}
            </span>
            <h1 className="font-serif text-[#101828] text-3xl sm:text-4xl leading-tight mb-4">
              {product.name}
            </h1>
            
            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-bold text-[#101828] text-2xl">₹{currentPrice?.toLocaleString()}</span>
              {hasDiscount && (
                <>
                  <span className="text-gray-400 text-lg line-through">₹{product.price?.toLocaleString()}</span>
                  <span className="bg-[#c14a4a] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Sale</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-8 border-b border-gray-200 pb-8">
              {product.description || "Experience unparalleled luxury and craftsmanship. Each piece is meticulously designed to elevate your everyday style."}
            </p>

            {/* Selectors */}
            <div className="space-y-6 mb-8">
              
              {/* Colors */}
              {product.colors?.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold tracking-[0.15em] text-[#101828] uppercase">Color</span>
                    <span className="text-[11px] text-gray-500">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => {
                      const colorData = COLOR_MAP[color] || { hex: color.toLowerCase() };
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${colorData.border ? 'border border-gray-300' : ''} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-[#101828] scale-110' : 'hover:scale-110'}`}
                          style={{ backgroundColor: colorData.hex }}
                          title={color}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold tracking-[0.15em] text-[#101828] uppercase">Size</span>
                    <button className="text-[10px] font-bold tracking-widest text-[#c9a84c] uppercase hover:underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[50px] h-12 px-4 text-sm font-bold border flex items-center justify-center transition-all ${
                          selectedSize === size 
                            ? 'border-[#101828] bg-[#101828] text-white shadow-md scale-105' 
                            : 'border-gray-300 bg-white text-[#101828] hover:border-[#101828]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <span className="block text-[11px] font-bold tracking-[0.15em] text-[#101828] uppercase mb-3">Quantity</span>
                <div className="flex items-center border border-gray-300 w-[120px] bg-white h-12">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#101828] hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="flex-1 text-center font-bold text-[#101828] text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.countInStock || 10, quantity + 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#101828] hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

            </div>

            {/* Add to Cart Action */}
            <div className="flex flex-col gap-4 mb-10">
              <button 
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={addingToCart || product.countInStock === 0}
                className="w-full bg-[#101828] text-white h-14 flex items-center justify-center gap-3 font-bold text-[12px] tracking-[0.2em] uppercase hover:bg-[#1a2e4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {addingToCart ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </button>
            </div>

            {/* Product Meta & Shipping */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-start gap-4">
                <Truck className="text-[#c9a84c] mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-sm text-[#101828]">Free Global Shipping</h4>
                  <p className="text-xs text-gray-500 mt-1">Delivery in 3-5 business days.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <RotateCcw className="text-[#c9a84c] mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-sm text-[#101828]">Free Returns</h4>
                  <p className="text-xs text-gray-500 mt-1">Return within 30 days for a full refund.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="text-[#c9a84c] mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-sm text-[#101828]">Secure Checkout</h4>
                  <p className="text-xs text-gray-500 mt-1">SSL Encrypted payment gateways.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Similar Products Carousel */}
        {similarProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-200 pt-16">
            <h2 className="font-serif text-3xl text-[#101828] text-center mb-10">You May Also Like</h2>
            
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide">
              <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
              {similarProducts.map(similar => (
                <div key={similar._id} className="min-w-[260px] sm:min-w-[300px] snap-start flex-shrink-0">
                  <ProductCard product={similar} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
