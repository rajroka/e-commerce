"use client";

import dynamic from "next/dynamic";
import DiscountPopup from "@/components/DiscountPopup";
import Footer from "@/components/Footer";
import Customerservice from "@/components/Customerservice";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedItems from "@/components/home/FeaturedItems";
import ProductRow from "@/components/home/ProductRow";
import PromoBanner from "@/components/home/PromoBanner";
import Newslater from "@/components/Newslater";

const NextNProgress = dynamic(() => import("nextjs-progressbar"), { ssr: false });

export default function Home() {
  return (
    <>
      <NextNProgress color="#ef4444" />
      <DiscountPopup>Special Offer!</DiscountPopup>

      {/* 1. Hero */}
      <HeroBanner />

      {/* 2. Featured 4-grid */}
      <FeaturedItems />

      {/* 3. Promo banner */}
      <PromoBanner />

      {/* 4. Best sellers row */}
      <ProductRow title="Best Sellers" subtitle="Top Picks" bg="white" />

      {/* 5. New arrivals row */}
      <ProductRow title="New Arrivals" subtitle="Just Dropped" category="running" bg="gray" />

      {/* 6. Trust badges */}
      <Customerservice />

      {/* 7. Newsletter */}
      <Newslater />

      {/* 8. Footer */}
      <Footer />
    </>
  );
}
