'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import NextNProgress from 'nextjs-progressbar';
import Final from './Final';

type Product = {
  _id: string;
  title?: string;
  name?: string;
  price: number;
  category: string;
  image: string;
  description?: string;
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

type Filters = {
  searchQuery: string;
  priceRange: [number, number];
  category: string;
  sort: SortOption;
};

const ProductList = ({ products }: { products: Product[] }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Calculate min and max price from products
  const minPrice = useMemo(() => (products.length ? Math.min(...products.map(p => p.price)) : 0), [products]);
  const maxPrice = useMemo(() => (products.length ? Math.max(...products.map(p => p.price)) : 10000), [products]);

  // Initialize filters state based on min/max price
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    priceRange: [minPrice, maxPrice],
    category: 'all',
    sort: 'default',
  });

  // Update filters state helper wrapped with useCallback for memoization
  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Clear all filters, reset priceRange to current min/max
  const clearAllFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      priceRange: [minPrice, maxPrice],
      category: 'all',
      sort: 'default',
    });
  }, [minPrice, maxPrice]);

  // Categories derived once from products list
  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  // Filter and sort products based on current filters
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

  // Ensure minPrice slider doesn't go beyond maxPrice
  const handleMinPriceChange = (value: number) => {
    const newMin = Math.min(value, filters.priceRange[1]);
    handleFilterChange('priceRange', [newMin, filters.priceRange[1]]);
  };

  // Ensure maxPrice slider doesn't go below minPrice
  const handleMaxPriceChange = (value: number) => {
    const newMax = Math.max(value, filters.priceRange[0]);
    handleFilterChange('priceRange', [filters.priceRange[0], newMax]);
  };

  // UI renderers:

  const renderCategoryFilter = () => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">Category</h3>
      <select
        value={filters.category}
        onChange={(e) => handleFilterChange('category', e.target.value)}
        className="w-full border border-gray-300 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        aria-label="Filter by category"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );

  const renderSortSelect = () => (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
      <select
        id="sort"
        value={filters.sort}
        onChange={e => handleFilterChange('sort', e.target.value as SortOption)}
        className="border border-gray-300 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm py-2 px-3 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
        aria-label="Sort products"
      >
        <option value="default">Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name</option>
      </select>
    </div>
  );

  const renderPriceFilter = () => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">Price range</h3>
      <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
        <span>${filters.priceRange[0]}</span>
        <span>${filters.priceRange[1]}</span>
      </div>
      <div className="space-y-4">
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={filters.priceRange[0]}
          onChange={e => handleMinPriceChange(parseInt(e.target.value))}
          className="w-full accent-gray-600"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={filters.priceRange[1]}
          onChange={e => handleMaxPriceChange(parseInt(e.target.value))}
          className="w-full accent-gray-600"
          aria-label="Maximum price"
        />
      </div>
      {/* <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Adjust the sliders to set your desired price range.
      </p> */}
    </div>
  );

  const renderMobileFilterButton = () => (
    <button
      onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
      className="md:hidden px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center transition"
      aria-expanded={mobileFiltersOpen}
      aria-controls="mobile-filters"
    >
      <FiFilter className="mr-2" />
      Filters
      {mobileFiltersOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
    </button>
  );

  const renderSearchInput = () => (
    <div className="relative w-full sm:w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search products..."
        value={filters.searchQuery}
        onChange={e => handleFilterChange('searchQuery', e.target.value)}
        className="pl-10 pr-9 py-2 w-full border border-gray-300 rounded-md bg-white dark:bg-zinc-800 placeholder-gray-400 dark:placeholder-gray-500 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        aria-label="Search products"
      />
      {filters.searchQuery && (
        <button
          onClick={() => handleFilterChange('searchQuery', '')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          aria-label="Clear search"
        >
          <FiX />
        </button>
      )}
    </div>
  );

  return (
    <>
      <NextNProgress color="#3b82f6" options={{ showSpinner: false }} />
      <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen px-5 sm:px-8 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          <aside
            id="mobile-filters"
            className={`md:w-72 bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 sticky top-5 z-10
              ${mobileFiltersOpen ? 'block' : 'hidden'} md:block
              transition-all duration-300 ease-in-out
            `}
            aria-label="Filters"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-sm text-black  dark:text-white  hover:underline focus:outline-none"
                aria-label="Clear all filters"
              >
                Clear all
              </button>
            </div>
            {renderCategoryFilter()}
            {renderPriceFilter()}
          </aside>

          <main className="flex-1">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 dark:border-zinc-700 p-5 flex flex-col sm:flex-row justify-between gap-4 items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {renderMobileFilterButton()}
                  {renderSearchInput()}
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-zinc-700 px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-700 dark:text-gray-300">
                <p className="text-sm">
                  Showing <span className="font-semibold">{filteredProducts.length}</span> products
                </p>
                {renderSortSelect()}
              </div>

              <div className="p-2 gap-1  ">
                {filteredProducts.length > 0 ? (
                  <Final 
                    sortedProducts={filteredProducts.map(p => ({
                      id: p._id,
                      title: p.title ?? p.name ?? '',
                      price: p.price,
                      image: p.image,
                      description: p.description ?? '',
                    }))}
                  />
                ) : (
                  <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      No products found
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      Try adjusting your filters or search terms.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="px-5 py-3 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-500 transition"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ProductList;
