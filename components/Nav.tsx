'use client';

import { useState, useCallback , useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import Logintoggle from './LoginModal';
import FirstSignupmodal from './FirstSignupmodal';
import { logout } from '@/redux/slice/authSlice';
import { useModalStore } from '@/store/modalStore';
import { clearCart } from '@/redux/slice/cartSlice';
import { FaCartShopping } from "react-icons/fa6";
interface RootState {
  auth: { isLoggedIn: boolean };
  cart: { items: any[] };
}

const Nav = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { openLogin, openSignup } = useModalStore();


const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
const dispatch = useDispatch();

useEffect(() => {
  if (!isLoggedIn) {
    dispatch(clearCart());
    localStorage.removeItem('cart');
  }
}, [isLoggedIn]);

  
  const cartCount = useSelector((state: RootState) => state.cart.items.length);


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
          <Link href="/cart" className="relative flex items-center hover:text-purple-400">
            <span className="absolute -top-2 -right-2 text-xs bg-purple-600 rounded-full px-1">{cartCount}</span>
            <FaCartShopping size={20} />
          </Link>

          <Link href="/products" className="relative flex items-center hover:text-purple-400">
            Products
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-500 rounded  text-white hover:bg-red-600 transition font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={openSignup}
                className="px-4 py-2 text-sm bg-green-600 rounded  text-white hover:bg-green-700 transition font-medium"
              >
                Sign Up
              </button>
              <button
                onClick={openLogin}
                className="px-4 py-2 text-sm bg-purple-700 rounded  text-white hover:bg-purple-800 transition font-medium"
              >
                Login
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
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50  bg-black/60 backdrop-blur-sm   text-black shadow-inner border-t" id="mobile-menu">
          <div className='bg-white  w-[80%]  h-screen '>
            <div className="flex justify-end px-6 pt-4">
            <button
              onClick={() => setShowMobileMenu(false)}
              aria-label="Close mobile menu"
              className="text-3xl font-bold text-gray-700 rounded hover:text-gray-900 transition"
            >
              &times;
            </button>
          </div>

          <nav className="flex flex-col px-6 py-4 gap-3">
            <Link href="/" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">
              Home
            </Link>
            <Link href="/products" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 font-medium">
              Products
            </Link>
           
            <Link href="/cart" onClick={() => setShowMobileMenu(false)} className="hover:text-purple-600 flex gap-2  font-medium">
                <FaCartShopping size={20}/> <span> Cart</span>
            </Link>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full text-left bg-red-500 text-white rounded  px-4 py-2 font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    openLogin();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left bg-purple-700 rounded  text-white px-4 py-2 font-medium hover:bg-purple-800 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    openSignup();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left rounded  bg-green-600 text-white px-4 py-2 font-medium hover:bg-green-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
          </div>
        </div>
      )}

      {/* Modals */}
      <Logintoggle />
      <FirstSignupmodal />
    </header>
  );
};

export default Nav;
