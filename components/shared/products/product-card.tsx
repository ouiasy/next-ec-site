import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {formatJapaneseYen} from "@/lib/utils/process-price";
import {GetLatestProductResponse} from "@/types/dto/response/product.type.response";

export const ProductCard = ({product}: { product: GetLatestProductResponse }) => {
    return (
        <Card className="w-80 sm:w-60 xl:w-70 max-w-sm p-0 flex flex-col mx-auto rounded-none">
            <CardHeader className="relative bg-primary">
                <Link href={`/product/${product.slug}`} className="">
                    {
                        product.imageUrls ?
                            <Image
                                src={product.imageUrls[0]}
                                alt={product.name}
                                priority={true}
                                height={200}
                                width={200}
                                className="object-cover mx-auto"
                            /> :
                            <Image
                                src="/images/no-image.png"
                                alt="No Image"
                                height={200}
                                width={200}
                            />
                    }
                </Link>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4 flex-1">
                <div className="text-xs">{product.brand}</div>
                <Link href={`/product/${product.slug}`} className="flex-1">
                    <h2 className="text-md ">{product.name}</h2>
                </Link>
                <div className="flex justify-between">
                    <p>{product.rating} Stars</p>
                    {product.stock > 0 ? (
                        <p className="font-bold">
                            {/*<span className="align-super text-xs">¥</span>
              {product.price}*/}
                            {formatJapaneseYen(product.priceInTax)}
                        </p>
                    ) : (
                        <p className="text-destructive">Out of stock</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
        ;
};
