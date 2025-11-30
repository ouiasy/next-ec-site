PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_carts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_carts`("id", "user_id", "created_at", "updated_at") SELECT "id", "user_id", "created_at", "updated_at" FROM `carts`;--> statement-breakpoint
DROP TABLE `carts`;--> statement-breakpoint
ALTER TABLE `__new_carts` RENAME TO `carts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX "products_slug_unique";--> statement-breakpoint
DROP INDEX "accounts_userId_idx";--> statement-breakpoint
DROP INDEX "sessions_token_unique";--> statement-breakpoint
DROP INDEX "sessions_userId_idx";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "verifications_identifier_idx";--> statement-breakpoint
ALTER TABLE `products` ALTER COLUMN "stock" TO "stock" integer DEFAULT 0;--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `accounts_userId_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `sessions_userId_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `verifications_identifier_idx` ON `verifications` (`identifier`);