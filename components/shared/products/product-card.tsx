import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image"
import {Product} from "@/types/product";

export const ProductCard = ({ product }: {product: Product}) => {
    return (
        <Card className="w-80 sm:w-60 xl:w-80 max-w-sm p-0 flex flex-col mx-auto">
            <CardHeader className="h-3/5 relative">
                <Link href={`/product/${product.slug}`} className="aspect-square ">
                    <Image src={product.images[0]} alt={product.name}  priority={true} fill className="rounded-t-xl"/>
                </Link>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4 flex-1">
                <div className="text-xs">{product.brand}</div>
                <Link href={`/product/${product.slug}`} className="flex-1">
                    <h2 className="text-md ">
                        {product.name}
                    </h2>
                </Link>
                <div className="flex justify-between">
                    <p>{product.rating} Stars</p>
                    {
                        product.stock > 0 ?
                            (
                                <p className="font-bold">
                                    <span className="align-super text-xs">¥</span>
                                    {product.price}
                                </p>
                            ):(
                                <p className="text-destructive">Out of stock</p>
                            )
                    }
                </div>
            </CardContent>
        </Card>
    );
};

