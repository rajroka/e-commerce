'use client';

import React from 'react';
import { allProducts } from '../app/api/Allblog';
import ProductList from '@/components/Productlist';

// NOTE: This component is not used in the current routing setup.
// Products are served by app/(page)/products/page.tsx using the MongoDB API.
// Kept for reference only.

const FilteredPage = async () => {
  const products = await allProducts();

  return (
    <ProductList products={products || []} />
  );
};

export default FilteredPage;
