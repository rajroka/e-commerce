"use client";
import Companies from "@/components/Companies";
import DiscountPopup from "@/components/DiscountPopup";

import ProductNav from "@/components/ProductNav";
import Top from "@/components/Top";
import { Provider } from "react-redux";
// import Modal from "@/components/Modal";
import Customerservice from "@/components/Customerservice";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

import Newslater from "@/components/Newslater";
import Attendance from "@/components/Attendance";
import Products from "@/components/product/Products";
import NextNProgress from 'nextjs-progressbar';


export default function Home() {
  return (
    <>
    {/* <Provider store={store}> */}
     <NextNProgress />
     {/* <Component {...pageProps} />; */}
      
      {/* <ProductNav /> */}
      <DiscountPopup>Special Offer!</DiscountPopup>
      {/* <Modal  /> */}
      <Hero />
       <Products/>
      <Newslater />
      <Customerservice />
      {/* <Companies /> */}
    
            <Footer />


      {/* </Provider> */}
    </>

  );
}
