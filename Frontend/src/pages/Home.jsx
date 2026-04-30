import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Truck, RefreshCcw, ShieldCheck, Award } from 'lucide-react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import HeroCarousel from '../components/HeroCarousel'

// --- Mock Data ---

const categories = [
  { name: 'Women', image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=200&auto=format&fit=crop&q=60', link: '/women' },
  { name: 'Men', image: 'https://images.unsplash.com/photo-1594938298595-c2cf93198fbc?w=200&auto=format&fit=crop&q=60', link: '/men' },
  { name: 'Kids', image: 'https://images.unsplash.com/photo-1519238263530-99bea67b0eb2?w=200&auto=format&fit=crop&q=60', link: '/kids' },
  { name: 'Sale', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&auto=format&fit=crop&q=60', link: '/sale' }
]

// --- Components ---

const CollectionSection = ({ title, products, bgColor = "bg-[#f9fafb]", link = "#" }) => {
  if (!products || products.length === 0) return null;
  return (
    <section className={`py-20 ${bgColor}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-serif text-3xl md:text-[40px] text-[#101828]">{title}</h2>
          <Link to={link} className="text-[#c9a84c] text-[12px] font-bold tracking-[0.2em] uppercase hover:text-[#a88a3b] transition-colors flex items-center gap-2">
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
    <div className="w-full bg-[#f9fafb]">
      
      {/* Hero Section */}
      <HeroCarousel />

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
        <CollectionSection title="New Arrivals" link="/new-arrivals" products={newArrivals} bgColor="bg-[#f9fafb]" />
      )}
      
      {bestSellers.length > 0 && (
        <CollectionSection title="Best Sellers" link="/best-sellers" products={bestSellers} bgColor="bg-white" />
      )}

      <FeatureBar />

    </div>
  )
}

export default Home
