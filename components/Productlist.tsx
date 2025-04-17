'use client';

import React, { useState, useMemo } from 'react';
import Final from './Final';

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

const ProductList = ({ products }: { products: Product[] }) => {
  const [sortType, setSortType] = useState('default');
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all categories
  const allCategories = useMemo(() => {
    const categories: string[] = [];
    products.forEach((product) => {
      if (!categories.includes(product.category)) {
        categories.push(product.category);
      }
    });
    return ['All', ...categories];
  }, [products]);

  // Filter by category and search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = category === 'All' || product.category === category;
      const matchSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, category, searchQuery]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortType === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortType === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortType === 'name') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [filteredProducts, sortType]);

  return (
    <div className="w-screen bg-yellow-50 dark:bg-zinc-900 min-h-screen px-6 md:px-12 lg:px-24 transition-colors duration-300">
      <div className="dark:bg-zinc-800 p-6 shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Products</h1>

        {/* Filters: Category, Sort, and Search */}
        <div className="sticky top-19 z-10 bg-white dark:bg-zinc-800 py-4 flex flex-wrap justify-between items-center gap-4 mb-4 shadow rounded-md">
          
          {/* Category Filter */}
          <select
            className="border rounded px-3 py-2 dark:bg-zinc-700 dark:text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            className="border rounded px-3 py-2 dark:bg-zinc-700 outline-none dark:text-white"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="default">Sort</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name A-Z</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 dark:bg-zinc-700 dark:text-white"
          />
        </div>

        {/* Product Grid */}
        <Final sortedProducts={sortedProducts} />
      </div>
    </div>
  );
};

export default ProductList;
