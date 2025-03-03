pub use sea_orm_migration::prelude::*;


use rust_embed::Embed;

#[derive(Embed)]
#[folder = "src/database/migrations"]
pub struct Migrations;


macro_rules! sql_migration {
    ($name:ident, $migration_name:expr, $filename:expr) => {
        pub struct $name;

        impl MigrationName for $name
        {
            fn name(&self) -> &str { $migration_name }
        }

        #[async_trait::async_trait]
        impl MigrationTrait for $name
        {
            async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr>
            {
                let migration_filename = format!("{}.sql", $filename);
                let migration_file = Migrations::get(&migration_filename).ok_or_else(|| {
                    DbErr::Custom(format!("Migration file not found: {}", migration_filename))
                })?;
                let sql_statement = std::str::from_utf8(migration_file.data.as_ref())
                    .map_err(|e| DbErr::Custom(format!("Error decoding SQL: {}", e)))?;
                manager
                    .get_connection()
                    .execute_unprepared(sql_statement)
                    .await?;
                Ok(())
            }

            async fn down(&self, _manager: &SchemaManager) -> Result<(), DbErr>
            {
                panic!("Down migrations aren't supported before official release")
            }
        }
    };
}
macro_rules! import_migration {
    ($name:ident, $migration_name:expr, $filename:expr) => {{
        sql_migration!($name, $migration_name, $filename);
        Box::new($name)
    }};
}

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator
{
    fn migrations() -> Vec<Box<dyn MigrationTrait>>
    {
        vec![
            import_migration!(
                M20020101000002CreateDatabaseSchema,
                "m20220101_000001_create_table",
                "20250101000001_add_ingestion_table"
            ),
            import_migration!(
                M20020101000002CreateDatabaseSchema,
                "m20020101_000002_create_database_schema",
                "20250101000002_import_substance"
            ),
            import_migration!(
                M20250101235153DropUnrelatedData,
                "20250101235153_drop_unrelated_data",
                "20250101235153_drop_unrelated_data"
            ),
            import_migration!(
                M20250104060831UpdateDosageBounds,
                "20250104060831_update_dosage_bounds",
                "20250104060831_update_dosage_bounds"
            ),
            import_migration!(
                M20250108183655UpdateRouteOfAdministrationClassificationValues,
                "20250108183655_update_route_of_administration_classification_values",
                "20250108183655_update_route_of_administration_classification_values"
            ),
            import_migration!(
                M20250127045746AddIngestionPhase,
                "20250127045746_add_ingestion_phase",
                "20250127045746_add_ingestion_phase"
            ),
            import_migration!(
                M20250208131330UpdateIngestionModel,
                "20250208131330_update_ingestion_model",
                "20250208131330_update_ingestion_model"
            ),
            import_migration!(
                M20250210165025IngestionPhaseAddBounds,
                "20250210165025_ingestion_phase_add_bounds",
                "20250210165025_ingestion_phase_add_bounds"
            ),
            import_migration!(
                M20250210175314IngestionPhaseUseDatetime,
                "20250210175314_ingestion_phase_use_datetime",
                "20250210175314_ingestion_phase_use_datetime"
            ),
            import_migration!(
                M20250211000000FixDosageClassification,
                "20250211000000_fix_dosage_classification",
                "20250211000000_fix_dosage_classification"
            ),
            import_migration!(
                M20250218212411IngestionPhaseAddSubstanceInformation,
                "20250218212411_ingestion_phase_add_substance_information",
                "20250218212411_ingestion_phase_add_substance_information"
            ),
            import_migration!(
                M20250303072935RemoveDosageClassificationFromIngestion,
                "20250303072935_remove_dosage_classification_from_ingestion",
                "20250303072935_remove_dosage_classification_from_ingestion"
            ),
        ]
    }
}
