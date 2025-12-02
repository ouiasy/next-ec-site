import ProductsList from "@/components/shared/products/products-list";
import {getLatestProducts} from "@/actions/product.actions";

export const metadata = {
    title: "Home",
}

const Home =  async () => {
    const products = await getLatestProducts();
    return (
        <>
          {
            products ?
                <ProductsList data={products} title={"test"} limit={4}/> : (
                <div className="flex flex-col justify-center h-full text-center">
                  <p className="text-4xl">Products Not Found</p>
                </div>
            )
          }

        </>
    );
};

export default Home;