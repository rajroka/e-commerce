import Link from 'next/link';
import React from 'react';

const ProductSidebar = () => {
  const linkStyle =
    'w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-600 hover:text-white dark:hover:bg-zinc-700 dark:hover:text-amber-300 transition-colors';

  return (
    <div className="w-64 fixed top-14 left-0 bg-amber-100 dark:bg-zinc-800 h-full p-4 z-10 shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
        Browse by
      </h1>

      <Link href="/products" className={linkStyle}>
        Shop All
      </Link>
      <Link href="/products?category=computers" className={linkStyle}>
        Computers
      </Link>
      <Link href="/products?category=tablets" className={linkStyle}>
        Tablets
      </Link>
      <Link href="/products?category=drones" className={linkStyle}>
        Drones & Cameras
      </Link>
      <Link href="/products?category=audio" className={linkStyle}>
        Audio
      </Link>
      <Link href="/products?category=mobile" className={linkStyle}>
        Mobile
      </Link>
      <Link href="/products?category=tv" className={linkStyle}>
        T.V & Home Cinema
      </Link>
      <Link href="/products?category=wearables" className={linkStyle}>
        Wearable Tech
      </Link>
      <Link href="/products?category=sale" className={linkStyle}>
        Sale
      </Link>
      <Link href="/products?category=accessories" className={linkStyle}>
        Accessories
      </Link>
    </div>
  );
};

export default ProductSidebar;
