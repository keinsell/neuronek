-- Create index "route_of_administration_dosage_intensivity_routeOfAdministrationId_key" to table: "substance_route_of_administration_dosage"
CREATE UNIQUE INDEX `route_of_administration_dosage_intensivity_routeOfAdministrationId_key` ON `substance_route_of_administration_dosage` (`intensity`, `routeOfAdministrationId`);
-- Create "ingestion_phase" table
CREATE TABLE `ingestion_phase`
(
    `id`             text          NOT NULL,
    `ingestion_id`   integer       NOT NULL,
    `classification` text          NOT NULL,
    `description`    text NULL,
    `start_time`     datetime_text NOT NULL,
    `end_time`       datetime_text NOT NULL,
    `duration_lower` text NULL,
    `duration_upper` text NULL,
    `intensity`      text NULL,
    `notes`          text NULL,
    `created_at`     datetime_text NOT NULL,
    `updated_at`     datetime_text NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `ingestion_phase_ingestion_id_fkey` FOREIGN KEY (`ingestion_id`) REFERENCES `ingestion` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CHECK (`classification` IN ('Onset', 'Comeup', 'Peak', 'Comedown', 'Afterglow', 'Unknown')),
    CONSTRAINT `ingestion_phase_start_before_end` CHECK (`start_time` <= `end_time`)
);
-- Create index "ingestion_phase_id_key" to table: "ingestion_phase"
CREATE UNIQUE INDEX `ingestion_phase_id_key` ON `ingestion_phase` (`id`);
-- Create index "ingestion_phase_ingestion_id_idx" to table: "ingestion_phase"
CREATE INDEX `ingestion_phase_ingestion_id_idx` ON `ingestion_phase` (`ingestion_id`);
-- Create index "ingestion_phase_classification_idx" to table: "ingestion_phase"
CREATE INDEX `ingestion_phase_classification_idx` ON `ingestion_phase` (`classification`);
