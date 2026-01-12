ALTER TABLE "payments" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "payment_status";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_status";