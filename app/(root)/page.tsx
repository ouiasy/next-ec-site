
import ProductsList from "@/components/shared/products/products-list";
import { productRepository } from "@/infrastructure/repository";

export const metadata = {
	title: "Home",
};

const Home = async () => {
	const latestProducts = await productRepository.getLatestProducts();
	
	if (res.success) {
		console.log(res.data);
	} else {
		console.log(res.error);
	}
	return (
		<>
			{res.success ? (
				<ProductsList products={res.data} title={"test"} />
			) : (
				<div className="flex flex-col justify-center h-full text-center">
					<p className="text-4xl">Products Not Found</p>
				</div>
			)}
		</>
	);
};

export default Home;
