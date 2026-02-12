CREATE TABLE `category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `snippet_tags` (
	`snippet_id` int NOT NULL,
	`tag_id` int NOT NULL,
	CONSTRAINT `snippet_tags_snippet_id_tag_id_pk` PRIMARY KEY(`snippet_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `snippets` ADD `category_id` int;--> statement-breakpoint
ALTER TABLE `snippet_tags` ADD CONSTRAINT `snippet_tags_snippet_id_snippets_id_fk` FOREIGN KEY (`snippet_id`) REFERENCES `snippets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `snippet_tags` ADD CONSTRAINT `snippet_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `snippets` ADD CONSTRAINT `snippets_category_id_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE no action ON UPDATE no action;