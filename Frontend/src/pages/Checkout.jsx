import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { clearGuestCart } from '../redux/slices/cartSlice';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
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

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");

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

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!cart || !cart.products || cart.products.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setStep(2);
  };

  const handlePaymentMethodSubmit = async () => {
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
        shippingAddress: {
          address: address.street,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country
        },
        paymentMethod: selectedPaymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"
      }, { withCredentials: true });

      const newCheckoutId = checkoutRes.data.checkout._id;
      setCheckoutId(newCheckoutId);

      if (selectedPaymentMethod !== "cod") {
        const secretRes = await axios.post('/api/v3/checkout/create-razorpay-order', {
          checkoutId: newCheckoutId,
        }, { withCredentials: true });

        setClientSecret(secretRes.data);
      }
      
      setStep(3);
    } catch (error) {
      console.error("Error creating checkout session", error);
      alert(error.response?.data?.message || "Failed to initialize checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCODConfirm = async () => {
    setIsProcessing(true);
    try {
      await axios.post(`/api/v3/checkout/${checkoutId}/finalize`, {}, { withCredentials: true });
      handleSuccess();
    } catch (error) {
      console.error("Error confirming COD", error);
      alert("Failed to confirm order.");
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
          <div className="flex items-center space-x-2 sm:space-x-4 mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <div className={`h-1 flex-1 rounded ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
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
              
              <button type="submit" className="w-full mt-8 bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-black transition-all shadow-md active:scale-95 flex justify-center items-center">
                Continue to Payment Method
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Select Payment Method</h3>
              
              <div className="space-y-4">
                {/* 1. Credit / Debit Card Tab */}
                <label className={`block border rounded-xl p-5 cursor-pointer transition-all ${selectedPaymentMethod === 'card' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center">
                    <input type="radio" name="paymentMethod" value="card" checked={selectedPaymentMethod === 'card'} onChange={() => setSelectedPaymentMethod('card')} className="w-5 h-5 text-black border-gray-300 focus:ring-black" />
                    <div className="ml-4 flex-1">
                      <span className="block text-base font-semibold text-gray-900">Credit / Debit Card</span>
                      <span className="block text-sm text-gray-500 mt-1">Securely pay with Visa, Mastercard, or RuPay.</span>
                    </div>
                    <div className="flex space-x-2 opacity-70">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                    </div>
                  </div>
                </label>

                {/* 2. UPI Tab */}
                <label className={`block border rounded-xl p-5 cursor-pointer transition-all ${selectedPaymentMethod === 'upi' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center">
                    <input type="radio" name="paymentMethod" value="upi" checked={selectedPaymentMethod === 'upi'} onChange={() => setSelectedPaymentMethod('upi')} className="w-5 h-5 text-black border-gray-300 focus:ring-black" />
                    <div className="ml-4 flex-1">
                      <span className="block text-base font-semibold text-gray-900">UPI (Paytm, PhonePe, GPay)</span>
                      <span className="block text-sm text-gray-500 mt-1">Pay instantly via any UPI app or scanner.</span>
                    </div>
                    <div className="flex space-x-2 opacity-70">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                  </div>
                </label>

                {/* 3. COD Tab */}
                <label className={`block border rounded-xl p-5 cursor-pointer transition-all ${selectedPaymentMethod === 'cod' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center">
                    <input type="radio" name="paymentMethod" value="cod" checked={selectedPaymentMethod === 'cod'} onChange={() => setSelectedPaymentMethod('cod')} className="w-5 h-5 text-black border-gray-300 focus:ring-black" />
                    <div className="ml-4 flex-1">
                      <span className="block text-base font-semibold text-gray-900">Cash on Delivery</span>
                      <span className="block text-sm text-gray-500 mt-1">Pay with cash when your order is delivered.</span>
                    </div>
                    <div className="flex space-x-2 opacity-70">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button onClick={() => setStep(1)} disabled={isProcessing} className="px-6 py-3.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50">
                  Back
                </button>
                <button disabled={isProcessing} onClick={handlePaymentMethodSubmit} className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-black transition-all shadow-md active:scale-95 flex justify-center items-center disabled:opacity-70">
                  {isProcessing ? "Processing..." : `Continue securely with ${selectedPaymentMethod === 'cod' ? 'COD' : selectedPaymentMethod.toUpperCase()}`}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              {selectedPaymentMethod === "cod" ? (
                <div className="text-center p-8 border border-gray-200 rounded-2xl bg-gray-50">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Order</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">You have selected Cash on Delivery. Please confirm your order below to finalize your purchase. You will pay when the items arrive.</p>
                  
                  <button 
                    disabled={isProcessing}
                    onClick={handleCODConfirm}
                    className="w-full max-w-md mx-auto bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 flex justify-center items-center"
                  >
                    {isProcessing ? "Confirming..." : "Confirm COD Order"}
                  </button>
                </div>
              ) : clientSecret ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Payment Details</h3>
                  {clientSecret.id === "order_dummy_for_testing" ? (
                    <div className="bg-yellow-50 p-6 border border-yellow-200 rounded-xl text-center shadow-sm">
                      <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>
                      <h4 className="text-lg font-bold text-yellow-800 mb-2">Test Mode Active</h4>
                      <p className="text-sm text-yellow-700 mb-6">Razorpay keys are not configured. You can simulate a successful payment below to test the order creation workflow.</p>
                      <button 
                        disabled={isProcessing}
                        onClick={async () => {
                          setIsProcessing(true);
                          try {
                            await axios.put(`/api/v3/checkout/${checkoutId}/pay`, {
                              paymentStatus: "paid",
                              paymentDetails: { razorpay_payment_id: "simulated_payment_id", razorpay_order_id: "order_dummy", razorpay_signature: "dummy_sig" }
                            }, { withCredentials: true });
                            await axios.post(`/api/v3/checkout/${checkoutId}/finalize`, {}, { withCredentials: true });
                            handleSuccess();
                          } catch (err) {
                            alert("Simulated payment failed");
                            console.error(err);
                          }
                          setIsProcessing(false);
                        }}
                        className="w-full bg-yellow-500 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-600 transition-colors shadow-md disabled:opacity-50"
                      >
                        {isProcessing ? "Simulating..." : "Simulate Payment Success"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-8 border border-gray-200 rounded-2xl bg-gray-50">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h3>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">You will be redirected to Razorpay securely to complete your payment.</p>
                      
                      <button 
                        disabled={isProcessing}
                        onClick={async () => {
                          setIsProcessing(true);
                          const res = await loadRazorpayScript();
                          if (!res) {
                            alert("Razorpay SDK failed to load. Are you online?");
                            setIsProcessing(false);
                            return;
                          }

                          const options = {
                            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                            amount: clientSecret.amount,
                            currency: clientSecret.currency,
                            name: "Ecommerce Store",
                            description: "Order Payment",
                            order_id: clientSecret.id,
                            handler: async function (response) {
                              try {
                                await axios.put(`/api/v3/checkout/${checkoutId}/pay`, {
                                  paymentStatus: "paid",
                                  paymentDetails: response
                                }, { withCredentials: true });
                        
                                await axios.post(`/api/v3/checkout/${checkoutId}/finalize`, {}, { withCredentials: true });
                        
                                handleSuccess();
                              } catch (err) {
                                console.error("Error finalizing:", err);
                                alert("Payment succeeded but order finalization failed.");
                              }
                            },
                            prefill: {
                              name: address.name,
                              contact: "",
                            },
                            theme: {
                              color: "#000000",
                            },
                          };
                          const paymentObject = new window.Razorpay(options);
                          paymentObject.on('payment.failed', function (response){
                              alert(response.error.description);
                          });
                          paymentObject.open();
                          setIsProcessing(false);
                        }}
                        className="w-full max-w-md mx-auto bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 flex justify-center items-center"
                      >
                        {isProcessing ? "Processing..." : "Pay with Razorpay"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>
              )}
              
              <button disabled={isProcessing} onClick={() => setStep(2)} className="mt-6 text-sm text-gray-500 hover:text-black font-medium transition-colors flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back to payment selection
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
                      <div className="text-sm font-bold text-gray-900 whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-5 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span className="text-gray-900">₹{cart.products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-4 border-t border-gray-100 mt-2">
                    <span>Total</span>
                    <span>₹{cart.products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)}</span>
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
