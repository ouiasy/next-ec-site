"use server";

import { productService } from "@/service";
import { ProductDetailResult } from "@/service/product/product.service";
import { ActionResponse, err, ok } from "@/types/result";

export const getLatestProducts = async (): Promise<
	ActionResponse<ProductDetailResult[]>
> => {
	try {
		const products = await productService.getLatestProducts();
		return ok(products);
	} catch (e) {
		console.log("最新商品の取得中にエラーが生じました: ", e);
		return err("最新商品の取得に失敗しました");
	}
};

export const getProductDetailById = async (
	productId: string,
): Promise<ActionResponse<ProductDetailResult>> => {
	try {
		const product = await productService.getProductDetail(productId);
		return ok(product);
	} catch (e) {
		console.log("商品情報の取得に失敗: ", e);
		return err(`商品ID:${productId}が見つかりませんでした`);
	}
};
