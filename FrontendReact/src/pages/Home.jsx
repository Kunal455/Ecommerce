import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Truck, RefreshCcw, ShieldCheck, Award } from 'lucide-react'
import axios from 'axios'

// --- Mock Data (Kept for fallback/extra collections) ---
const womenProducts = [
  {
    _id: "w1",
    images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60' }],
    brand: 'RAQEEBA',
    name: 'Silk Wrap Dress',
    price: 5999,
    discountPrice: 3999,
    rating: 4.5,
    numReviews: 234,
    badge: 'SALE'
  },
  {
    _id: "w2",
    images: [{ url: 'https://images.unsplash.com/photo-1603400521630-9f2de124b4f5?w=500&auto=format&fit=crop&q=60' }],
    brand: 'RAQEEBA',
    name: 'Floral Print Blouse',
    price: 1899,
    discountPrice: 1899,
    rating: 4.3,
    numReviews: 123,
    badge: 'NEW'
  },
  {
    _id: "w3",
    images: [{ url: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=500&auto=format&fit=crop&q=60' }],
    brand: 'STUDIO RQB',
    name: 'Pleated Midi Skirt',
    price: 3999,
    discountPrice: 2799,
    rating: 4.2,
    numReviews: 145,
    badge: 'SALE'
  },
  {
    _id: "w4",
    images: [{ url: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&auto=format&fit=crop&q=60' }],
    brand: 'STUDIO RQB',
    name: 'Anarkali Dress',
    price: 6499,
    discountPrice: 6499,
    rating: 4.8,
    numReviews: 289,
    badge: 'BESTSELLER'
  }
];

const kidsProducts = [
  { _id: "k1", images: [{ url: 'https://images.unsplash.com/photo-1519238263530-99bea67b0eb2?w=500&auto=format&fit=crop&q=60'}], brand: 'RAQEEBA KIDS', name: 'Polo & Shorts Set', price: 1299, discountPrice: 1299, rating: 4.6, numReviews: 345, badge: 'BESTSELLER' },
  { _id: "k2", images: [{ url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&auto=format&fit=crop&q=60'}], brand: 'RAQEEBA KIDS', name: 'Denim Jacket', price: 1899, discountPrice: 1899, rating: 4.4, numReviews: 123, badge: 'NEW' },
  { _id: "k3", images: [{ url: 'https://images.unsplash.com/photo-1560232474-0610f63ae8f7?w=500&auto=format&fit=crop&q=60'}], brand: 'STUDIO RQB KIDS', name: 'Cargo Pants', price: 1499, discountPrice: 999, rating: 4.3, numReviews: 234, badge: 'SALE' },
  { _id: "k4", images: [{ url: 'https://images.unsplash.com/photo-1529369623266-f5264b696110?w=500&auto=format&fit=crop&q=60'}], brand: 'RAQEEBA KIDS', name: 'Graphic T-Shirt', price: 699, discountPrice: 699, rating: 4.5, numReviews: 567 }
];

const menProducts = [
  { _id: "m1", images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&auto=format&fit=crop&q=60'}], brand: 'RAQEEBA', name: 'Cotton Oxford Shirt', price: 2299, discountPrice: 2299, rating: 4.6, numReviews: 456 },
  { _id: "m2", images: [{ url: 'https://images.unsplash.com/photo-1594938298595-c2cf93198fbc?w=500&auto=format&fit=crop&q=60'}], brand: 'STUDIO RQB', name: 'Tailored Wool Blazer', price: 7999, discountPrice: 7999, rating: 4.8, numReviews: 1200, badge: 'BESTSELLER' },
  { _id: "m3", images: [{ url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60'}], brand: 'RAQEEBA', name: 'Slim Fit Chinos', price: 2999, discountPrice: 2999, rating: 4.5, numReviews: 890 },
  { _id: "m4", images: [{ url: 'https://images.unsplash.com/photo-1597500588147-97d8250280eb?w=500&auto=format&fit=crop&q=60'}], brand: 'RAQEEBA', name: 'Embroidered Kurta Set', price: 4599, discountPrice: 4599, rating: 4.9, numReviews: 567, badge: 'BESTSELLER' }
];

const categories = [
  { name: 'Women', image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=200&auto=format&fit=crop&q=60', link: '/women' },
  { name: 'Men', image: 'https://images.unsplash.com/photo-1594938298595-c2cf93198fbc?w=200&auto=format&fit=crop&q=60', link: '/men' },
  { name: 'Kids', image: 'https://images.unsplash.com/photo-1519238263530-99bea67b0eb2?w=200&auto=format&fit=crop&q=60', link: '/kids' },
  { name: 'Sale', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&auto=format&fit=crop&q=60', link: '/sale' }
]

// --- Components ---

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300x400';
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  
  return (
    <Link to={`/product/${product._id}`} className="bg-white group cursor-pointer border border-[#e5dfce]/50 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
        {product.badge && (
          <div className={`absolute top-0 left-0 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-white z-10 ${
            product.badge === 'SALE' ? 'bg-[#c14a4a]' : 
            product.badge === 'NEW' ? 'bg-[#1a2b4c]' : 
            'bg-[#c9a84c]'
          }`}>
            {product.badge}
          </div>
        )}
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[#c9a84c] text-[10px] font-bold tracking-[0.2em] mb-2 uppercase">{product.brand || 'RAQEEBA'}</span>
        <h3 className="font-serif text-[#101828] text-lg mb-2 leading-tight">{product.name}</h3>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-[#101828] text-[17px]">₹{currentPrice?.toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-gray-400 text-[13px] line-through">₹{product.price?.toLocaleString()}</span>
            )}
            {hasDiscount && (
              <span className="text-[#c14a4a] text-[12px] font-bold">{discountPercent}% OFF</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-[#1e4620] text-white px-2 py-0.5 rounded-sm flex items-center gap-1 text-[11px] font-bold">
              <Star size={10} className="fill-current" />
              <span>{product.rating || 0}</span>
            </div>
            <span className="text-gray-500 text-[12px]">({product.numReviews || 0})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const CollectionSection = ({ title, products, bgColor = "bg-[#faf5e8]" }) => {
  if (!products || products.length === 0) return null;
  return (
    <section className={`py-20 ${bgColor}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-serif text-3xl md:text-[40px] text-[#101828]">{title}</h2>
          <Link to="#" className="text-[#c9a84c] text-[12px] font-bold tracking-[0.2em] uppercase hover:text-[#a88a3b] transition-colors flex items-center gap-2">
            VIEW ALL <span className="text-[16px] leading-none mb-0.5">›</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

const FeatureBar = () => {
  return (
    <div className="bg-[#1a2b4c] border-y border-[#c9a84c]/20 py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y md:divide-y-0 lg:divide-x divide-gray-700/50">
          
          <div className="flex items-center gap-4 lg:justify-center pt-4 md:pt-0">
            <Truck size={32} className="text-[#e27c62] stroke-[1.5px] flex-shrink-0" />
            <div>
              <h4 className="text-[#d4af37] text-[13px] font-bold tracking-[0.1em] uppercase mb-1">FREE SHIPPING</h4>
              <p className="text-gray-400 text-[12px]">Orders above ₹999</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:justify-center pt-4 md:pt-0">
            <RefreshCcw size={32} className="text-[#62abe2] stroke-[1.5px] flex-shrink-0" />
            <div>
              <h4 className="text-[#d4af37] text-[13px] font-bold tracking-[0.1em] uppercase mb-1">EASY RETURNS</h4>
              <p className="text-gray-400 text-[12px]">30-day policy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:justify-center pt-4 md:pt-0 lg:pl-4">
            <ShieldCheck size={32} className="text-[#e2a862] stroke-[1.5px] flex-shrink-0" />
            <div>
              <h4 className="text-[#d4af37] text-[13px] font-bold tracking-[0.1em] uppercase mb-1">SECURE PAYMENT</h4>
              <p className="text-gray-400 text-[12px]">100% protected</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:justify-center pt-4 md:pt-0 lg:pl-4">
            <Award size={32} className="text-[#d4af37] stroke-[1.5px] flex-shrink-0" />
            <div>
              <h4 className="text-[#d4af37] text-[13px] font-bold tracking-[0.1em] uppercase mb-1">PREMIUM QUALITY</h4>
              <p className="text-gray-400 text-[12px]">Curated styles</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// --- Main Page ---

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const [newRes, bestRes] = await Promise.all([
          axios.get('http://localhost:8000/api/v3/product/new-arrivals'),
          axios.get('http://localhost:8000/api/v3/product/best-sellers')
        ]);
        
        // Ensure we handle the data property from the response if the backend wraps it
        const newProducts = newRes.data?.newArrivals || newRes.data?.products || (Array.isArray(newRes.data) ? newRes.data : []);
        const bestProducts = bestRes.data?.bestSellers || bestRes.data?.products || (Array.isArray(bestRes.data) ? bestRes.data : []);
        
        // Add badges dynamically for UI distinction
        setNewArrivals(newProducts.map(p => ({ ...p, badge: 'NEW' })));
        setBestSellers(bestProducts.map(p => ({ ...p, badge: 'BESTSELLER' })));
      } catch (error) {
        console.error("Error fetching homepage dynamic lists:", error)
      }
    }
    fetchDynamicData();
  }, [])

  return (
    <div className="w-full bg-[#faf5e8]">
      
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row min-h-[600px] xl:min-h-[700px] border-b border-[#e5dfce]">
        {/* Left Side - Dark Block */}
        <div className="lg:w-1/2 w-full bg-[#1a2b4c] relative flex items-center justify-center p-12 min-h-[400px]">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
             <span className="font-serif text-[350px] leading-none text-white pointer-events-none">R</span>
          </div>
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <span className="text-[#c9a84c] text-[12px] font-bold tracking-[0.4em] uppercase">SINCE 2024</span>
          </div>
        </div>
        
        {/* Right Side - Content */}
        <div className="lg:w-1/2 w-full bg-white flex flex-col justify-center px-8 lg:px-20 py-20 relative">
          <div className="max-w-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[1px] bg-[#c9a84c]"></div>
              <span className="text-[#c9a84c] text-[12px] font-bold tracking-[0.3em] uppercase">NEW SEASON</span>
            </div>
            
            <h1 className="font-serif text-[48px] md:text-[64px] text-[#101828] leading-[1.1] mb-6">
              Redefine Your<br/>
              <span className="text-[#c9a84c] italic">Style</span>
            </h1>
            
            <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-[400px]">
              Discover curated fashion for Men, Women & Kids.<br/> 
              Premium quality meets contemporary design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-[400px]">
              <Link to="/women" className="text-center bg-[#c9a84c] text-white px-8 py-4 text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-[#b5953e] transition-colors">
                SHOP WOMEN
              </Link>
              <div className="flex gap-4">
                <Link to="/men" className="flex-1 text-center border border-[#101828] text-[#101828] px-6 py-4 text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors">
                  SHOP MEN
                </Link>
                <Link to="/kids" className="flex-1 text-center border border-[#101828] text-[#101828] px-6 py-4 text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors">
                  SHOP KIDS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category Circles */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-[28px] text-[#101828] mb-10">Shop by Category</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {categories.map((cat, idx) => (
              <Link to={cat.link} key={idx} className="group flex flex-col items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-[#c9a84c] transition-colors p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span className="font-bold text-[13px] tracking-widest uppercase text-[#101828] group-hover:text-[#c9a84c] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic API Sections */}
      {newArrivals.length > 0 && (
        <CollectionSection title="New Arrivals" products={newArrivals} bgColor="bg-[#faf5e8]" />
      )}
      
      {bestSellers.length > 0 && (
        <CollectionSection title="Best Sellers" products={bestSellers} bgColor="bg-white" />
      )}

      {/* Default Collections */}
      <CollectionSection title="Women's Collection" products={womenProducts} bgColor={bestSellers.length > 0 ? "bg-[#faf5e8]" : "bg-white"} />
      
      <CollectionSection title="Kids' Collection" products={kidsProducts} bgColor="bg-white" />
      
      <FeatureBar />
      
      <CollectionSection title="Men's Collection" products={menProducts} bgColor="bg-white" />

    </div>
  )
}

export default Home
