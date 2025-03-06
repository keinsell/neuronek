-- Create "ingestion" table
CREATE TABLE `ingestion`
(
    `id`                      integer       NOT NULL PRIMARY KEY AUTOINCREMENT,
    `substance_name`          varchar       NOT NULL,
    `route_of_administration` varchar       NOT NULL,
    `dosage`                  float         NOT NULL,
    `ingested_at`             datetime_text NOT NULL,
    `updated_at`              datetime_text NOT NULL,
    `created_at`              datetime_text NOT NULL
);
-- Create "seaql_migrations" table
CREATE TABLE IF NOT EXISTS `seaql_migrations`
(
    `version`
        varchar
        NOT
            NULL,
    `applied_at`
        bigint
        NOT
            NULL,
    PRIMARY
        KEY
        (
         `version`
            )
);
