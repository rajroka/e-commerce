'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { FiSearch, FiX, FiSliders } from 'react-icons/fi';
import NextNProgress from 'nextjs-progressbar';
import Final from './Final';
import Pagination from './Pagination';
import { useRouter } from 'next/navigation';

type Product = {
  _id: string;
  title?: string;
  name?: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  quantity?: number;
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

type Filters = {
  searchQuery: string;
  priceRange: [number, number];
  category: string;
  sort: SortOption;
};

interface ProductListProps {
  products: Product[];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

const ProductList = ({ products, totalCount = 0, totalPages = 1, currentPage = 1 }: ProductListProps) => {
  const router = useRouter();
  const minPrice = useMemo(() => (products.length ? Math.min(...products.map(p => p.price)) : 0), [products]);
  const maxPrice = useMemo(() => (products.length ? Math.max(...products.map(p => p.price)) : 10000), [products]);

  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    priceRange: [minPrice, maxPrice],
    category: 'all',
    sort: 'default',
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      priceRange: [minPrice, maxPrice],
      category: 'all',
      sort: 'default',
    });
  }, [minPrice, maxPrice]);

  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product =>
        (filters.category === 'all' || product.category === filters.category) &&
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1] &&
        ((product.title ?? product.name ?? '').toLowerCase().includes(filters.searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        if (filters.sort === 'price-asc') return a.price - b.price;
        if (filters.sort === 'price-desc') return b.price - a.price;
        if (filters.sort === 'name') {
          const nameA = (a.title ?? a.name ?? '').toLowerCase();
          const nameB = (b.title ?? b.name ?? '').toLowerCase();
          return nameA.localeCompare(nameB);
        }
        return 0;
      });
  }, [products, filters]);

  const FilterPanel = () => (
    <div>
      <div className="flex justify-between items-baseline mb-8">
        <h2 className="text-sm font-black uppercase tracking-tighter text-gray-900">Filters</h2>
        <button
          onClick={clearAllFilters}
          className="text-[11px] uppercase font-bold text-gray-400 hover:text-black transition"
        >
          Reset
        </button>
      </div>

      {/* Category */}
      <div className="mb-8">
        <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-900 mb-4">Category</h3>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full border-b border-gray-300 bg-transparent text-gray-900 text-sm py-2 outline-none appearance-none cursor-pointer"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-[12px] uppercase tracking-widest font-bold text-gray-900 mb-4">Price Range</h3>
        <div className="flex justify-between text-[12px] font-bold text-gray-400 mb-4">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
        <div className="space-y-4">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={filters.priceRange[0]}
            onChange={e => handleFilterChange('priceRange', [Math.min(+e.target.value, filters.priceRange[1]), filters.priceRange[1]])}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={filters.priceRange[1]}
            onChange={e => handleFilterChange('priceRange', [filters.priceRange[0], Math.max(+e.target.value, filters.priceRange[0])])}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <NextNProgress color="#1f2937" options={{ showSpinner: false }} />
      <div className="bg-[#F9F4F5] min-h-screen px-4 sm:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">

          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block md:w-64 shrink-0 sticky top-24 h-fit">
            <FilterPanel />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Shop All</h1>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">{filteredProducts.length} Results</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-gray-700 hover:border-black transition-colors rounded"
                >
                  <FiSliders size={14} />
                  Filters
                </button>

                {/* Search Bar */}
                <div className="relative flex-1 sm:w-56 group">
                  <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black transition-colors" />
                  <input
                    type="text"
                    placeholder="SEARCH..."
                    value={filters.searchQuery}
                    onChange={e => handleFilterChange('searchQuery', e.target.value)}
                    className="w-full pl-6 pr-8 py-2 bg-transparent border-b border-gray-300 text-[12px] uppercase tracking-widest outline-none focus:border-black transition-all"
                  />
                  {filters.searchQuery && (
                    <button onClick={() => handleFilterChange('searchQuery', '')} className="absolute right-0 top-1/2 -translate-y-1/2">
                      <FiX className="text-gray-400 hover:text-black" />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <select
                  value={filters.sort}
                  onChange={e => handleFilterChange('sort', e.target.value as SortOption)}
                  className="bg-transparent border-b border-gray-300 text-[12px] font-bold uppercase tracking-widest py-2 outline-none cursor-pointer focus:border-black"
                >
                  <option value="default">SORT BY</option>
                  <option value="price-asc">Price: Low–High</option>
                  <option value="price-desc">Price: High–Low</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Product Display */}
            <div className="min-h-[400px]">
              {filteredProducts.length > 0 ? (
                <Final
                  sortedProducts={filteredProducts.map(p => ({
                    id: p._id,
                    title: p.title ?? p.name ?? '',
                    price: p.price,
                    image: p.image,
                    description: p.description ?? '',
                    quantity: p.quantity ?? 1,
                    category: p.category,
                  }))}
                />
              ) : (
                <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-xl">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-gray-900 mb-2">No items found</h3>
                  <p className="text-xs text-gray-500 mb-8 tracking-widest">TRY ADJUSTING YOUR SEARCH OR FILTERS</p>
                  <button
                    onClick={clearAllFilters}
                    className="px-8 py-3 bg-gray-800 hover:bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg rounded"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalCount > 12 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  router.push(`?page=${page}`);
                  window.scrollTo(0, 0);
                }}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl p-6 md:hidden max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-black uppercase tracking-tighter text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-gray-500 hover:text-black transition-colors"
                aria-label="Close filters"
              >
                <FiX size={20} />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-4 py-4 bg-gray-800 text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-black transition-all rounded"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ProductList;
