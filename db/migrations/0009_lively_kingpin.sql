ALTER TABLE "brands" DROP CONSTRAINT "brands_slug_unique";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_slug_unique";--> statement-breakpoint
ALTER TABLE "brands" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "slug";