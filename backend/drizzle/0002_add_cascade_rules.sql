ALTER TABLE `snippet_tags` DROP FOREIGN KEY `snippet_tags_snippet_id_snippets_id_fk`;
--> statement-breakpoint
ALTER TABLE `snippet_tags` DROP FOREIGN KEY `snippet_tags_tag_id_tags_id_fk`;
--> statement-breakpoint
ALTER TABLE `snippets` DROP FOREIGN KEY `snippets_category_id_category_id_fk`;
--> statement-breakpoint
ALTER TABLE `snippets` ADD `format` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `snippet_tags` ADD CONSTRAINT `snippet_tags_snippet_id_snippets_id_fk` FOREIGN KEY (`snippet_id`) REFERENCES `snippets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `snippet_tags` ADD CONSTRAINT `snippet_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `snippets` ADD CONSTRAINT `snippets_category_id_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE set null ON UPDATE no action;