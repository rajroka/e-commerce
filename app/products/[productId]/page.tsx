import React from 'react';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { fetchProductById } from '@/lib/fetchproducts';


interface PageProps {
  params: {
    productId: string;
  };
}


const Page = async ({ params} : PageProps  ) => {
  
  const productId = params.productId;

  const fetchedProduct = await fetchProductById(productId);

  const product = {
    id: fetchedProduct._id,
    title: fetchedProduct.name,
    price: fetchedProduct.price,
    description: fetchedProduct.description || 'No description available',
    category: fetchedProduct.category,
    image: fetchedProduct.image,
    rating: { rate: 0, count: 0 },
  };

  return <ProductDetailsClient product={product} />;
};

export default Page;
