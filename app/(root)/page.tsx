import sampleData from "@/db/sample-data";
import ProductsList from "@/components/shared/products/products-list";
import {getLatestProducts} from "@/lib/actions/product";

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