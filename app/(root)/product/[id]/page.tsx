import { notFound } from "next/navigation";
import { isValid, ULID } from "ulid";
import { getProductDetailById } from "@/actions/product.actions";
import { AddToCartCard } from "@/app/(root)/product/[id]/add-to-cart";
import ProductImages from "@/app/(root)/product/[id]/product-images";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatJapaneseYen } from "@/lib/utils/process-price";

async function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: ULID }>;
}) {
	const { id } = await params;
	if (!isValid(id)) notFound();

	const res = await getProductDetailById(id);
	if (!res.success) notFound();

	const product = res.data;

	return (
		<section className="mt-10">
			<div className="grid grid-cols-1 md:grid-cols-5">
				<div className="col-span-2">
					<ProductImages productImages={product.productImages} />
				</div>
				<div className="col-span-2 p-5 items-center">
					<div className="flex flex-col gap-6">
						<p>
							{product.brand?.name} {product.category?.name}
						</p>
						<h2 className="font-bold text-2xl">{product.name}</h2>
						<p>
							{product.rating} of {product.numReviews} Reviews
						</p>
						<div className="flex flex-col sm:flex-row sm:items-center gap-3">
							<Badge className="w-24 rounded-full bg-green-100 text-green-700 py-2 px-5 text-xl">
								{formatJapaneseYen(product.priceAfterTax)}
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
										{formatJapaneseYen(product.priceAfterTax)}
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
										productId={product.id}
										stock={product.stock}
										productName={product.name}
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

export default ProductDetailPage;
