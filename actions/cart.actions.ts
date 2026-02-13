"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Cart, cartDomain } from "@/domain/cart/cart.domain";
import { cartRepository, productRepository } from "@/infrastructure/repository";
import { auth } from "@/lib/auth/auth";
import { extractPathFromReferer } from "@/lib/utils";
import { cartService } from "@/service";
import { ActionResponse, err, ok } from "@/types/result";
import {CartDetailedResult} from "@/types/detailed-cart.type";

// todo: e2e test
export const changeCartItem = async (
	productId: string,
	quantity: number,
	type: "set" | "by" = "set",
): Promise<ActionResponse<Cart>> => {
	try {
		const headerList = await headers();

		const session = await auth.api.getSession({
			headers: headerList,
		});

		let cart: Cart | null = null;
		if (session === null) {
			const res = await auth.api.signInAnonymous({
				headers: headerList,
			});
			if (res === null) return err("匿名ユーザの作成に失敗しました。");
			const userId = res.user.id;
			cart = cartDomain.createEmpty(userId);
		} else {
			const userId = session.user.id;
			cart =
				(await cartRepository.getCartByUserID(userId)) ??
				cartDomain.createEmpty(userId);
		}

		// 在庫チェック忘れずに
		const product = await productRepository.getProductByID(productId);
		if (product === null) return err("商品が見つかりませんでした");

		switch (type) {
			case "by":
				if (cartDomain.getQty(cart, productId) + quantity > product.stock) {
					return err("在庫数を超えています");
				}
				cart = cartDomain.changeQuantityBy(cart, productId, quantity);
				break;
			case "set":
				if (product.stock < quantity) return err("在庫数を超えています");
				cart = cartDomain.setQuantity(cart, productId, quantity);
				break;
		}

		await cartRepository.upsert(cart);

		revalidatePath("/cart");
		return ok(cart);
	} catch (e) {
		if (isRedirectError(e)) throw e;
		console.log("カートアイテムの数量変更中にエラーが生じました: ", e);
		return err("カートアイテムの数量変更中にエラーが生じました");
	}
};

export const getCartItems = async (): Promise<
	ActionResponse<CartDetailedResult>
> => {
	try {
		const headerList = await headers();
		const referer = headerList.get("referer") ?? "";
		const path = extractPathFromReferer(referer);

		const session = await auth.api.getSession({
			headers: headerList,
		});
		if (session === null) {
			redirect("/signin?callback=" + path);
		}
		const userId = session.user.id;

		const cart = await cartService.getCartDetail(userId);

		if (cart === null) {
			return err("カートが見つかりませんでした");
		}

		return ok(cart);
	} catch (error) {
		if (isRedirectError(error)) throw error;
		console.error("カートの中身の取得中のエラー:", error);
		return err("カートの取得中にサーバー側でエラーが生じました");
	}
};
