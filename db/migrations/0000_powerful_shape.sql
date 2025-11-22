CREATE TABLE `product` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category` text,
	`description` text,
	`images` text DEFAULT '[]',
	`price` integer DEFAULT 0 NOT NULL,
	`brand` text,
	`rating` real DEFAULT 0,
	`numReviews` integer DEFAULT 0,
	`stock` integer,
	`isFeatured` integer DEFAULT false,
	`banner` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_slug_unique` ON `product` (`slug`);