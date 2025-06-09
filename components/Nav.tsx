'use client';
import { useState } from 'react';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { IoMdCart, IoMdHeart } from 'react-icons/io';
import { MdSearch } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Logintoggle from './LoginModal';
import FirstSignupmodal from './FirstSignupmodal';

const Nav = () => {
  const [searchText, setSearchText] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const cartCount = useSelector((state: { cart: { items: any[] } }) => state.cart.items.length);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchText.trim()) {
      router.push(`/products?search=${searchText.trim()}`);
    }
  };

  const handleIconSearch = () => {
    if (searchText.trim()) {
      router.push(`/products?search=${searchText.trim()}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        {/* Logo + Search */}
        <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
          <Link href="/" className="text-2xl font-bold text-purple-500 hover:text-purple-400 transition">
            TechShed
          </Link>

          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products..."
              className="w-full h-10 px-4 pr-10 text-black border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <MdSearch
              size={20}
              onClick={handleIconSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 cursor-pointer hover:text-purple-700"
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
        
          <Link href="/wishlist" className="hover:text-red-400 transition">
            <IoMdHeart size={24} />
          </Link>
          <Link href="/cart" className="relative flex items-center hover:text-purple-400">
            <span className="absolute -top-2 -right-2 text-xs bg-purple-600 rounded-full px-1">{cartCount}</span>
            <IoMdCart size={24} />
          </Link>
           <Link href="/products" className="relative flex items-center hover:text-purple-400">
            products 
            
          </Link>
          <button
            onClick={() => setIsSignup(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-gray-100 text-black hover:bg-purple-600 hover:text-white transition"
          >
            <FaUserPlus /> Sign Up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-gray-100 text-black hover:bg-purple-600 hover:text-white transition"
          >
            <FaSignInAlt /> Login
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition"
          aria-label="Toggle mobile menu"
        >
          <GiHamburgerMenu size={22} />
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white text-black shadow-inner border-t">
          <nav className="flex flex-col px-6 py-4 gap-3">
            <Link href="/" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">🏠 Home</Link>
            <Link href="/products" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">🛍️ Products</Link>
            <Link href="/wishlist" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">❤️ Wishlist</Link>
            <Link href="/docs" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">📚 Docs</Link>
            <Link href="/cart" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">🛒 Cart</Link>
            <button
              onClick={() => { setIsLogin(true); setShowMobileMenu(false); }}
              className="text-left hover:text-purple-600 font-medium"
            >
              🔐 Login
            </button>
            <button
              onClick={() => { setIsSignup(true); setShowMobileMenu(false); }}
              className="text-left hover:text-green-600 font-medium"
            >
              📝 Sign Up
            </button>
          </nav>
        </div>
      )}

      {/* Modals */}
      <Logintoggle isLogin={isLogin} setIsLogin={setIsLogin} />
      <FirstSignupmodal isSignup={isSignup} setIsSignup={setIsSignup} />
    </header>
  );
};

export default Nav;
