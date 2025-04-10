"use client";
import React, { useState, useEffect } from 'react';

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
    <div className='inset-0 fixed flex items-center justify-center bg-black bg-opacity-50'>
      <div
        className={`min-w-md bg-red-500 p-6 rounded-lg shadow-lg relative transform transition-transform duration-500 ${
          animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className='absolute top-2 right-2 text-white text-2xl'
          aria-label="Close Popup"
        >
          &times;
        </button>

        {/* Popup content */}
        {children}
      </div>
    </div>
  );
};

export default DiscountPopup;
