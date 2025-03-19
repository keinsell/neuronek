pub mod entities;
pub mod migrator;

use std::path::PathBuf;

use async_std::task::block_on;
use atty::Stream;
pub use entities::prelude::*;
pub use migrator::Migrator;
use sea_orm::Database;
use sea_orm_migration::{IntoSchemaManagerConnection, MigratorTrait};
use tracing::{debug, error, info, instrument, warn};

use crate::config::CONFIG;
pub type DatabaseConnection = sea_orm::DatabaseConnection;

lazy_static::lazy_static! {
	#[derive(Clone, Debug)]
	pub static ref DATABASE_CONNECTION: DatabaseConnection = {
		let sqlite_path: &str = CONFIG.sqlite_path.to_str().unwrap().clone();


		let mut sqlite_uri = format!(
			"sqlite://{}",
			sqlite_path
		);

		if cfg!(test) {sqlite_uri = "sqlite::memory:".parse().unwrap() }

		debug!("Opening database connection to {}", sqlite_uri);

		let connection = match block_on(async { Database::connect(&sqlite_uri).await }) {
			Ok(connection) => {
				debug!("Database connection established successfully!");
				connection
			}
			Err(error) => {
				if error.to_string().contains("unable to open database file") {
					warn!(
						"Database file not found or inaccessible at {}, \
						attempting to initialize...",
						sqlite_uri
					);

					if let Err(init_error) = initialize_database_file(&CONFIG.sqlite_path) {
						error!("Failed to initialize the database: {}", init_error);
						panic!(
							"Critical: Unable to initialize the database file at {}. \
							Error: {}",
							sqlite_uri,
							init_error
						);
					}

					match block_on(async { Database::connect(&sqlite_uri).await }) {
						Ok(retry_connection) => {
							debug!(
								"Database connection established successfully \
								after initialization!"
							);
							retry_connection
						},
						Err(retry_error) => {
							error!(
								"Failed to connect to the database even after \
								initialization: {}",
								retry_error
							);
							panic!(
								"Critical: Unable to establish database connection at {}. \
								Error: {}",
								sqlite_uri,
								retry_error
							);
						}
					}
				} else {
					error!("Unexpected database connection error: {}", error);
					panic!(
						"Critical: Unable to establish database connection. Error: {}",
						error
					);
				}
			}
		};

		// Migrate the database right after establishing a connection:
		if let Err(migration_err) = block_on(migrate_database(&connection)) {
			error!("Failed to run database migrations: {}", migration_err);
			panic!(
				"Critical: Unable to complete database migrations at {}. \
				Error: {}",
				sqlite_uri,
				migration_err
			);
		}

		connection
	};
}

fn initialize_database_file(path: &PathBuf) -> std::result::Result<(), String>
{
	if let Some(parent_dir) = path.parent() {
		if !parent_dir.exists() {
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
pub async fn migrate_database(
	database_connection: &DatabaseConnection,
) -> Result<(), Box<dyn std::error::Error>>
{
	let is_interactive_terminal = atty::is(Stream::Stdout);
	let spinner = if is_interactive_terminal {
		let s = indicatif::ProgressBar::new_spinner();
		s.enable_steady_tick(std::time::Duration::from_millis(10));
		Some(s)
	} else {
		None
	};

	let pending_migrations =
		Migrator::get_pending_migrations(&database_connection.into_schema_manager_connection())
			.await?;

	if !pending_migrations.is_empty() {
		info!(
			"There are {} pending database migrations.",
			pending_migrations.len()
		);
		info!("Applying migrations...");

		if let Some(spinner) = &spinner {
			spinner.set_message("Applying migrations...");
		}

		Migrator::up(database_connection.into_schema_manager_connection(), None).await?;

		if let Some(spinner) = spinner {
			spinner.finish_with_message("Migrations applied successfully.");
		}
	}

	Ok(())
}
