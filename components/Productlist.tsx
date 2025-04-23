'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Final from './Final';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating?: {
    rate: number;
    count: number;
  };
};

const ProductList = ({ products }: { products: Product[] }) => {
  const [sortType, setSortType] = useState<string>('default');
  const [category, setCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  // Get all categories and price range
  const { allCategories, minPrice, maxPrice } = useMemo(() => {
    const categories = new Set<string>();
    let min = Infinity;
    let max = -Infinity;

    products.forEach((product) => {
      categories.add(product.category);
      min = Math.min(min, product.price);
      max = Math.max(max, product.price);
    });

    return {
      allCategories: ['All', ...Array.from(categories)],
      minPrice: Math.floor(min),
      maxPrice: Math.ceil(max),
    };
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = selectedRatings.length === 0 || 
        (product.rating && selectedRatings.includes(Math.floor(product.rating.rate)));

      return matchesCategory && matchesSearch && matchesPrice && matchesRating;
    });
  }, [products, category, searchQuery, priceRange, selectedRatings]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortType) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return sorted.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      default:
        return sorted;
    }
  }, [filteredProducts, sortType]);

  // Reset price range when category changes
  useEffect(() => {
    if (category === 'All') {
      setPriceRange([minPrice, maxPrice]);
    } else {
      const categoryProducts = products.filter(p => p.category === category);
      const min = Math.min(...categoryProducts.map(p => p.price));
      const max = Math.max(...categoryProducts.map(p => p.price));
      setPriceRange([min, max]);
    }
  }, [category, products, minPrice, maxPrice]);

  const toggleRatingFilter = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const clearAllFilters = () => {
    setCategory('All');
    setSearchQuery('');
    setSortType('default');
    setPriceRange([minPrice, maxPrice]);
    setSelectedRatings([]);
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - hidden on mobile unless toggled */}
          <div className={`md:w-64 ${mobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Categories</h3>
                <div className="space-y-2">
                  {allCategories.map((cat) => (
                    <div key={cat} className="flex items-center">
                      <input
                        id={`category-${cat}`}
                        name="category"
                        type="radio"
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                        className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-zinc-700"
                      />
                      <label
                        htmlFor={`category-${cat}`}
                        className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price range filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                  Price range (${priceRange[0]} - ${priceRange[1]})
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">${minPrice}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full mb-2"
                  title='min-price'
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                  title='range'
                />
              </div>

              {/* Rating filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        id={`rating-${rating}`}
                        name="rating"
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => toggleRatingFilter(rating)}
                        className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-zinc-700"
                      />
                      <label
                        htmlFor={`rating-${rating}`}
                        className="ml-3 text-sm text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        {Array(rating).fill(0).map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                        {rating < 5 && Array(5 - rating).fill(0).map((_, i) => (
                          <span key={i} className="text-gray-300 dark:text-gray-500">★</span>
                        ))}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
              {/* Header with search and mobile filter toggle */}
              <div className="border-b border-gray-200 dark:border-zinc-700 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                  
                  <div className="flex items-center w-full sm:w-auto gap-3">
                    {/* Mobile filter toggle */}
                    <button
                      type="button"
                      className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600"
                      onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                      <FiFilter className="h-4 w-4" />
                      Filters
                      {mobileFiltersOpen ? (
                        <FiChevronUp className="h-4 w-4" />
                      ) : (
                        <FiChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {/* Search input */}
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-zinc-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 dark:text-white sm:text-sm"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          title="Clear search"
                        >
                          <FiX className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Toolbar with sort and results count */}
              <div className="bg-gray-50 dark:bg-zinc-700 px-4 py-3 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 dark:border-zinc-600">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">
                  Showing <span className="font-medium">{sortedProducts.length}</span> products
                </p>
                <div className="flex items-center">
                  <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-zinc-600 dark:text-white dark:border-zinc-600"
                  >
                    <option value="default">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Product grid */}
              <div className="p-4">
                {sortedProducts.length > 0 ? (
                  <Final sortedProducts={sortedProducts} />
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;