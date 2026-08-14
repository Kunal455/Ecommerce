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
            <p className="text-sm text-gray-400 leading-relaxed mt-4 mb-6">
              India's boldest family fashion destination. Trend-breaking styles for every generation.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/vermakunal_01/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://wa.me/919128744294" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-80 transition-opacity shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
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
