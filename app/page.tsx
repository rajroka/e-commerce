import Companies from "@/components/Companies";
import DiscountPopup from "@/components/DiscountPopup";
import Nav from "@/components/Nav";
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


export default function Home() {
  return (
    <>
    {/* <Provider store={store}> */}
    
      
      <ProductNav />
      <DiscountPopup>Special Offer!</DiscountPopup>
      <Modal  />
      <Hero />
      <Car />
      <Newslater />
      <Customerservice />
      {/* <Footer /> */}
      <Companies />
      {/* </Provider> */}
    </>

  );
}
