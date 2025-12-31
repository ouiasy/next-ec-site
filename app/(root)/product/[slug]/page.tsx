import { getProductBySlug } from "@/actions/product.actions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductImages from "@/app/(root)/product/[slug]/product-images";
import { formatJapaneseYen } from "@/lib/utils/process-price";
import { AddToCartCard } from "@/app/(root)/product/[slug]/add-to-cart";

async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (product === null) notFound();

  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="col-span-2">
          <ProductImages images={product.images} />
        </div>
        <div className="col-span-2 p-5 items-center">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.category}
            </p>
            <h2 className="font-bold text-2xl">{product.name}</h2>
            <p>
              {product.rating} of {product.numReviews} Reviews
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Badge className="w-24 rounded-full bg-green-100 text-green-700 py-2 px-5 text-xl">
                {formatJapaneseYen(product.price)}
              </Badge>
            </div>
          </div>
          <div className="mt-10 w-full">
            <p className="font-semibold">Description</p>
            <p className="wrap-break-word">
              {JSON.stringify(product.description)}
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <Card className="p-0">
            <CardContent className="p-4">
              <div className="mb-2 flex justify-between items-center">
                <div className="flex-1">Price</div>
                <div className="flex-1 pr-3 text-right">
                  <div className="py-2 text-xl  px-2">
                    {formatJapaneseYen(product.price)}
                  </div>
                </div>
              </div>
              <div className="mb-2 flex justify-between items-center">
                <div className="flex-1">Status</div>
                <div className="flex-1 pr-3 text-right">
                  {product.stock! > 0 ? (
                    <Badge variant="outline" className="text-md">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-md">
                      Out Of Stock
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                {product.stock! > 0 && (
                  <AddToCartCard
                    item={{
                      productId: product.id,
                      name: product.name,
                      slug: product.slug,
                      image: product.images![0],
                      price: product.price,
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
