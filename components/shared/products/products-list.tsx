import React from "react";
import { ProductCard } from "@/components/shared/products/product-card";
import { GetLatestProductsResponse } from "@/types/dto/response/product.actions.response";

const ProductsList = ({ products, title }: { products: GetLatestProductsResponse[], title: string }) => {
  return (
    <div className="py-10">
      <h2 className="text-3xl pb-10 text-center">{title}</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product: GetLatestProductsResponse) => (
            <ProductCard product={product} key={product.name} />
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
