import sampleData from "@/db/sample-data";
import ProductsList from "@/components/shared/products/products-list";

export const metadata = {
    title: "Home",
}

const Home =  () => {
    console.log(sampleData);
    return (
        <>
            <ProductsList data={sampleData.products} title={"test"} limit={4}/>
        </>
    );
};

export default Home;