import { getProductsByCategory } from "@/lib/fetchproducts";
import Relatedcatcard from "./Relatedcatcard";


async function RelatedProducts({ category } : {category : string}) {
  // console.log(category)
    const products = await getProductsByCategory(category)
  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row items-center justify-between px-5">
        <h1 className="text-center md:text-left text-3xl md:text-4xl  text-textColor px-2 dark:text-white">
          Related Products
        </h1>
      </div>
      <Relatedcatcard  products={products} />
    </div>
  );
}

export default RelatedProducts;