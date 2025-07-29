import React from 'react';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { fetchProductById } from '@/lib/fetchproducts';
import RelatedProducts from '@/components/RelatedProducts';

type Params= Promise<{productId: string}>

const Page = async (props: {params: Params}) => {
  
  const params = await props.params;
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
  // console.log(product.category)
  return (<> <ProductDetailsClient product={product} />
   <RelatedProducts category={product.category} />
  </>
  )
};

export default Page;
