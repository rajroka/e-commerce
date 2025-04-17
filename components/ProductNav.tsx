import Link from 'next/link';
import React from 'react';

const ProductNav = () => {
  const linkStyle =
    'w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-600 hover:text-white transition-colors whitespace-nowrap';

  const categories = [
    { name: 'Shop All', value: '' },
    { name: 'Computers', value: 'Computers' },
    { name: 'Tablets', value: 'Tablets' },
    { name: 'Drones & cameras', value: 'Drones & cameras' },
    { name: 'Audio', value: 'Audio' },
    { name: 'Mobile', value: 'Mobile' },
    { name: 'T.V & Home Cinema', value: 'T.V & Home Cinema' },
    { name: 'Wearable Tech', value: 'Wearable Tech' },
    { name: 'Sale', value: 'Sale' },
  ];

  return (
    <div className="flex items-center justify-start gap-4 h-16 sticky top-18 z-0 bg-gray-200 text-black overflow-x-auto px-6 md:px-12 lg:px-24 scrollbar-hide">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={`/products${cat.value ? `?category=${encodeURIComponent(cat.value)}` : ''}`}
          className={linkStyle}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
};

export default ProductNav;
