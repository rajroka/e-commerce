// app/products/[productId]/page.tsx




import React from 'react';

import ProductDetailsClient from '@/components/ProductDetailsClient';
import { fetchProductById } from '@/lib/fetchproducts';

const Page = async ({ params }: { params: { productId: string } }) => {

  const id = (await params).productId;
  const fetchedProduct = await fetchProductById(id);
console.log('Fetched Product:', fetchedProduct);
  // Map fetched product to expected shape
  const product = {
    id: fetchedProduct._id,
    title: fetchedProduct.name,
    price: fetchedProduct.price,
    description: fetchedProduct.description, // Provide a fallback since description is missing in fetchedProduct
    category: fetchedProduct.category,
    image: fetchedProduct.image,
    rating: { rate: 0, count: 0 }, // Provide a default rating since it's missing in fetchedProduct
  };
  
  

  
 
  


  return (
     <ProductDetailsClient  product={product} /> 
  );
};

export default Page;
