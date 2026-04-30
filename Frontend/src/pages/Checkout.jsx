import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { clearGuestCart } from '../redux/slices/cartSlice';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ clientSecret, checkoutId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", 
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await axios.put(`/api/v3/checkout/${checkoutId}/pay`, {
          paymentStatus: "paid",
          paymentDetails: paymentIntent
        }, { withCredentials: true });

        await axios.post(`/api/v3/checkout/${checkoutId}/finalize`, {}, { withCredentials: true });

        onSuccess();
      } catch (err) {
        console.error("Error finalizing:", err);
        setMessage("Payment succeeded but order finalization failed.");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
      >
        <span id="button-text">
          {isLoading ? "Processing..." : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message" className="text-red-500 text-center mt-4 bg-red-50 p-3 rounded-md border border-red-100">{message}</div>}
    </form>
  );
};

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  
  const [address, setAddress] = useState({
    name: '', street: '', city: '', postalCode: '', country: ''
  });
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState('');
  const [checkoutId, setCheckoutId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('/api/v3/cart', { withCredentials: true });
        setCart(res.data.cart);
      } catch (error) {
        console.error("Failed to fetch cart", error);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, []);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (!cart || !cart.products || cart.products.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsProcessing(true);
    try {
      const checkoutItems = cart.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        size: p.size,
        color: p.color
      }));

      const checkoutRes = await axios.post('/api/v3/checkout', {
        checkoutItems,
        shippingAddress: address,
        paymentMethod: "Stripe"
      }, { withCredentials: true });

      const newCheckoutId = checkoutRes.data.checkout._id;
      setCheckoutId(newCheckoutId);

      const secretRes = await axios.post('/api/v3/checkout/create-checkout-session', {
        checkoutId: newCheckoutId
      }, { withCredentials: true });

      setClientSecret(secretRes.data.clientSecret);
      setStep(2);
    } catch (error) {
      console.error("Error creating checkout session", error);
      alert("Failed to initialize checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccess = () => {
    setSuccess(true);
    dispatch(clearGuestCart());
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 backdrop-blur-sm px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-gray-100 transform transition-all">
          <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Payment Successful!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">Thank you for your purchase. Your order has been placed and will be processed shortly.</p>
          <button onClick={() => navigate('/shop')} className="w-full bg-gray-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-black transition-all shadow-md active:scale-95">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Form/Payment */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100/80">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 tracking-tight">Checkout</h2>
          
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4 mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          </div>

          {step === 1 && (
            <form onSubmit={handleAddressSubmit} className="space-y-5 animate-in fade-in duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Shipping Address</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input required type="text" value={address.name} onChange={(e) => setAddress({...address, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                <input required type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input required type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="New York" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                  <input required type="text" value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="10001" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                <input required type="text" value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="United States" />
              </div>
              
              <button disabled={isProcessing} type="submit" className="w-full mt-8 bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-black transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center">
                {isProcessing ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : null}
                {isProcessing ? "Processing..." : "Continue to Payment"}
              </button>
            </form>
          )}

          {step === 2 && clientSecret && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Payment Details</h3>
              <Elements options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#000', borderRadius: '12px' } } }} stripe={stripePromise}>
                <CheckoutForm clientSecret={clientSecret} checkoutId={checkoutId} onSuccess={handleSuccess} />
              </Elements>
              <button onClick={() => setStep(1)} className="mt-6 text-sm text-gray-500 hover:text-black font-medium transition-colors flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back to shipping
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80 sticky top-24">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
            {loadingCart ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-gray-100 rounded-2xl w-full"></div>
                <div className="h-20 bg-gray-100 rounded-2xl w-full"></div>
              </div>
            ) : (!cart || !cart.products || cart.products.length === 0) ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <p className="text-gray-500 font-medium">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  {cart.products.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center group">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.size} • {item.color}</p>
                      </div>
                      <div className="text-sm font-bold text-gray-900 whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-5 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span className="text-gray-900">${cart.products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-4 border-t border-gray-100 mt-2">
                    <span>Total</span>
                    <span>${cart.products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
