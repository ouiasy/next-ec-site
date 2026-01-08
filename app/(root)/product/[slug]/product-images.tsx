"use client";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ imageUrls, imageNames }: { imageUrls: string[], imageNames: string[] }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={imageUrls[current]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center rounded-2xl"
      />
      <div className="flex">
        {imageUrls.map((image, index) => (
          <div
            key={image}
            onClick={() => {
              setCurrent(index);
            }}
            className={cn(
              "border-2 rounded-2xl mr-2 cursor-pointer hover:border-orange-600 ",
              current === index && "border-orange-500",
            )}
          >
            <Image
              src={image}
              alt={imageNames[index]}
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
