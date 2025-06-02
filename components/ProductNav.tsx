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
    <div className="flex items-center gap-4 overflow-x-auto bg-gray-200 px-6 h-16 sticky top-0 z-10">
      {categories.map((cat) => (
        <Link
          key={cat.value}
          href={cat.value ? `/categories/${encodeURIComponent(cat.value)}` : '/categories'}
          className={`px-4 py-2 rounded-md whitespace-nowrap transition ${
            selected === cat.value || (!selected && cat.value === '')
              ? 'bg-gray-600 text-white'
              : 'hover:bg-gray-300'
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoryNav;
