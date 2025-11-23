import Image from "next/image"
import {getProductBySlug} from "@/lib/actions/product";
import {notFound} from "next/navigation";
import {Badge} from "@/components/ui/badge"
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import ProductImages from "@/components/shared/products/product-images";

async function ProductDetail({params}: {
    params: Promise<{slug: string}>
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) notFound();

    return (
        <section className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="col-span-2">
                    <ProductImages images={product.images}/>
                </div>
                <div className="col-span-2 p-5">
                    <div className="flex flex-col gap-6">
                        <p>
                            {product.brand} {product.category}
                        </p>
                        <h2 className="font-bold text-2xl">{product.name}</h2>
                        <p>{product.rating} of {product.numReviews} Reviews</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <Badge className="w-24 rounded-full bg-green-100 text-green-700 py-2 px-5 text-xl">
                                yen{product.price}
                            </Badge>
                        </div>
                    </div>
                    <div className="mt-10">
                        <p className="font-semibold">Description</p>
                        <p>{product.description}</p>
                    </div>
                </div>
                <div className="col-span-1">
                    <Card className="p-0">
                        <CardContent className="p-4">
                            <div className="mb-2 flex justify-between items-center">
                                <div>Price</div>
                                <div>
                                    <div className="py-2 px-5 text-xl">
                                        {product.price}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 flex justify-between items-center">
                                <div>Status</div>
                                <div>
                                    {
                                        product.stock > 0 ?
                                            (
                                                <Badge variant="outline" className="text-md">
                                                    In Stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="text-md">
                                                    Out Of Stock
                                                </Badge>
                                            )
                                    }

                                </div>
                            </div>
                            <div>
                                {
                                    product.stock > 0 && (
                                        <div className="flex justify-center">
                                            <Button className="w-full">Add To Cart</Button>
                                        </div>
                                    )
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

export default ProductDetail;