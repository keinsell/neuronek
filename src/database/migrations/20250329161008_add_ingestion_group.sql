-- Disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- Create "ingestion_group" table
CREATE TABLE `ingestion_group` (`id` text NOT NULL, `name` text NOT NULL, `created_at` text NOT NULL, `updated_at` text NOT NULL, PRIMARY KEY (`id`));
-- Create index "ingestion_group_id_key" to table: "ingestion_group"
CREATE UNIQUE INDEX `ingestion_group_id_key` ON `ingestion_group` (`id`);
-- Create "ingestion_group_ingestion" table
CREATE TABLE `ingestion_group_ingestion` (`id` text NOT NULL, `group_id` text NOT NULL, `ingestion_id` integer NOT NULL, PRIMARY KEY (`id`), CONSTRAINT `ingestion_group_ingestion_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `ingestion_group` (`id`) ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT `ingestion_group_ingestion_ingestion_id_fkey` FOREIGN KEY (`ingestion_id`) REFERENCES `ingestion` (`id`) ON UPDATE CASCADE ON DELETE CASCADE);
-- Enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;
