'use client';
import { useEffect, useState } from 'react';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { IoMdCart, IoMdHeart } from 'react-icons/io';
import { MdSearch } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import Logintoggle from './LoginModal';
import FirstSignupmodal from './FirstSignupmodal';

const Nav = () => {
  const [searchText, setSearchText] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
   
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const router = useRouter();

  const cartCount = useSelector((state: { cart: { items: any[] } }) => state.cart.items.length);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`/products?search=${searchText}`);
    }
  };

  return (
    <header className="w-full sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between flex-wrap gap-4">
        {/* Left: Logo and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <Link href="/">
            <span className="text-2xl font-bold text-purple-600 tracking-wide">TechShed</span>
          </Link>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full h-10 px-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <MdSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 cursor-pointer"
              size={20}
              onClick={() => router.push(`/products?search=${searchText}`)}
            />
          </div>
        </div>
                    <Link href="/docs" className="text-gray-700 hover:text-purple-600 font-medium">🛒 docs </Link>

        {/* Right: Icons and Menu */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
              onClick={()=>setIsSignup(true)}
            className=" px-4 py-2  border border-solid rounded-full flex items-center justify-center gap-2  bg-gray-200 border-gray-400   "
          >
            <FaUserPlus /> 
            Sign up       
            {/* <FirstSignupmodal /> */}

          </button>

          <button
            onClick={() => setIsLogin(true)}
            className="flex items-center gap-2 text-sm sm:text-base px-4 py-2 border border-gray-400 bg-gray-200 rounded-full hover:bg-purple-600 hover:text-white transition duration-200"
          >
            <FaSignInAlt /> Login 
          </button>

          <Link href="/wishlist">
            <IoMdHeart size={24} className="text-gray-600 hover:text-red-500 transition" />
          </Link>

          <Link href="/cart" className="flex items-center gap-1 text-gray-700 relative">
            <span className="text-sm font-semibold">{cartCount}</span>
            <IoMdCart size={24} className="hover:text-purple-600 transition" />
          </Link>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            title="Toggle Mobile Menu"
          >
            <GiHamburgerMenu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-inner border-t">
          <nav className="flex flex-col px-6 py-4 space-y-3">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">🏠 Home</Link>
            <Link href="/products" className="text-gray-700 hover:text-purple-600 font-medium">🛍️ Products</Link>
            <Link href="/wishlist" className="text-gray-700 hover:text-purple-600 font-medium">❤️ Wishlist</Link>
             <Link href="/docs" className="text-gray-700 hover:text-purple-600 font-medium">🛒 docs </Link>

            <Link href="/cart" className="text-gray-700 hover:text-purple-600 font-medium">🛒 Cart</Link>
            <button onClick={() => { setIsLogin(true); setShowMobileMenu(false); }} className="text-gray-700 hover:text-purple-600 font-medium text-left">🔐 Sign In</button>
            <button onClick={() => { setIsSignup(true); setShowMobileMenu(false); }} className="text-gray-700 hover:text-green-600 font-medium text-left">📝 Sign Up</button>
          </nav>
        </div>
      )}

      {/* Modals */}
      <Logintoggle isLogin={isLogin} setIsLogin={setIsLogin} />
      <FirstSignupmodal  isSignup={isSignup} setIsSignup={setIsSignup} />
    </header>
  );
};

export default Nav;
