import React from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300x400';
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  
  return (
    <Link to={`/product/${product._id}`} className="bg-white group cursor-pointer border border-[#e5e7eb]/50 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
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

export default ProductCard
