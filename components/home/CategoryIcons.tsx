'use client';

import Link from 'next/link';
import { GiLargeDress, GiRunningShoe, GiTrousers, GiHoodie, GiHandBag, GiTopHat } from 'react-icons/gi';
import { MdOutlineWatchLater, MdOutlineCategory } from 'react-icons/md';
import { TbShirt } from 'react-icons/tb';

const categories = [
  { label: 'Shirt',  icon: <TbShirt size={28} />,             href: '/products?category=shirt' },
  { label: 'Dress',  icon: <GiLargeDress size={28} />,        href: '/products?category=dress' },
  { label: 'Shoes',  icon: <GiRunningShoe size={28} />,       href: '/products?category=shoes' },
  { label: 'Pants',  icon: <GiTrousers size={28} />,          href: '/products?category=pants' },
  { label: 'Hoodie', icon: <GiHoodie size={28} />,            href: '/products?category=hoodie' },
  { label: 'Watch',  icon: <MdOutlineWatchLater size={28} />, href: '/products?category=watch' },
  { label: 'Hat',    icon: <GiTopHat size={28} />,            href: '/products?category=hat' },
  { label: 'Bag',    icon: <GiHandBag size={28} />,           href: '/products?category=bag' },
  { label: 'All',    icon: <MdOutlineCategory size={28} />,   href: '/products' },
];

export default function CategoryIcons() {
  return (
    <section className="w-full bg-white border-b border-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide md:grid md:grid-cols-9 md:gap-4">
          {categories.map(({ label, icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 min-w-[68px] group flex-shrink-0"
            >
              <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-red-50 group-hover:ring-2 group-hover:ring-red-400 flex items-center justify-center text-gray-600 group-hover:text-red-500 transition-all duration-200 shadow-sm">
                {icon}
              </div>
              <span className="text-xs font-medium text-gray-600 group-hover:text-red-500 transition-colors text-center leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
