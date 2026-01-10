ALTER TABLE "products" ALTER COLUMN "price_in_tax" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
CREATE INDEX "cart_items_cart_id_index" ON "cart_items" USING btree ("cart_id");--> statement-breakpoint
ALTER TABLE "addresses" DROP COLUMN "name";