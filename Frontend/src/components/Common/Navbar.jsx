import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='container mx-auto flex items-center justify-between py-4 px-6'>
        {/*left logo*/}
        <div>
            
    <Link to='/' className='text-2xl no-underline font-medium'>
    Shopever
    </Link>
        </div>
        {/*center navigation link*/}
        <div className=' md:flex space-x-6'>
            <Link to='#' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>MEN</Link>
        </div>
        <div className=' md:flex space-x-6'>
            <Link to='#' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>WOMEN</Link>
        </div>
        <div className=' md:flex space-x-6'>
            <Link to='#' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>CHILDREN</Link>
        </div>
        
    </nav>
  )
}

export default Navbar