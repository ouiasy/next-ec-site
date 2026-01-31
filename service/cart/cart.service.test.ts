import { ulid } from "ulid";
import { describe, expect, test, vi } from "vitest";
import { Cart, cartDomain } from "@/domain/cart/cart.domain";
import { CartRepository } from "@/domain/cart/cart.domain.repository";
import { Product, productDomain } from "@/domain/product/product.domain";
import { ProductRepository } from "@/domain/product/product.domain.repository";
import { createCartRepository } from "@/infrastructure/repository/cart/cart.repository";
import { createCartService } from "@/service/cart/cart.service";

const createMockCartRepo = (cart: Cart | null): CartRepository => ({
	getCartByUserID: vi.fn().mockResolvedValue(cart),
	upsert: vi.fn().mockResolvedValue(undefined),
});

const createMockProductRepo = (products: Product[]): ProductRepository => ({
	getProductByID: vi.fn(),
	getByIDs: vi.fn().mockResolvedValue(products),
	save: vi.fn().mockResolvedValue(undefined),
});

const product1 = productDomain.create({
	brandId: ulid(),
	categoryId: ulid(),
	description: "mock description1",
	isFeatured: false,
	name: "mock name1",
	priceBeforeTax: 1_000,
	productImages: [],
	rating: 3,
	stock: 10,
	taxRate: 10,
});

const product2 = productDomain.create({
	brandId: ulid(),
	categoryId: ulid(),
	description: "mock description2",
	isFeatured: false,
	name: "mock name2",
	priceBeforeTax: 2_000,
	productImages: [],
	rating: 2,
	stock: 3,
	taxRate: 10,
});

const productOutofstock = productDomain.create({
	brandId: ulid(),
	categoryId: ulid(),
	description: "mock description2",
	isFeatured: false,
	name: "mock name2",
	priceBeforeTax: 2_000,
	productImages: [],
	rating: 2,
	stock: 0,
	taxRate: 10,
});

describe("cart service", () => {
	const userId = ulid();
	test("在庫が十分な場合、希望数量で小計・合計が計算される", async () => {
		let cart = cartDomain.createEmpty(userId);
		cart = cartDomain.changeQuantityBy(cart, product1.id, 3);
		cart = cartDomain.changeQuantityBy(cart, product2.id, 3);

		const cartRepoStub = createMockCartRepo(cart);
		const productRepoStub = createMockProductRepo([product1, product2]);

		const cartService = createCartService(cartRepoStub, productRepoStub);

		const cartDetail = await cartService.getCartDetail(userId);

		expect(cartDetail).toBeDefined();
		expect(cartDetail?.items).toHaveLength(2);
		expect(cartDetail?.subTotal).toBe(9_000);
		expect(cartDetail?.grandTotal).toBe(9_900);
	});

	test("cartに入っている商品が在庫数より多い場合、その分を削る", async () => {
		let cart = cartDomain.createEmpty(userId);
		cart = cartDomain.changeQuantityBy(cart, product1.id, 3);
		cart = cartDomain.changeQuantityBy(cart, product2.id, 4);

		const cartRepoStub = createMockCartRepo(cart);
		const productRepoStub = createMockProductRepo([product1, product2]);

		const cartService = createCartService(cartRepoStub, productRepoStub);

		const cartDetail = await cartService.getCartDetail(userId);

		const item1 = cartDetail?.items.find((i) => i.productId === product1.id);
		const item2 = cartDetail?.items.find((i) => i.productId === product2.id);

		expect(item1?.quantity).toBe(3);
		expect(item2?.quantity).toBe(3); // 4 → 3 に削られた

		expect(cartDetail).toBeDefined();
		expect(cartDetail?.items).toHaveLength(2);
		expect(cartDetail?.subTotal).toBe(9_000);
		expect(cartDetail?.grandTotal).toBe(9_900);
	});

	test("カートが存在しない場合、nullを返す", async () => {
		const cartService = createCartService(
			createMockCartRepo(null),
			createMockProductRepo([product1, product2]),
		);
		const cartDetail = await cartService.getCartDetail(userId);

		expect(cartDetail).toBe(null);
	});

	test("カートアイテムの個数が0の時に、items配列に値が入らない", async () => {
		let cart = cartDomain.createEmpty(userId);
		cart = cartDomain.changeQuantityBy(cart, product1.id, 0);

		const cartService = createCartService(
			createMockCartRepo(cart),
			createMockProductRepo([product1, product2]),
		);
		const cartDetail = await cartService.getCartDetail(userId);

		expect(cartDetail?.items).toHaveLength(0);
	});

	test("在庫切れの時の挙動", async () => {
		let cart = cartDomain.createEmpty(userId);
		cart = cartDomain.changeQuantityBy(cart, product1.id, 3);
		cart = cartDomain.changeQuantityBy(cart, productOutofstock.id, 3);

		const cartRepoStub = createMockCartRepo(cart);
		const productRepoStub = createMockProductRepo([
			product1,
			product2,
			productOutofstock,
		]);

		const cartService = createCartService(cartRepoStub, productRepoStub);

		const cartDetail = await cartService.getCartDetail(userId);

		const remainItem = cartDetail.items.find(
			(item) => item.productId === product1.id,
		);

		expect(cartDetail?.items).toHaveLength(1);
		expect(remainItem?.quantity).toBe(3);
		expect(cartDetail?.grandTotal).toBe(3_300);
	});

	test("カートの商品IDが存在しない", async () => {
		let cart = cartDomain.createEmpty(userId);
		cart = cartDomain.changeQuantityBy(cart, ulid(), 3);

		const cartRepoStub = createMockCartRepo(cart);
		const productRepoStub = createMockProductRepo([
			product1,
			product2,
			productOutofstock,
		]);

		const cartService = createCartService(cartRepoStub, productRepoStub);

		const cartDetail = await cartService.getCartDetail(userId);

		expect(cartDetail?.items).toHaveLength(0);
		expect(cartDetail?.grandTotal).toBe(0);
	});

	test("消費税の切り捨て", async () => {
		const productOddPrice = productDomain.create({
			...product1,
			id: ulid(),
			priceBeforeTax: 199, // 199円
			taxRate: 10, // 10% -> 税額は本来 19.9円
			stock: 10,
		});

		let cart = cartDomain.createEmpty(userId);
		cart = cartDomain.changeQuantityBy(cart, productOddPrice.id, 1);

		const cartService = createCartService(
			createMockCartRepo(cart),
			createMockProductRepo([productOddPrice]),
		);

		const cartDetail = await cartService.getCartDetail(userId);

		// 期待値: 19.9 -> 19円
		expect(cartDetail?.subTotal).toBe(199);
		expect(cartDetail?.taxTotal).toBe(19);
		expect(cartDetail?.grandTotal).toBe(218);
	});
});
