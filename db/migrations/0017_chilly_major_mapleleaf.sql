ALTER TABLE "brands" ADD COLUMN "created_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "updated_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "created_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "updated_at" timestamp with time zone NOT NULL;