ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "transaction_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "created_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "billing_addr_order_id_idx" ON "billing_addresses" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "order_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_order_id_idx" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "payment_user_id_idx" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shipment_order_id_idx" ON "shipments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "shipping_addr_order_id_idx" ON "shipping_addresses" USING btree ("order_id");