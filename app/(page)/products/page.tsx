// import { fetchproducts } from '@/lib/fetchproducts';
import { fetchProducts } from "@/lib/fetchproducts";
import ProductList  from "@/components/Productlist"

const Page = async () => {
  const products = await fetchProducts();

  return <ProductList products={products} />;
};

export default Page;
