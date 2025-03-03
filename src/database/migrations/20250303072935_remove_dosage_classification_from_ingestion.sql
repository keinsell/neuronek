-- Disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- Create "new_ingestion" table
CREATE TABLE `new_ingestion`
(
    `id`                      integer       NOT NULL PRIMARY KEY AUTOINCREMENT,
    `substance_name`          varchar       NOT NULL,
    `route_of_administration` varchar       NOT NULL,
    `dosage`                  float         NOT NULL,
    `ingested_at`             datetime_text NOT NULL,
    `updated_at`              datetime_text NOT NULL,
    `created_at`              datetime_text NOT NULL
);
-- Copy rows from old table "ingestion" to new temporary table "new_ingestion"
INSERT INTO `new_ingestion` (`id`, `substance_name`, `route_of_administration`, `dosage`, `ingested_at`, `updated_at`,
                             `created_at`)
SELECT `id`, `substance_name`, `route_of_administration`, `dosage`, `ingested_at`, `updated_at`, `created_at`
FROM `ingestion`;
-- Drop "ingestion" table after copying rows
DROP TABLE `ingestion`;
-- Rename temporary table "new_ingestion" to "ingestion"
ALTER TABLE `new_ingestion`
    RENAME TO `ingestion`;
-- Create "new_ingestion_phase" table
CREATE TABLE `new_ingestion_phase`
(
    `id`             text          NOT NULL,
    `ingestion_id`   integer       NOT NULL,
    `classification` text          NOT NULL,
    `start_date_min` datetime_text NOT NULL,
    `start_date_max` datetime_text NOT NULL,
    `end_date_min`   datetime_text NOT NULL,
    `end_date_max`   datetime_text NOT NULL,
    `weight`         real          NOT NULL DEFAULT 1,
    `duration_min`   text          NOT NULL,
    `duration_max`   text          NOT NULL,
    `substance_name` text          NOT NULL,
    `created_at`     text          NOT NULL,
    `updated_at`     text          NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `ingestion_phase_ingestion_id_fkey` FOREIGN KEY (`ingestion_id`) REFERENCES `ingestion` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CHECK (classification IN ('Onset', 'Comeup', 'Peak', 'Comedown', 'Afterglow', 'Unknown')),
    CHECK (
        start_date_min <= start_date_max
            AND end_date_min <= end_date_max
            AND start_date_max <= end_date_max
            AND start_date_min <= end_date_min
        )
);
-- Copy rows from old table "ingestion_phase" to new temporary table "new_ingestion_phase"
INSERT INTO `new_ingestion_phase` (`id`, `ingestion_id`, `classification`, `start_date_min`, `start_date_max`,
                                   `end_date_min`, `end_date_max`, `weight`, `duration_min`, `duration_max`,
                                   `substance_name`, `created_at`, `updated_at`)
SELECT `id`,
       `ingestion_id`,
       `classification`,
       `start_date_min`,
       `start_date_max`,
       `end_date_min`,
       `end_date_max`,
       `weight`,
       `duration_min`,
       `duration_max`,
       `substance_name`,
       `created_at`,
       `updated_at`
FROM `ingestion_phase`;
-- Drop "ingestion_phase" table after copying rows
DROP TABLE `ingestion_phase`;
-- Rename temporary table "new_ingestion_phase" to "ingestion_phase"
ALTER TABLE `new_ingestion_phase`
    RENAME TO `ingestion_phase`;
-- Create index "ingestion_phase_id_key" to table: "ingestion_phase"
CREATE UNIQUE INDEX `ingestion_phase_id_key` ON `ingestion_phase` (`id`);
-- Create index "ingestion_phase_ingestion_id_idx" to table: "ingestion_phase"
CREATE INDEX `ingestion_phase_ingestion_id_idx` ON `ingestion_phase` (`ingestion_id`);
-- Create index "ingestion_phase_classification_idx" to table: "ingestion_phase"
CREATE INDEX `ingestion_phase_classification_idx` ON `ingestion_phase` (`classification`);
-- Enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;
