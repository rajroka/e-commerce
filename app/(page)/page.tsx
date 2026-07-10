"use client";

import dynamic from "next/dynamic";
import DiscountPopup from "@/components/DiscountPopup";
import Footer from "@/components/Footer";
import Customerservice from "@/components/Customerservice";

// Homepage sections
import HeroBanner from "@/components/home/HeroBanner";
import CategoryIcons from "@/components/home/CategoryIcons";
import FlashSale from "@/components/home/FlashSale";
import TodaysForYou from "@/components/home/TodaysForYou";
import QuoteBanner from "@/components/home/QuoteBanner";
import Newslater from "@/components/Newslater";

// Loaded client-only to avoid SSR style injection mismatch
const NextNProgress = dynamic(() => import("nextjs-progressbar"), { ssr: false });

export default function Home() {
  return (
    <>
      <NextNProgress color="#ef4444" />
      <DiscountPopup>Special Offer!</DiscountPopup>

      {/* 1. Hero with countdown + slides */}
      <HeroBanner />

      {/* 2. Category icon row */}
      <CategoryIcons />

      {/* 3. Flash sale strip */}
      <FlashSale />

      {/* 4. Tabbed "Todays For You" product grid */}
      <TodaysForYou />

      {/* 6. Quote / CTA banner */}
      <QuoteBanner />

      {/* 7. Trust badges */}
      <Customerservice />

      {/* 8. Newsletter */}
      <Newslater />

      {/* 9. Footer */}
      <Footer />
    </>
  );
}
