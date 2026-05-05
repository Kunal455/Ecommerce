import React, { useState } from 'react'
import axios from 'axios'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);
    setMessage('');

    try {
      const response = await axios.post('/api/v3/subscribe', { email });
      setStatus('success');
      setMessage(response.data.message || 'Successfully subscribed!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Subscription failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#101928] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="col-span-1">
            <div className="flex flex-col mb-4">
              <span className="font-serif font-bold text-2xl text-white tracking-widest">RAQEEBA</span>
              <span className="text-[10px] text-secondary tracking-[0.2em] uppercase">The Trend Breaker</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mt-4">
              India's boldest family fashion destination. Trend-breaking styles for every generation.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-secondary tracking-widest text-xs font-bold uppercase mb-6">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Women</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Men</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kids</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-secondary tracking-widest text-xs font-bold uppercase mb-6">Customer Care</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* About Raqeeba & Newsletter */}
          <div>
            <h3 className="text-secondary tracking-widest text-xs font-bold uppercase mb-6">About Raqeeba</h3>
            <ul className="space-y-4 text-sm text-gray-300 mb-8">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>

            <h3 className="text-secondary tracking-widest text-xs font-bold uppercase mb-4">Join The Club</h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">Subscribe for exclusive offers, new drops, and trend reports.</p>
            
            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                required
                className="w-full bg-[#1a2b4c] border border-gray-700 text-white placeholder-gray-500 text-sm px-4 py-3 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-0 top-0 bottom-0 px-4 bg-[#d4af37] text-[#101928] hover:bg-[#c9a84c] transition-colors flex items-center justify-center disabled:opacity-70"
              >
                <Send size={16} />
              </button>
            </form>
            
            {status === 'success' && (
              <div className="mt-3 flex items-center gap-2 text-green-400 text-xs">
                <CheckCircle size={14} /> <span>{message}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="mt-3 flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={14} /> <span>{message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            &copy; 2026 RAQEEBA — The Trend Breaker. All Rights Reserved.
          </p>
          <div className="flex space-x-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy</a>
            <a href="#" className="hover:text-gray-300">Terms</a>
            <a href="#" className="hover:text-gray-300">Cookies</a>
            <a href="#" className="hover:text-gray-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
