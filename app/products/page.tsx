

import React, {  } from 'react';
import { allProducts } from '../api/Allblog';
import Productlist from '@/components/Productlist';
const Page = async () => {




        
  
         const products  = await allProducts();
          
        
           

  

       
  
 
  return (
    <>
      {/* <Sidebar /> */}
      <Productlist products={products} />
      
      
    </>
  );
};

export default Page;
