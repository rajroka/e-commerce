'use client';
import { useEffect, useState } from 'react';
import { FaUserMd } from 'react-icons/fa';
import { IoMdCart, IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { MdSearch } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import Logintoggle from './LoginModal';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Search from './Search';

const Nav = () => {
  const [products, setProducts] = useState<{ title: string }[]>([]);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const [searchText , setSearchtext] = useState('');
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery)
  );

 

  const cartCount = useSelector((state: { cart: { items: any[] } }) => state.cart.items.length);
  const [isLogin, setIsLogin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
            <Link href="/"><span className="text-2xl font-bold text-purple-600 tracking-wide">TechShed</span></Link>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchtext(e.target.value)}
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

        {/* Right: Icons and Menu */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={() => setIsLogin(true)}
            className="flex items-center gap-2 text-sm sm:text-base px-4 py-2 border border-gray-300 rounded-full hover:bg-purple-600 hover:text-white transition duration-200"
          >
            <FaUserMd /> Sign In
          </button>

          <div className="hidden md:flex items-center gap-2">
            <IoMdHeart className="text-gray-600 hover:text-red-500 transition" size={22} />
            <IoMdHeartEmpty className="text-gray-600 hover:text-red-500 transition" size={22} />
          </div>

          <Link href="/cart" className="flex items-center gap-1 text-gray-700 relative">
            <span className="text-sm font-semibold">{cartCount}</span>
            <IoMdCart size={24} className="hover:text-purple-600 transition" />
          </Link>

          <button
          title='button '
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <GiHamburgerMenu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-inner border-t">
          <nav className="flex flex-col px-6 py-4 space-y-3">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">
              🏠 Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-purple-600 font-medium">
              🛍️ Products
            </Link>
            <Link href="/wishlist" className="text-gray-700 hover:text-purple-600 font-medium">
              ❤️ Wishlist
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-purple-600 font-medium">
              🛒 Cart
            </Link>
            <button
              onClick={() => {
                setIsLogin(true);
                setShowMobileMenu(false);
              }}
              className="text-gray-700 hover:text-purple-600 font-medium text-left"
            >
              🔐 Sign In
            </button>
          </nav>
        </div>
      )}

      {/* Login Modal */}
      <Logintoggle isLogin={isLogin} setIsLogin={setIsLogin} />
    </header>
  );
};

export default Nav;
