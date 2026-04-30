import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    subtitle: 'NEW SEASON 2026',
    title: (
      <>
        Redefine Your<br />
        <span className="italic">Style</span>
      </>
    ),
    description: 'Discover curated fashion for Men, Women & Kids.\nPremium quality meets contemporary design.',
    buttons: [
      { text: 'SHOP COLLECTION', link: '/shop', primary: true },
      { text: 'NEW ARRIVALS', link: '/new-arrivals', primary: false }
    ],
    // High-quality placeholder image for adult fashion
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 2,
    subtitle: 'KIDS COLLECTION',
    title: (
      <>
        Little<br />
        Trendsetters
      </>
    ),
    description: 'Playful, colorful outfits for boys and girls that combine\ncomfort with style.',
    buttons: [
      { text: 'SHOP KIDS', link: '/kids', primary: true }
    ],
    // High-quality placeholder image for kids fashion
    image: 'https://images.unsplash.com/photo-1519238263530-99bea67b0eb2?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 3,
    subtitle: 'WOMEN\'S EXCLUSIVE',
    title: (
      <>
        Elegance<br />
        Redefined
      </>
    ),
    description: 'Embrace the summer with our premium collection.\nDesigned to make you stand out.',
    buttons: [
      { text: 'SHOP WOMEN', link: '/women', primary: true }
    ],
    // High-quality placeholder image for women's fashion
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop'
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 800); // Match CSS transition duration
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goToSlide = (index) => {
    if (isAnimating || current === index) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <div className="relative w-full h-[600px] xl:h-[700px] overflow-hidden bg-[#1a2b4c]">
      
      {/* Slides Container */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        
        return (
          <div 
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img 
                src={slide.image} 
                alt="Slide background" 
                className={`absolute inset-0 w-full h-full object-cover object-center lg:object-right transition-transform duration-[10000ms] ease-linear ${isActive ? 'scale-105' : 'scale-100'}`}
              />
              {/* Mobile overlay for text readability */}
              <div className="absolute inset-0 bg-[#1a2b4c]/70 lg:hidden"></div>
              {/* Desktop smooth gradient mask (Solid Left -> Transparent Right) */}
              <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[#1a2b4c] from-0% via-[#1a2b4c] via-40% to-transparent to-100%"></div>
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 w-full h-full">
              <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 h-full flex items-center relative z-20">
                <div 
                  className={`max-w-xl transition-all duration-1000 transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: isActive ? '300ms' : '0ms' }}
                >
                  
                  {/* Subtitle */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-[2px] bg-[#c9a84c]"></div>
                    <span className="text-[#c9a84c] text-[12px] font-bold tracking-[0.3em] uppercase">
                      {slide.subtitle}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h1 className="font-serif text-[48px] sm:text-[60px] md:text-[72px] text-white leading-[1.05] mb-6">
                    {slide.title}
                  </h1>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-[15px] sm:text-[17px] leading-relaxed mb-10 max-w-[450px] whitespace-pre-line">
                    {slide.description}
                  </p>
                  
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {slide.buttons.map((btn, btnIdx) => (
                      <Link 
                        key={btnIdx} 
                        to={btn.link} 
                        className={`text-center px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                          btn.primary 
                            ? 'bg-[#c9a84c] text-[#101828] hover:bg-[#b5953e]' 
                            : 'bg-transparent border border-gray-400 text-white hover:border-white'
                        }`}
                      >
                        {btn.text}
                      </Link>
                    ))}
                  </div>

                </div>
              </div>
            </div>

          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 focus:outline-none"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 focus:outline-none"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 focus:outline-none rounded-full h-1 ${
              index === current 
                ? 'w-8 bg-[#c9a84c]' 
                : 'w-4 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroCarousel;
