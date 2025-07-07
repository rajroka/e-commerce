'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { IoMdCart} from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import Image from 'next/image';
import Logintoggle from './LoginModal';
import FirstSignupmodal from './FirstSignupmodal';
import { logout } from '@/redux/slice/authSlice';



// Define RootState type for Redux
interface RootState {
  auth: { isLoggedIn: boolean };
  cart: { items: any[] }; // Replace `any` with actual item type if available
}

const Nav = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const cartCount = useSelector((state: RootState) => state.cart.items.length);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem('token');
    router.push('/');
  }, [dispatch, router]);

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
          <Link href="/" className="text-2xl font-bold text-purple-500 hover:text-purple-400 transition">
            <Image src="/ggimage.png" alt="Logo" width={40} height={40} className="rounded-full" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {/* <Link href="/wishlist" className="hover:text-red-400 transition">
            <IoMdHeart size={24} />
          </Link> */}

          <Link href="/cart" className="relative flex items-center hover:text-purple-400">
            <span className="absolute -top-2 -right-2 text-xs bg-purple-600 rounded-full px-1">
              {cartCount}
            </span>
            <IoMdCart size={24} />
          </Link>
          {/* <Filter /> */}

          <Link href="/products" className="relative flex items-center hover:text-purple-400">
            Products
          </Link>
           
           

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
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
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition"
          aria-label="Toggle mobile menu"
          aria-expanded={showMobileMenu}
        >
          <GiHamburgerMenu size={22} />
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white text-black shadow-inner border-t" id="mobile-menu">
          <nav className="flex flex-col px-6 py-4 gap-3">
            <Link href="/" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">🏠 Home</Link>
            <Link href="/products" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">🛍️ Products</Link>
            <Link href="/wishlist" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">❤️ Wishlist</Link>
            <Link href="/docs" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">📚 Docs</Link>
            <Link href="/cart" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">🛒 Cart</Link>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="text-left text-red-600 font-medium"
              >
                🔓 Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setShowMobileMenu(false);
                  }}
                  className="text-left hover:text-purple-600 font-medium"
                >
                  🔐 Login
                </button>
                <button
                  onClick={() => {
                    
                    setIsSignup(true);
                    setShowMobileMenu(false);
                  }}
                  className="text-left hover:text-green-600 font-medium"
                >
                  📝 Sign Up
                </button>
              </>
            )}
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
