"use client";
import React, { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import Image from 'next/image';
import discountImage from '../public/discount.png'; // Adjust the path as necessary
const DiscountPopup = ({ children }: { children: string }) => {
  const [open, setOpen] = useState(true);
  const [animate, setAnimate] = useState(false);
   
  useEffect(() => {
    if (open) {
      // Trigger the animation when the popup opens
      setAnimate(true);
    }
  }, [open]);

  // Don't render if open is not true
  if (!open) return null;

  return (
    <div className='inset-0 top-0  z-50 flex w-screen h-screen items-center justify-center fixed  px-6 md:px-12 lg:px-24   bg-black/60  '>
             
       
          <div className=' relative ' > 
          <RxCross2 onClick={() => setOpen(false)} className='text-2xl cursor-pointer     bg-white  text-black  ' size={24}  />
            <Image src={discountImage} alt="Discount Image" loading='lazy' width={400} height={100} className='' />
            
          </div>
          <div> </div>
        
        

       </div>
     
    
  );
};

export default DiscountPopup;
