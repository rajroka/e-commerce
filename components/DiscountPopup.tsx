'use client';

import React, { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import Image from 'next/image';
import hurry from '../public/hurry.png'; // Adjust if needed

const DiscountPopup = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasShownPopup = localStorage.getItem('discountPopupShown');

    if (!hasShownPopup) {
      // Show popup and mark as shown
      setOpen(true);
      localStorage.setItem('discountPopupShown', 'true');
    }
  }, []);

  const closePopup = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 md:px-12 lg:px-24">
      <div className="relative bg-white rounded-xl shadow-lg p-4 max-w-lg w-full">
        {/* Close button */}
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-700 hover:text-black transition"
        >
          <RxCross2 className="text-2xl" />
        </button>

        {/* Discount Image */}
        <div className="flex justify-center items-center">
          <Image
            src={hurry}
            alt="Discount Banner"
            width={400}
            height={200}
            className="rounded-xl"
          />
        </div>

        {/* Optional Custom Content */}
        {children && (
          <div className="mt-4 text-center text-sm text-gray-700">{children}</div>
        )}
      </div>
    </div>
  );
};

export default DiscountPopup;
