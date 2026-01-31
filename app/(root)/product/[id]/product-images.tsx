"use client";
import Image from "next/image";
import { useState } from "react";
import { ProductImage } from "@/domain/product/product.domain";
import { cn } from "@/lib/utils/cn";

type ProductImagesProps = {
	productImages: ProductImage[];
};

const ProductImages = ({ productImages }: ProductImagesProps) => {
	const [current, setCurrent] = useState(0);
	return (
		<div className="space-y-4">
			<Image
				src={productImages[current].url}
				alt={productImages[current].imageName}
				width={1000}
				height={1000}
				className="min-h-[300px] object-cover object-center rounded-2xl"
			/>
			<div className="flex">
				{productImages.map(({ url, imageName }, index) => (
					<div
						key={index}
						onClick={() => {
							setCurrent(index);
						}}
						className={cn(
							"border-2 rounded-2xl mr-2 cursor-pointer hover:border-orange-600 ",
							current === index && "border-orange-500",
						)}
					>
						<Image
							src={url}
							alt={imageName}
							width={100}
							height={100}
							className="rounded-2xl"
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductImages;
