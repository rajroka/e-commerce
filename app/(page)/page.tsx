"use client";

import dynamic from "next/dynamic";
import DiscountPopup from "@/components/DiscountPopup";
import Customerservice from "@/components/Customerservice";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Newslater from "@/components/Newslater";
import Products from "@/components/product/Products";

// Loaded client-only to avoid SSR style injection mismatch
const NextNProgress = dynamic(() => import("nextjs-progressbar"), { ssr: false });

export default function Home() {
  return (
    <>
      <NextNProgress />
      <DiscountPopup>Special Offer!</DiscountPopup>
      <Hero />
      <Products />
      <Newslater />
      <Customerservice />
      <Footer />
    </>
  );
}
