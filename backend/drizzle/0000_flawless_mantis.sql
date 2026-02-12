CREATE TABLE `snippets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `snippets_id` PRIMARY KEY(`id`)
);
