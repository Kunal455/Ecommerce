import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-react'

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
}

const Shop = ({ defaultGender = '', defaultCollection = '', defaultSortBy = 'newest', titleOverride = '' }) => {
  const location = useLocation()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  
  // Available filter options from DB
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    materials: [],
    collections: [],
    genders: []
  })

  // Mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Filters State
  const [filters, setFilters] = useState({
    gender: defaultGender,
    collection: defaultCollection,
    categories: [],
    brands: [],
    sizes: [],
    materials: [],
    collections: [],
    minPrice: 0,
    maxPrice: 15000,
    colors: [],
    sortBy: defaultSortBy,
    page: 1
  })

  // Whenever default props change, reset relevant filters
  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      gender: defaultGender, 
      collection: defaultCollection, 
      sortBy: defaultSortBy,
      page: 1 
    }))
  }, [defaultGender, defaultCollection, defaultSortBy])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v3/product/filters')
        setFilterOptions(res.data.filters)
      } catch (error) {
        console.error("Error fetching filter options:", error)
      }
    }
    fetchOptions()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Build query string
      let queryStr = `?page=${filters.page}&limit=12&sortBy=${filters.sortBy}`
      
      if (filters.gender && filters.gender !== 'All') queryStr += `&gender=${filters.gender}`
      if (filters.collection) queryStr += `&collection=${filters.collection}`
      if (filters.categories.length > 0) queryStr += `&category=${filters.categories.join(',')}`
      if (filters.brands.length > 0) queryStr += `&brand=${filters.brands.join(',')}`
      if (filters.colors.length > 0) queryStr += `&color=${filters.colors.join(',')}`
      if (filters.sizes.length > 0) queryStr += `&size=${filters.sizes.join(',')}`
      if (filters.materials.length > 0) queryStr += `&material=${filters.materials.join(',')}`
      if (filters.collections.length > 0) queryStr += `&collection=${filters.collections.join(',')}`
      
      queryStr += `&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`

      const res = await axios.get(`http://localhost:8000/api/v3/product${queryStr}`)
      setProducts(res.data.products)
      setTotalPages(res.data.totalPages)
      setTotalProducts(res.data.totalProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleArrayFilterChange = (filterType, value) => {
    setFilters(prev => {
      const isSelected = prev[filterType].includes(value)
      return {
        ...prev,
        page: 1,
        [filterType]: isSelected
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value]
      }
    })
  }

  const handleClearAll = () => {
    setFilters({
      gender: defaultGender,
      collection: defaultCollection,
      categories: [],
      brands: [],
      sizes: [],
      materials: [],
      collections: [],
      minPrice: 0,
      maxPrice: 15000,
      colors: [],
      sortBy: 'newest',
      page: 1
    })
  }

  // Generate breadcrumb
  const getBreadcrumb = () => {
    let current = 'All Products'
    if (titleOverride) {
      current = titleOverride
    } else if (defaultGender) {
      current = `${defaultGender}'s Collection`
    } else if (defaultCollection) {
      current = `${defaultCollection} Collection`
    }
    return (
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-gray-400 uppercase mb-8">
        <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[#101828]">{current}</span>
      </div>
    )
  }

  // Generate pagination numbers
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (filters.page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (filters.page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', filters.page - 1, filters.page, filters.page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen pt-8 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {getBreadcrumb()}

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-between bg-white p-4 border border-[#e5e7eb]"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <span className="font-bold text-[12px] tracking-[0.2em] uppercase text-[#101828]">Filters</span>
            <SlidersHorizontal size={18} />
          </button>

          {/* Left Sidebar */}
          <aside className={`lg:w-[260px] flex-shrink-0 bg-white border border-[#e5e7eb] p-6 lg:block lg:sticky lg:top-8 lg:max-h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <style>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
              .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-[13px] tracking-[0.2em] uppercase text-[#101828]">Filters</h2>
              <button onClick={handleClearAll} className="text-[#c9a84c] font-bold text-[10px] tracking-[0.2em] uppercase hover:text-[#b5953e] transition-colors">
                Clear All
              </button>
            </div>

            {/* Gender Section */}
            {filterOptions.genders.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="font-bold text-[11px] tracking-[0.2em] uppercase text-[#101828] mb-5">Gender</h3>
                <div className="space-y-3">
                  {['All', ...filterOptions.genders].map(g => (
                    <label key={g} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.gender === g || (g === 'All' && !filters.gender) ? 'border-[#c9a84c]' : 'border-gray-300 group-hover:border-[#c9a84c]'}`}>
                        {(filters.gender === g || (g === 'All' && !filters.gender)) && <div className="w-2.5 h-2.5 rounded-full bg-[#c9a84c]" />}
                      </div>
                      <span className="text-[#101828] text-sm">{g}</span>
                      <input 
                        type="radio" 
                        name="gender" 
                        className="hidden" 
                        checked={filters.gender === g || (g === 'All' && !filters.gender)}
                        onChange={() => setFilters(prev => ({...prev, gender: g === 'All' ? '' : g, page: 1}))}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Category Section */}
            {filterOptions.categories.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="font-bold text-[11px] tracking-[0.2em] uppercase text-[#101828] mb-5">Category</h3>
                <div className="space-y-4">
                  {filterOptions.categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.categories.includes(cat) ? 'bg-[#c9a84c] border-[#c9a84c]' : 'bg-white border-gray-300 group-hover:border-[#c9a84c]'}`}>
                        {filters.categories.includes(cat) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-[#101828] text-sm">{cat}</span>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={filters.categories.includes(cat)}
                        onChange={() => handleArrayFilterChange('categories', cat)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Section */}
            {filterOptions.brands.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="font-bold text-[11px] tracking-[0.2em] uppercase text-[#101828] mb-5">Brand</h3>
                <div className="space-y-4">
                  {filterOptions.brands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.brands.includes(brand) ? 'bg-[#c9a84c] border-[#c9a84c]' : 'bg-white border-gray-300 group-hover:border-[#c9a84c]'}`}>
                        {filters.brands.includes(brand) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-[#101828] text-sm">{brand}</span>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleArrayFilterChange('brands', brand)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Size Section */}
            {filterOptions.sizes.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="font-bold text-[11px] tracking-[0.2em] uppercase text-[#101828] mb-5">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => handleArrayFilterChange('sizes', size)}
                      className={`min-w-[40px] h-10 px-2 text-sm font-bold border flex items-center justify-center transition-colors ${
                        filters.sizes.includes(size)
                          ? 'border-[#101828] bg-[#101828] text-white'
                          : 'border-gray-300 bg-white text-[#101828] hover:border-[#101828]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Materials Section */}
            {filterOptions.materials.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="font-bold text-[11px] tracking-[0.2em] uppercase text-[#101828] mb-5">Material</h3>
                <div className="space-y-4">
                  {filterOptions.materials.map(mat => (
                    <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.materials.includes(mat) ? 'bg-[#c9a84c] border-[#c9a84c]' : 'bg-white border-gray-300 group-hover:border-[#c9a84c]'}`}>
                        {filters.materials.includes(mat) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-[#101828] text-sm">{mat}</span>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={filters.materials.includes(mat)}
                        onChange={() => handleArrayFilterChange('materials', mat)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Collections Section */}
            {filterOptions.collections.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="font-bold text-[11px] tracking-[0.2em] uppercase text-[#101828] mb-5">Collections</h3>
                <div className="space-y-4">
                  {filterOptions.collections.map(col => (
                    <label key={col} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.collections.includes(col) ? 'bg-[#c9a84c] border-[#c9a84c]' : 'bg-white border-gray-300 group-hover:border-[#c9a84c]'}`}>
                        {filters.collections.includes(col) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-[#101828] text-sm">{col}</span>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={filters.collections.includes(col)}
                        onChange={() => handleArrayFilterChange('collections', col)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="font-bold text-[11px] tracking-[0.2em] uppercase text-[#101828] mb-5">Price Range</h3>
              <div className="flex justify-between text-sm font-bold text-[#101828] mb-4">
                <span>₹0</span>
                <span>₹{filters.maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="15000" 
                step="500"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({...prev, maxPrice: Number(e.target.value), page: 1}))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#c9a84c]"
              />
            </div>

            {/* Colors */}
            {filterOptions.colors.length > 0 && (
              <div>
                <h3 className="font-bold text-[11px] tracking-[0.2em] uppercase text-[#101828] mb-5">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {filterOptions.colors.map(colorName => {
                    const isSelected = filters.colors.includes(colorName)
                    const colorData = COLOR_MAP[colorName] || { hex: colorName.toLowerCase() }
                    return (
                      <button
                        key={colorName}
                        onClick={() => handleArrayFilterChange('colors', colorName)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${colorData.border ? 'border border-gray-200' : ''} ${isSelected ? 'ring-2 ring-offset-2 ring-[#101828]' : 'hover:scale-110'}`}
                        style={{ backgroundColor: colorData.hex }}
                        title={colorName}
                      />
                    )
                  })}
                </div>
              </div>
            )}

          </aside>

          {/* Main Grid Area */}
          <div className="flex-1">
            
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 text-sm">Showing <span className="font-bold text-[#101828]">{products.length}</span> of {totalProducts} products</span>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase hidden sm:block">Sort By</span>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-[#e5e7eb] text-[#101828] text-sm font-bold pl-4 pr-10 py-2.5 outline-none focus:border-[#c9a84c] transition-colors cursor-pointer"
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({...prev, sortBy: e.target.value, page: 1}))}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="rating_desc">Best Sellers</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button 
                      disabled={filters.page === 1}
                      onClick={() => setFilters(prev => ({...prev, page: prev.page - 1}))}
                      className="w-10 h-10 flex items-center justify-center border border-[#e5e7eb] bg-white text-[#101828] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight size={18} className="rotate-180" />
                    </button>
                    
                    <div className="flex gap-1">
                      {getPageNumbers().map((pageNum, idx) => (
                        <button
                          key={idx}
                          disabled={pageNum === '...'}
                          onClick={() => typeof pageNum === 'number' && setFilters(prev => ({...prev, page: pageNum}))}
                          className={`w-10 h-10 flex items-center justify-center border text-sm font-bold transition-colors ${
                            filters.page === pageNum 
                              ? 'bg-[#101828] border-[#101828] text-white' 
                              : pageNum === '...'
                                ? 'bg-transparent border-transparent text-gray-400 cursor-default'
                                : 'bg-white border-[#e5e7eb] text-[#101828] hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button 
                      disabled={filters.page === totalPages}
                      onClick={() => setFilters(prev => ({...prev, page: prev.page + 1}))}
                      className="w-10 h-10 flex items-center justify-center border border-[#e5e7eb] bg-white text-[#101828] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white border border-[#e5e7eb] py-20 px-4 text-center">
                <h3 className="font-serif text-2xl text-[#101828] mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <button onClick={handleClearAll} className="bg-[#c9a84c] text-white px-8 py-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#b5953e] transition-colors">
                  Clear All Filters
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
