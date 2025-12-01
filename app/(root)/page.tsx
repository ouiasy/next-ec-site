import sampleData from "@/db/sample-data";
import ProductsList from "@/components/shared/products/products-list";
import {getLatestProducts} from "@/actions/product.actions";

export const metadata = {
    title: "Home",
}

const Home =  async () => {
    const products = await getLatestProducts();
    return (
        <>
            <ProductsList data={products} title={"test"} limit={4}/>
        </>
    );
};

export default Home;