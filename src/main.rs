#![feature(new_range_api)]
#![allow(unused_imports)]

use std::fmt::Display;

use r#abstract::CommandHandler;
use chrono::{DateTime, Local};
use chrono_english::Dialect;
use clap::{CommandFactory, Parser};
use error_handling::setup_diagnostics;
use logging::setup_logger;
use miette::{IntoDiagnostic, Result, miette};
use tracing_subscriber::util::SubscriberInitExt;

use crate::cli::{ApplicationCommands, CommandLineInterface, Displayable, MessageFormat};
use crate::database::{DATABASE_CONNECTION, migrate_database};
use crate::ingestion::IngestionActions;
use crate::statistics::show_statistics;

mod r#abstract;
mod analyzer;
mod cli;
pub mod config;
mod database;
pub(crate) mod error_handling;
mod ingestion;
pub(crate) mod logging;
mod prelude;
mod statistics;
mod substance;
mod ui;

use crossterm::ExecutableCommand;

pub trait ValueParser
{
	type Output;
	fn parse_value(input: &str) -> miette::Result<Self::Output>;
}

impl ValueParser for DateTime<Local>
{
	type Output = DateTime<Local>;
	fn parse_value(input: &str) -> miette::Result<Self::Output>
	{
		chrono_english::parse_date_string(input, Local::now(), Dialect::Us).into_diagnostic()
	}
}

pub struct Application<'a>
{
	pub database_connection: &'a sea_orm::DatabaseConnection,
	pub stdout_format: MessageFormat,
}

use clap::Subcommand;

#[async_std::main]
async fn main() -> Result<()>
{
	setup_diagnostics();
	let _guard = setup_logger().unwrap();

	migrate_database(&DATABASE_CONNECTION)
		.await
		.expect("Database migration failed");

	let cli = CommandLineInterface::parse();

	let context = Application {
		database_connection: &DATABASE_CONNECTION,
		stdout_format: cli.format,
	};

	match cli.command {
		| ApplicationCommands::Ingestion(cmd) => match &cmd.commands {
			| IngestionActions::Log(log_ingestion) => {
				let ingestion = crate::ingestion::service::log_ingestion(
					log_ingestion,
					context.database_connection,
				)
				.await
				.map_err(|e| miette!(e))?;

				ingestion.display(context.stdout_format);
				Ok(())
			}
			| IngestionActions::List(list_ingestions) => list_ingestions.handle(context).await,
			| IngestionActions::Delete(delete_ingestion) => delete_ingestion.handle(context).await,
			| IngestionActions::Update(update_ingestion) => update_ingestion.handle(context).await,
			| IngestionActions::View(view_ingestion) => {
				let ingestion =
					crate::ingestion::service::get_ingestion(view_ingestion.ingestion_id)
						.await
						.map_err(|e| miette!(e))?;

				if let Some(ingestion) = ingestion {
					ingestion.display(context.stdout_format);
					Ok(())
				} else {
					Err(miette!(
						"Ingestion with ID {} not found",
						view_ingestion.ingestion_id
					))
				}
			}
		},
		| ApplicationCommands::Substance(cmd) => cmd.handle(context).await,
		| ApplicationCommands::Stats(cmd) => {
			show_statistics(&cmd).await?;
			Ok(())
		}
		| ApplicationCommands::Prominence(cmd) => {
			cli::prominence::handle_prominence_command(&cmd).await
		}
		| ApplicationCommands::Completion { .. } => unreachable!(),
	}
}
