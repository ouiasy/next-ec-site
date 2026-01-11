ALTER TABLE "products" ADD COLUMN "price_after_tax" integer GENERATED ALWAYS AS (CAST
          ("products"."price_before_tax" * ("products"."tax_rate_percentage" + 100) / 100 + 0.5 AS INTEGER)) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "price_in_tax";