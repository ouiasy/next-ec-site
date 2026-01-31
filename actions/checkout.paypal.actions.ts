"use server";

import { Result } from "neverthrow";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { createCartRepository } from "@/infrastructure/repository/cart/cart.repository";
import { createProductRepository } from "@/infrastructure/repository/product/product.repository";
import { auth } from "@/lib/auth/auth";
import { createCartService } from "@/service/cart/cart.service";
import { err, ok } from "@/types/result";

export const createPaypalOrder = async () => {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (session === null) {
			return;
		}
		const userId = session.user.id;

		await db.transaction(async (tx) => {
			const txProductRepository = createProductRepository(tx);
			const txCartRepository = createCartRepository(tx);
			const txCartService = createCartService(
				txCartRepository,
				txProductRepository,
			);

			const detailedCart = await txCartService.getCartDetail(userId);
			if (detailedCart === null || detailedCart?.items.length === 0) {
				throw new Error("カート内に商品が見つかりませんでした");
			}

			const productIDs = detailedCart.items.map((item) => item.productId);
			const products = await txProductRepository.getByIDs(productIDs, {
				forUpdate: true,
			});

			const productMap = new Map(products.map((p) => [p.id, p]));

			const qtyExceedErr = detailedCart.items.some(
				(item) => item.quantity > productMap.get(item.productId).stock,
			);

			if (qtyExceedErr) {
				revalidatePath("/checkout");
				return err(`商品の注文数量が在庫数を超えています`);
			}
			// 続きあり
			// todo: 260127 カスタムエラーを作って対象のエラータイプのみそのままcatch時にerr()をreturnする。
		});
		redirect("/order/");
	} catch (e) {
		if (isRedirectError(e)) throw e;
		return err(e);
	}
};
