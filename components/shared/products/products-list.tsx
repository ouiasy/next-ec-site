import React from "react";
import { ProductCard } from "@/components/shared/products/product-card";
import { ProductDetailResult } from "@/service/product/product.service";

const ProductsList = ({
	products,
	title,
}: {
	products: ProductDetailResult[];
	title: string;
}) => {
	return (
		<div className="py-10">
			<h2 className="text-3xl pb-10 text-center">{title}</h2>
			{products.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
					{products.map((product: ProductDetailResult) => (
						<ProductCard product={product} key={product.id} />
					))}
				</div>
			) : (
				<div>
					<p>No products found</p>
				</div>
			)}
		</div>
	);
};

export default ProductsList;
