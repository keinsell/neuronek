-- Create "atlas_schema_revisions" table
CREATE TABLE `atlas_schema_revisions`
(
    `version`          text     NOT NULL,
    `description`      text     NOT NULL,
    `type`             integer  NOT NULL DEFAULT 2,
    `applied`          integer  NOT NULL DEFAULT 0,
    `total`            integer  NOT NULL DEFAULT 0,
    `executed_at`      datetime NOT NULL,
    `execution_time`   integer  NOT NULL,
    `error`            text NULL,
    `error_stmt`       text NULL,
    `hash`             text     NOT NULL,
    `partial_hashes`   json NULL,
    `operator_version` text     NOT NULL,
    PRIMARY KEY (`version`)
);
-- Create "seaql_migrations" table
CREATE TABLE `seaql_migrations`
(
    `version`    varchar NOT NULL,
    `applied_at` bigint  NOT NULL,
    PRIMARY KEY (`version`)
);
-- Create "substance" table
CREATE TABLE `substance`
(
    `id`                 text    NOT NULL,
    `name`               text    NOT NULL,
    `common_names`       text    NOT NULL,
    `pubchem_cid`        integer NOT NULL,
    `psychonautwiki_url` text NULL,
    `psychoactive_class` text    NOT NULL,
    `chemical_class`     text NULL,
    `description`        text NULL,
    PRIMARY KEY (`id`)
);
-- Create index "substance_id_key" to table: "substance"
CREATE UNIQUE INDEX `substance_id_key` ON `substance` (`id`);
-- Create index "substance_name_key" to table: "substance"
CREATE UNIQUE INDEX `substance_name_key` ON `substance` (`name`);
-- Create index "substance_pubchem_cid_key" to table: "substance"
CREATE UNIQUE INDEX `substance_pubchem_cid_key` ON `substance` (`pubchem_cid`);
-- Create "substance_route_of_administration" table
CREATE TABLE `substance_route_of_administration`
(
    `id`            text NOT NULL,
    `substanceName` text NOT NULL,
    `name`          text NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `substance_route_of_administration_substanceName_fkey` FOREIGN KEY (`substanceName`) REFERENCES `substance` (`name`) ON UPDATE CASCADE ON DELETE RESTRICT
);
-- Create index "substance_route_of_administration_name_substanceName_key" to table: "substance_route_of_administration"
CREATE UNIQUE INDEX `substance_route_of_administration_name_substanceName_key` ON `substance_route_of_administration` (`name`, `substanceName`);
-- Create "substance_route_of_administration_phase" table
CREATE TABLE `substance_route_of_administration_phase`
(
    `id`                      text NOT NULL,
    `classification`          text NOT NULL,
    `lower_duration`          text NULL,
    `upper_duration`          text NULL,
    `routeOfAdministrationId` text NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `route_of_administration_phase_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
);
-- Create index "route_of_administration_phase_routeOfAdministrationId_classification_key" to table: "substance_route_of_administration_phase"
CREATE UNIQUE INDEX `route_of_administration_phase_routeOfAdministrationId_classification_key` ON `substance_route_of_administration_phase` (`routeOfAdministrationId`, `classification`);
-- Create "substance_route_of_administration_dosage" table
CREATE TABLE `substance_route_of_administration_dosage`
(
    `id`                      text NOT NULL,
    `intensity`               text NOT NULL,
    `lower_bound_amount`      real NULL,
    `upper_bound_amount`      real NULL,
    `unit`                    text NOT NULL,
    `routeOfAdministrationId` text NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `route_of_administration_dosage_routeOfAdministrationId_fkey` FOREIGN KEY (`routeOfAdministrationId`) REFERENCES `substance_route_of_administration` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
);
-- Create index "route_of_administration_dosage_intensivity_routeOfAdministrationId_key" to table: "substance_route_of_administration_dosage"
CREATE UNIQUE INDEX `route_of_administration_dosage_intensivity_routeOfAdministrationId_key` ON `substance_route_of_administration_dosage` (`intensity`, `routeOfAdministrationId`);
-- Create "ingestion" table
CREATE TABLE `ingestion`
(
    `id`                      integer       NOT NULL PRIMARY KEY AUTOINCREMENT,
    `substance_name`          varchar       NOT NULL,
    `route_of_administration` varchar       NOT NULL,
    `dosage`                  float         NOT NULL,
    `dosage_classification`   text NULL,
    `ingested_at`             datetime_text NOT NULL,
    `updated_at`              datetime_text NOT NULL,
    `created_at`              datetime_text NOT NULL,
    CHECK (`dosage_classification` IN
           ('Thereshold', 'Light', 'Common', 'Strong', 'Heavy'))
);
-- Create "ingestion_phase" table
CREATE TABLE ingestion_phase
(
    id                   TEXT          NOT NULL,
    ingestion_id         INTEGER       NOT NULL,
    classification       TEXT          NOT NULL,
    start_date_min       datetime_text NOT NULL,
    start_date_max       datetime_text NOT NULL,
    end_date_min         datetime_text NOT NULL,
    end_date_max         datetime_text NOT NULL,
    common_dosage_weight INTEGER       NOT NULL,
    duration_min         INTEGER       NOT NULL,
    duration_max         INTEGER       NOT NULL,
    notes                TEXT,
    created_at           TEXT          NOT NULL,
    updated_at           TEXT          NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT ingestion_phase_ingestion_id_fkey
        FOREIGN KEY (ingestion_id) REFERENCES ingestion (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
    -- Keep classification values constrained:
    CHECK (classification IN ('Onset', 'Comeup', 'Peak', 'Comedown', 'Afterglow', 'Unknown')),
    -- Verify ordering of date intervals:
    CHECK (
        start_date_min <= start_date_max
            AND end_date_min <= end_date_max
            AND start_date_max <= end_date_max
            AND start_date_min <= end_date_min
        )
);
-- Create index "ingestion_phase_id_key" to table: "ingestion_phase"
CREATE UNIQUE INDEX `ingestion_phase_id_key` ON `ingestion_phase` (`id`);
-- Create index "ingestion_phase_ingestion_id_idx" to table: "ingestion_phase"
CREATE INDEX `ingestion_phase_ingestion_id_idx` ON `ingestion_phase` (`ingestion_id`);
-- Create index "ingestion_phase_classification_idx" to table: "ingestion_phase"
CREATE INDEX `ingestion_phase_classification_idx` ON `ingestion_phase` (`classification`);
