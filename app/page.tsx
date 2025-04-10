import Companies from "@/components/Companies";
import DiscountPopup from "@/components/DiscountPopup";
import Nav from "@/components/Nav";
import ProductNav from "@/components/ProductNav";
import Top from "@/components/Top";
import store from "@/redux/store";
import { Provider } from "react-redux";


export default function Home() {
  return (
    <>
    {/* <Provider store={store}> */}
    <Top/>
      <Nav/>
      <ProductNav />
      <DiscountPopup>Special Offer!</DiscountPopup>
      {/* <Companies /> */}
      {/* </Provider> */}
    </>

  );
}
