'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Shirt01Icon, Dress01Icon, SandalsIcon, Watch01Icon,
  HatIcon, ShoppingBag01Icon, GridIcon, Store01Icon, Package01Icon,
} from '@hugeicons/core-free-icons';

const STROKE = 1.5;

const categories = [
  { label: 'Shirt',  icon: Shirt01Icon,       href: '/products?category=shirt'  },
  { label: 'Dress',  icon: Dress01Icon,        href: '/products?category=dress'  },
  { label: 'Shoes',  icon: SandalsIcon,        href: '/products?category=shoes'  },
  { label: 'Bags',   icon: ShoppingBag01Icon,  href: '/products?category=bag'    },
  { label: 'Watch',  icon: Watch01Icon,        href: '/products?category=watch'  },
  { label: 'Hat',    icon: HatIcon,            href: '/products?category=hat'    },
  { label: 'Brands', icon: Store01Icon,        href: '/products?category=brand'  },
  { label: 'New',    icon: Package01Icon,      href: '/products?category=new'    },
  { label: 'All',    icon: GridIcon,           href: '/products'                 },
];

export default function CategoryIcons() {
  return (
    <section className="w-full bg-white border-b border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide md:grid md:grid-cols-9 md:gap-4">
          {categories.map(({ label, icon, href }) => (
            <Link key={label} href={href}
              className="flex flex-col items-center gap-2 min-w-[68px] group flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-red-50 group-hover:ring-2 group-hover:ring-red-400 flex items-center justify-center transition-all duration-200 shadow-sm">
                <HugeiconsIcon icon={icon} size={24} color="currentColor" strokeWidth={STROKE}
                  className="text-gray-600 group-hover:text-red-500 transition-colors" />
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


