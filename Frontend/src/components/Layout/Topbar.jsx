import React from 'react'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"

const Topbar = () => {
  return (
    <div className="bg-[#ea2e0e] text-white text-xs">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">

        {/* Left: Social icons (HIDDEN on small screens) */}
        <div className="flex items-center space-x-3 max-md:hidden">
          <a
            href="#"
            className="p-1.5 rounded-full hover:bg-white/20 transition"
            aria-label="Meta"
          >
            <TbBrandMeta className="h-4 w-4" />
          </a>

          <a
            href="#"
            className="p-1.5 rounded-full hover:bg-white/20 transition"
            aria-label="Instagram"
          >
            <IoLogoInstagram className="h-4 w-4" />
          </a>

          <a
            href="#"
            className="p-1.5 rounded-full hover:bg-white/20 transition"
            aria-label="Twitter X"
          >
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>

        {/* Center: Message (ALWAYS visible) */}
        <div className="flex-1 text-center font-medium tracking-wide text-white/95">
          We ship worldwide — Fast & reliable shipping
        </div>

        {/* Right: Phone (HIDDEN on small screens) */}
        <div className="font-medium max-md:hidden">
          <a
            href="tel:9128744294"
            className="hover:text-white/80 transition"
          >
            📞 9128744294
          </a>
        </div>

      </div>
    </div>
  )
}

export default Topbar
