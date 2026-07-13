'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Cancel01Icon, FilterIcon } from '@hugeicons/core-free-icons';
import NextNProgress from 'nextjs-progressbar';
import Final from './Final';
import Pagination from './Pagination';
import { useRouter } from 'next/navigation';

const STROKE = 1.5;

type Product = { _id: string; title?: string; name?: string; price: number; category: string; image: string; description?: string; quantity?: number; discountPct?: number | null; discountEndsAt?: string | null; };
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';
type Filters = { searchQuery: string; priceRange: [number, number]; category: string; sort: SortOption; };

const ProductList = ({ products, totalCount = 0, totalPages = 1, currentPage = 1 }: { products: Product[]; totalCount?: number; totalPages?: number; currentPage?: number; }) => {
  const router = useRouter();
  const minPrice = useMemo(() => (products.length ? Math.min(...products.map(p => p.price)) : 0), [products]);
  const maxPrice = useMemo(() => (products.length ? Math.max(...products.map(p => p.price)) : 10000), [products]);

  const [filters, setFilters] = useState<Filters>({ searchQuery: '', priceRange: [minPrice, maxPrice], category: 'all', sort: 'default' });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFilterChange = useCallback((key: keyof Filters, value: any) => setFilters(prev => ({ ...prev, [key]: value })), []);
  const clearAllFilters = useCallback(() => setFilters({ searchQuery: '', priceRange: [minPrice, maxPrice], category: 'all', sort: 'default' }), [minPrice, maxPrice]);
  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  const filteredProducts = useMemo(() => products.filter(p =>
    (filters.category === 'all' || p.category === filters.category) &&
    p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1] &&
    (p.title ?? p.name ?? '').toLowerCase().includes(filters.searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (filters.sort === 'price-asc')  return a.price - b.price;
    if (filters.sort === 'price-desc') return b.price - a.price;
    if (filters.sort === 'name') return (a.title ?? a.name ?? '').localeCompare(b.title ?? b.name ?? '');
    return 0;
  }), [products, filters]);

  const FilterPanel = () => (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        <button onClick={clearAllFilters} className="text-xs font-medium text-gray-400 hover:text-gray-900 transition">Reset</button>
      </div>
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-600 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.category === cat}
                onChange={() => handleFilterChange('category', filters.category === cat ? 'all' : cat)}
                className="w-4 h-4 rounded border-gray-300 accent-red-500 cursor-pointer"
              />
              <span className={`text-sm capitalize transition-colors ${filters.category === cat ? 'text-red-500 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                {cat === 'all' ? 'All' : cat}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-600 mb-3">Price Range</h3>
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>${filters.priceRange[0]}</span><span>${filters.priceRange[1]}</span>
        </div>
        <div className="space-y-3">
          <input type="range" min={minPrice} max={maxPrice} value={filters.priceRange[0]}
            onChange={e => handleFilterChange('priceRange', [Math.min(+e.target.value, filters.priceRange[1]), filters.priceRange[1]])}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
          <input type="range" min={minPrice} max={maxPrice} value={filters.priceRange[1]}
            onChange={e => handleFilterChange('priceRange', [filters.priceRange[0], Math.max(+e.target.value, filters.priceRange[0])])}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <NextNProgress color="#ef4444" options={{ showSpinner: false }} />
      <div className="bg-gray-50 min-h-screen px-4 sm:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
          <aside className="hidden md:block md:w-64 shrink-0 sticky top-24 h-fit"><FilterPanel /></aside>
          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shop All</h1>
                <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} results</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button onClick={() => setMobileFiltersOpen(true)}
                  className="md:hidden flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors rounded-xl">
                  <HugeiconsIcon icon={FilterIcon} size={14} color="currentColor" strokeWidth={STROKE} /> Filters
                </button>
                <div className="relative flex-1 sm:w-56">
                  <HugeiconsIcon icon={Search01Icon} size={14} color="#9ca3af" strokeWidth={STROKE} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input type="text" placeholder="Search products…" value={filters.searchQuery}
                    onChange={e => handleFilterChange('searchQuery', e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-red-400 transition-all" />
                  {filters.searchQuery && (
                    <button onClick={() => handleFilterChange('searchQuery', '')} className="absolute right-2 top-1/2 -translate-y-1/2">
                      <HugeiconsIcon icon={Cancel01Icon} size={14} color="#9ca3af" strokeWidth={STROKE} />
                    </button>
                  )}
                </div>
                <select value={filters.sort} onChange={e => handleFilterChange('sort', e.target.value as SortOption)}
                  className="bg-white border border-gray-200 rounded-xl text-sm text-gray-700 py-2 px-3 outline-none cursor-pointer focus:border-red-400">
                  <option value="default">Sort by</option>
                  <option value="price-asc">Price: Low–High</option>
                  <option value="price-desc">Price: High–Low</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            <div className="min-h-[400px]">
              {filteredProducts.length > 0 ? (
                <Final sortedProducts={filteredProducts.map(p => ({ id: p._id, title: p.title ?? p.name ?? '', price: p.price, image: p.image, description: p.description ?? '', quantity: p.quantity ?? 1, category: p.category, discountPct: p.discountPct ?? null, discountEndsAt: p.discountEndsAt ?? null }))} />
              ) : (
                <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-2xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-sm text-gray-500 mb-8">Try adjusting your search or filters</p>
                  <button onClick={clearAllFilters} className="px-8 py-3 bg-gray-900 hover:bg-red-500 text-white text-sm font-semibold transition-all rounded-xl">Clear all filters</button>
                </div>
              )}
            </div>

            {totalCount > 12 && (
              <Pagination currentPage={currentPage} totalPages={totalPages}
                onPageChange={page => { router.push(`?page=${page}`); window.scrollTo(0, 0); }} />
            )}
          </main>
        </div>
      </div>

      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl p-6 md:hidden max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-gray-500 hover:text-black" aria-label="Close filters">
                <HugeiconsIcon icon={Cancel01Icon} size={20} color="currentColor" strokeWidth={STROKE} />
              </button>
            </div>
            <FilterPanel />
            <button onClick={() => setMobileFiltersOpen(false)} className="w-full mt-4 py-4 bg-gray-900 text-white text-sm font-semibold hover:bg-red-500 transition-all rounded-xl">
              Show {filteredProducts.length} results
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ProductList;
