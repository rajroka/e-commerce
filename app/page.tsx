import Companies from "@/components/Companies";
import DiscountPopup from "@/components/DiscountPopup";

import ProductNav from "@/components/ProductNav";
import Top from "@/components/Top";
import store from "@/redux/store";
import { Provider } from "react-redux";
import Modal from "@/components/Modal";
import Customerservice from "@/components/Customerservice";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import C from "@/components/Car";
import Car from "@/components/Car";
import Newslater from "@/components/Newslater";
import Attendance from "@/components/Attendance";

export default function Home() {
  return (
    <>
    {/* <Provider store={store}> */}
    
      
      <ProductNav />
      <DiscountPopup>Special Offer!</DiscountPopup>
      <Modal  />
      <Hero />
      
      <Newslater />
      <Customerservice />
      <Companies />
      <Attendance />
            <Footer />


      {/* </Provider> */}
    </>

  );
}
