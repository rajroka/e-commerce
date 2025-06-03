'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categories = [
  { name: 'All', value: '' },
  { name: 'Electronics', value: 'electronics' },
  { name: 'Jewelery', value: 'jewelery' },
  { name: "Men's Clothing", value: "men's clothing" },
  { name: "Women's Clothing", value: "women's clothing" },
];

const CategoryNav = () => {
  const pathname = usePathname();
  const selected = decodeURIComponent(pathname.split('/categories/')[1] || '');

  return (
    <div className="flex items-center gap-3 overflow-x-auto bg-zinc-900 px-6 h-16 sticky top-0 z-20 border-b border-zinc-700">
      {categories.map((cat) => {
        const isSelected = selected === cat.value || (!selected && cat.value === '');
        return (
          <Link
            key={cat.value}
            href={cat.value ? `/categories/${encodeURIComponent(cat.value)}` : '/categories'}
            className={`text-sm font-medium px-4 py-2 rounded-md transition-all whitespace-nowrap
              ${isSelected ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'}`}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryNav;
