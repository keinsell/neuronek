-- Disable foreign key constraints
PRAGMA
foreign_keys = off;

-- Create new table with correct constraint
CREATE TABLE `new_ingestion`
(
    `id`                      integer       NOT NULL PRIMARY KEY AUTOINCREMENT,
    `substance_name`          varchar       NOT NULL,
    `route_of_administration` varchar       NOT NULL,
    `dosage`                  float         NOT NULL,
    `dosage_classification`   text NULL,
    `ingested_at`             datetime_text NOT NULL,
    `updated_at`              datetime_text NOT NULL,
    `created_at`              datetime_text NOT NULL,
    CHECK (`dosage_classification` IS NULL OR `dosage_classification` IN
                                              ('Threshold', 'Light', 'Common', 'Strong', 'Heavy'))
);

-- Copy data from old table
INSERT INTO `new_ingestion` (`id`, `substance_name`, `route_of_administration`, `dosage`, `dosage_classification`,
                             `ingested_at`, `updated_at`, `created_at`)
SELECT `id`,
       `substance_name`,
       `route_of_administration`,
       `dosage`,
       `dosage_classification`,
       `ingested_at`,
       `updated_at`,
       `created_at`
FROM `ingestion`;

-- Drop old table
DROP TABLE `ingestion`;

-- Rename new table
ALTER TABLE `new_ingestion` RENAME TO `ingestion`;

-- Enable foreign key constraints
PRAGMA
foreign_keys = on;