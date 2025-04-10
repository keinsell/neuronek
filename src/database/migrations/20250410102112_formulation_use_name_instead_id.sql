-- Disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- Create index "formulation_name" to table: "formulation"
CREATE UNIQUE INDEX `formulation_name` ON `formulation` (`name`);
-- Create "new_formulation_ingredient" table
CREATE TABLE `new_formulation_ingredient` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `formulation_name` integer NOT NULL, `substance_name` text NOT NULL, `dosage` real NOT NULL, CONSTRAINT `0` FOREIGN KEY (`formulation_name`) REFERENCES `formulation` (`name`) ON UPDATE CASCADE ON DELETE CASCADE);
-- Copy rows from old table "formulation_ingredient" to new temporary table "new_formulation_ingredient"
INSERT INTO `new_formulation_ingredient` (`id`, `substance_name`, `dosage`) SELECT `id`, `substance_name`, `dosage` FROM `formulation_ingredient`;
-- Drop "formulation_ingredient" table after copying rows
DROP TABLE `formulation_ingredient`;
-- Rename temporary table "new_formulation_ingredient" to "formulation_ingredient"
ALTER TABLE `new_formulation_ingredient` RENAME TO `formulation_ingredient`;
-- Enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;
