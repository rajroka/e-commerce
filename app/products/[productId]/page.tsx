// app/products/[productId]/page.tsx




import React from 'react';
import { productById } from '@/app/api/Allblog';

import ProductDetailsClient from '@/components/ProductDetailsClient';

const Page = async ({ params }: { params: { productId: string } }) => {

  const id = (await params).productId;
  const product = await productById(id);
  
  

  
 
  


  return (
     <ProductDetailsClient  product={product} /> 
  );
};

export default Page;
