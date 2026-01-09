CREATE INDEX "cart_items_product_id_index" ON "cart_items" USING btree ("product_id");--> statement-breakpoint
ALTER TABLE "carts" DROP COLUMN "updated_at";