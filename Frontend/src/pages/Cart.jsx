import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { removeFromGuestCart, removeFromCartBackend } from '../redux/slices/cartSlice';

const Cart = () => {
  const { items: cartItems } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (item) => {
    const payload = {
      productId: item.productId || item.product,
      size: item.size,
      color: item.color
    };

    if (isAuthenticated) {
      dispatch(removeFromCartBackend(payload));
    } else {
      dispatch(removeFromGuestCart(payload));
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center py-20 px-4">
        <ShoppingBag size={64} className="text-gray-300 stroke-[1px] mb-6" />
        <h1 className="font-serif text-3xl text-[#101828] mb-2">Your bag is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">Looks like you haven't added anything to your bag yet. Start exploring our latest collections.</p>
        <Link 
          to="/shop" 
          className="bg-[#101828] text-white px-8 py-4 text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-[#1a2e4a] transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        
        <h1 className="font-serif text-3xl md:text-4xl text-[#101828] mb-10">Shopping Bag</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <div key={index} className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    
                    {/* Product Info */}
                    <div className="sm:col-span-6 flex gap-6 items-center">
                      <div className="w-24 h-32 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-[#101828] mb-1 leading-tight">{item.name}</h3>
                        <div className="text-xs text-gray-500 space-y-1 mt-2">
                          <p><span className="text-gray-400">Size:</span> {item.size}</p>
                          <p><span className="text-gray-400">Color:</span> {item.color}</p>
                        </div>
                        <button 
                          onClick={() => handleRemove(item)}
                          className="mt-4 text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="sm:col-span-2 text-center hidden sm:block">
                      <span className="text-sm font-bold text-gray-800">₹{item.price?.toLocaleString()}</span>
                    </div>

                    {/* Quantity */}
                    <div className="sm:col-span-2 flex items-center sm:justify-center">
                      <span className="sm:hidden text-sm text-gray-500 mr-2">Qty:</span>
                      <span className="text-sm font-bold bg-gray-50 px-4 py-2 border border-gray-100 rounded-md">
                        {item.quantity}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="sm:col-span-2 sm:text-right flex items-center justify-between sm:block">
                      <span className="sm:hidden text-sm text-gray-500">Total:</span>
                      <span className="text-lg font-serif font-bold text-[#c9a84c]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 sticky top-24">
              <h2 className="font-serif text-xl text-[#101828] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taxes</span>
                  <span className="text-gray-400 text-xs">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-[13px] font-bold text-[#101828] uppercase tracking-widest">Total</span>
                <span className="font-serif text-3xl font-bold text-[#101828]">₹{subtotal.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#d4af37] text-white py-4 text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-[#c9a84c] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <div className="mt-6 flex justify-center">
                <Link to="/shop" className="text-[10px] font-bold text-gray-400 hover:text-[#101828] uppercase tracking-widest transition-colors underline underline-offset-4">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
