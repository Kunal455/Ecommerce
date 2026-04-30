import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background-white">
      {/* Left Pane - Visuals (hidden on text-mobile, visible on md+) */}
      <div className="hidden md:flex md:w-[45%] bg-[#101828] text-white flex-col justify-center items-center px-8 relative py-16">
        <div className="max-w-xl text-center flex flex-col items-center">
          
          {/* Logo Block */}
          <div className="w-32 h-32 bg-white p-1 flex items-center justify-center shadow-lg rounded-sm mb-10">
            <img 
              src="/logo.png" 
              alt="RAQEEBA" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Typography Logomark */}
          <h1 className="font-serif text-5xl tracking-[0.25em] text-white font-bold ml-[0.25em]">RAQEEBA</h1>
          <p className="text-[#c9a84c] tracking-[0.4em] font-sans font-bold text-[9px] mt-3 mb-8 ml-[0.4em] uppercase">THE TREND BREAKER</p>
          
          <div className="w-12 border-b border-[#c9a84c] mx-auto mb-10 opacity-70"></div>

          {/* Copy */}
          <h2 className="font-serif text-[40px] leading-[1.25] mb-6 font-normal">
            Fashion that <span className="text-[#c9a84c] italic">breaks every</span>
            <br />boundary.
          </h2>
          
          <p className="font-serif text-gray-300 text-[17px] leading-[1.8] max-w-[400px] mx-auto opacity-80">
            RAQEEBA redefines the rules. Curated styles for families
            <br />who lead, not follow — honest fabrics, bold silhouettes,
            <br />timeless confidence.
          </p>

          {/* Perks */}
          <div className="pt-16 text-left space-y-4 text-[10px] font-sans font-bold tracking-[0.15em] text-gray-300 uppercase mx-auto w-fit">
            <div className="flex items-center gap-4">
              <span className="text-[#c9a84c] text-xs leading-none">●</span> FREE DELIVERY ABOVE ₹2,999
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#c9a84c] text-xs leading-none">●</span> MEMBERS GET 10% OFF EVERY ORDER
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#c9a84c] text-xs leading-none">●</span> 30-DAY HASSLE-FREE RETURNS
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#c9a84c] text-xs leading-none">●</span> 100% AUTHENTIC — QUALITY GUARANTEED
            </div>
          </div>

        </div>
      </div>

      {/* Right Pane - Form content */}
      <div className="w-full md:w-[55%] bg-[#f9fafb] flex items-center justify-center py-12 px-6 sm:px-12">
        <div className="max-w-md w-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
