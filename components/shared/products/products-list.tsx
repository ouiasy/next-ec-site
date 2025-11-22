import React from 'react';
import {ProductCard} from "@/components/shared/products/product-card";

const ProductsList = ({data, title, limit}: { data: any; title?: string; limit?: number }) => {
    const limitedData = limit ? data.slice(0, limit): data;
    return (
        <div className="py-10">
            {
                data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {
                            limitedData.map((product: any) => (
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