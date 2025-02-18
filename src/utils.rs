use crate::cli::MessageFormat;
use crate::core::config::CONFIG;
use crate::core::config::Config;
use crate::database::Migrator;
use async_std::task::block_on;
use atty::Stream;
use chrono::Local;
use chrono_english::Dialect;
use miette::IntoDiagnostic;
use sea_orm::Database;
use sea_orm::DatabaseConnection;
use sea_orm::prelude::async_trait;
use sea_orm_migration::IntoSchemaManagerConnection;
use sea_orm_migration::MigratorTrait;
use std::env::temp_dir;
use std::io::stdout;
use std::path::PathBuf;
use std::thread::sleep;
use tracing::debug;
use tracing::error;
use tracing::info;
use tracing::instrument;
use tracing::warn;
use tracing_indicatif::IndicatifLayer;
use tracing_subscriber::Layer;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

#[derive(Debug, Clone)]
pub struct AppContext<'a>
{
    pub database_connection: &'a sea_orm::DatabaseConnection,
    pub stdout_format: MessageFormat,
}

lazy_static::lazy_static! {
    #[derive(Clone, Debug)]
    pub static ref DATABASE_CONNECTION: DatabaseConnection = {
        let sqlite_path = format!("sqlite://{}", CONFIG.sqlite_path.clone().to_str().expect("Invalid UTF-8 in path"));

        debug!("Opening database connection to {}", sqlite_path);

        match block_on(async { Database::connect(&sqlite_path).await }) {
            Ok(connection) => {
                debug!("Database connection established successfully!");
                connection
            }
            Err(error) => {
                if error.to_string().contains("unable to open database file") {
                    warn!("Database file not found or inaccessible at {}, attempting to initialize...", sqlite_path);

                    if let Err(init_error) = initialize_sqlite_by_path(&CONFIG.sqlite_path) {
                        error!("Failed to initialize the database: {}", init_error);
                        panic!("Critical: Unable to initialize the database file at {}. Error: {}", sqlite_path, init_error);
                    }

                    match block_on(async { Database::connect(&sqlite_path).await }) {
                        Ok(retry_connection) => {
                            debug!("Database connection established successfully after initialization!");
                            retry_connection
                        },
                        Err(retry_error) => {
                            error!("Failed to connect to the database even after initialization: {}", retry_error);
                            panic!("Critical: Unable to establish database connection at {}. Error: {}", sqlite_path, retry_error);
                        }
                    }
                } else {
                    error!("Unexpected database connection error: {}", error);
                    panic!("Critical: Unable to establish database connection. Error: {}", error);
                }
            }
        }
    };
}

fn initialize_sqlite_by_path(path: &PathBuf) -> std::result::Result<(), String>
{
    if let Some(parent_dir) = path.parent()
    {
        if !parent_dir.exists()
        {
            std::fs::create_dir_all(parent_dir)
                .map_err(|e| format!("Failed to create database directory: {}", e))?;
            debug!("Created database directory at {}", parent_dir.display());
        }
    }

    std::fs::File::create(path).map_err(|e| format!("Failed to create database file: {}", e))?;
    debug!("Created database file at {}", path.display());

    Ok(())
}

#[instrument]
pub async fn migrate_database(database_connection: &DatabaseConnection) -> miette::Result<()>
{
    let is_interactive_terminal = atty::is(Stream::Stdout);
    let spinner = if is_interactive_terminal
    {
        let s = indicatif::ProgressBar::new_spinner();
        s.enable_steady_tick(std::time::Duration::from_millis(10));
        Some(s)
    }
    else
    {
        None
    };

    let pending_migrations =
        Migrator::get_pending_migrations(&database_connection.into_schema_manager_connection())
            .await
            .into_diagnostic()?;

    if !pending_migrations.is_empty()
    {
        info!("There are {} database pending.", pending_migrations.len());
        info!("Applying database into {:?}", database_connection);

        if let Some(spinner) = &spinner
        {
            spinner.set_message("Applying migrations...");
        }

        Migrator::up(database_connection.into_schema_manager_connection(), None)
            .await
            .into_diagnostic()?;

        if let Some(spinner) = spinner
        {
            spinner.finish_with_message("Migrations applied successfully.");
        }
    }

    Ok(())
}


pub fn parse_date_string(humanized_input: &str) -> miette::Result<chrono::DateTime<chrono::Local>>
{
    chrono_english::parse_date_string(humanized_input, Local::now(), Dialect::Us).into_diagnostic()
}
