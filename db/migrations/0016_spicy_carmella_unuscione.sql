ALTER TABLE "order_items" RENAME COLUMN "product_name" TO "name";--> statement-breakpoint
ALTER TABLE "order_items" RENAME COLUMN "price_ex_tax" TO "price_before_tax";--> statement-breakpoint
ALTER TABLE "product_images" RENAME COLUMN "display_order" TO "display_ord";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "coupon_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_discount" integer NOT NULL;