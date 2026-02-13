import { afterAll, assert, beforeAll, beforeEach, describe, test } from "vitest";
import { createCartRepository } from "./cart.repository";
import { testDB } from "@/.testutils/client";
// import {} from "drizzle-orm"
import { migrate } from "drizzle-orm/node-postgres/migrator";

describe("cart repository test", () => {
	const cartRepo = createCartRepository(testDB);

	beforeAll(async () => {
		await migrate(testDB, { migrationsFolder: "../testutils/migrations" });
	});
	beforeEach(() => {});

	describe("getCartByUserID", () => {
		test("正常にcartを返す", () => {
			
		});

		test("ユーザーがカートを有していない場合、nullを返す", () => {});

		test("db接続にエラーが起きたらRepositoryErrorを返す", () => {});
	});

	describe("upsert", () => {});

	afterAll(async () => {
		await testDB.$client.end()
	});
});
