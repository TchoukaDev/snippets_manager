ALTER TABLE `category` ADD CONSTRAINT `category_name_unique` UNIQUE(`name`);--> statement-breakpoint
ALTER TABLE `snippets` ADD CONSTRAINT `snippets_title_unique` UNIQUE(`title`);--> statement-breakpoint
ALTER TABLE `tags` ADD CONSTRAINT `tags_name_unique` UNIQUE(`name`);--> statement-breakpoint
CREATE INDEX `format_index` ON `snippets` (`format`);