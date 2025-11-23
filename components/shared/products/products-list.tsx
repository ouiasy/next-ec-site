import React from 'react';
import {ProductCard} from "@/components/shared/products/product-card";
import {Product} from "@/types/product";

const ProductsList = ({data, title, limit}: { data: Product[]; title?: string; limit?: number }) => {
    const limitedData = limit ? data.slice(0, limit): data;
    return (
        <div className="py-10">
            <h2 className="text-3xl pb-10 text-center">{title}</h2>
            {
                data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {
                            limitedData.map((product: Product) => (
                                <ProductCard product={product} key={product.name}/>
                            ))
                        }
                    </div>
                ) : (
                    <div>
                        <p>No products found</p>
                    </div>
                )
            }
        </div>
    );
};

export default ProductsList;