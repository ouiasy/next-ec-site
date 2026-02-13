
import { productImageTable, productTable } from "@/db/schema/product.schema";
import { Product, ProductImage } from "@/domain/product/product.domain";

export type RawProductSelect = typeof productTable.$inferSelect;
export type RawProductInsert = typeof productTable.$inferInsert;

export type RawProductImageSelect = typeof productImageTable.$inferSelect;
export type RawProductImageInsert = typeof productImageTable.$inferInsert;

export type ProductCompositeSelect = RawProductSelect & {
    images: RawProductImageSelect[]
}

export type ProductCompositeInsert = RawProductInsert & {
    images: RawProductImageInsert[],
}

export const fromRawProductComposite = (rawProduct: ProductCompositeSelect): Product => {

    const priceAfterTax = rawProduct.priceBeforeTax * (rawProduct.taxRate + 100) / 100;
    const images: ProductImage[] = rawProduct.images.map((image): ProductImage => {
        return {
            id: image.id,
            url: image.url,
            imageName: image.imageName,
            displayOrd: image.displayOrd,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt
        }
    })
    return {
        id: rawProduct.id,
        name: rawProduct.name,
        description: rawProduct.description,
        categoryId: rawProduct.categoryId,
        brandId: rawProduct.brandId,
        priceBeforeTax: rawProduct.priceBeforeTax,
        taxRate: rawProduct.taxRate,
        priceAfterTax: priceAfterTax,
        numReviews: rawProduct.numReviews,
        rating: rawProduct.rating,
        stock: rawProduct.stock,
        productImages: images,
        isFeatured: rawProduct.isFeatured,
        createdAt: rawProduct.createdAt,
        updatedAt: rawProduct.updatedAt,
    }
}

export const toRawProductComposite = (product: Product): {
    rawProduct: RawProductInsert, rawProductImages: RawProductImageInsert[]
} => {
    const rawProduct: RawProductInsert = {
        id: product.id,
        name: product.name,
        description: product.description,

        priceBeforeTax: product.priceBeforeTax,
        taxRate: product.taxRate,
        stock: product.stock,

        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    }

    const rawProductImages: RawProductImageInsert[] = product.productImages.map((image): RawProductImageInsert => {
        return {
            id: image.id,
            url: image.url,
            productId: product.id,
            imageName: image.imageName,
            displayOrd: image.displayOrd,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt
        }
    })

    return { rawProduct, rawProductImages }
}

export const fromRawProductImage = (rawProductImage: RawProductImageSelect): ProductImage => {
    return {
        ...rawProductImage
    }
}

export const fromRawProduct = (
    rawProduct: RawProductSelect,
    productImages: ProductImage[]
): Product => {
    const priceAfterTax = Math.floor(rawProduct.priceBeforeTax * (rawProduct.taxRate + 100) / 100);
    return {
        ...rawProduct,
        productImages: productImages,
        priceAfterTax: priceAfterTax,
    }
}