ALTER TABLE "products" RENAME COLUMN "tax_rate_percentage" TO "tax_rate";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "num_reviews" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "num_reviews" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "is_featured" SET NOT NULL;