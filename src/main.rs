#![feature(new_range_api)]
#![allow(unused_imports)]
#![feature(trivial_bounds)]
#![feature(type_alias_impl_trait)]
#![feature(impl_trait_in_bindings)]
#![feature(min_specialization)]
#![feature(negative_impls)]
#![feature(trait_alias)]
#![feature(extern_types)]
#![feature(ascii_char)]
#![feature(ascii_char_variants)]

use std::fmt::Display;

use chrono::{DateTime, Local};
use chrono_english::Dialect;
use clap::{CommandFactory, Parser};
use error_handling::setup_diagnostics;
use formulation::list_formulations;
use logging::setup_logger;
use miette::{miette, Diagnostic, IntoDiagnostic, Result};
use r#abstract::CommandHandler;
use tracing_subscriber::util::SubscriberInitExt;

use crate::cli::{ApplicationCommands, CommandLineInterface, Displayable, MessageFormat};
use crate::database::{migrate_database, DATABASE_CONNECTION};
use crate::ingestion::IngestionActions;
use crate::statistics::show_statistics;

mod r#abstract;
mod cli;
pub mod config;
mod database;
pub(crate) mod error_handling;
mod formulation;
mod ingestion;
pub(crate) mod logging;
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

#[derive(Debug, thiserror::Error, Diagnostic)]
pub enum Exception
{
	#[error("Destructive operation must be acknowledged")]
	DestructiveOperationNotConfirmed,
	#[error("Entity not found")]
	#[diagnostic(help(
		"Did you have requested entity by ID to which you have access and exists in database?"
	))]
	EntityNotFound,
}

pub struct Application<'a>
{
	pub database_connection: &'a sea_orm::DatabaseConnection,
	pub stdout_format: MessageFormat,
}

use clap::Subcommand;
use dialoguer::Confirm;
use owo_colors::OwoColorize;

use crate::formulation::{create_formulation, create_formulation_ingredient, delete_formulation, get_formulation, update_formulation, Command, GetFormulation};

#[async_std::main]
async fn main() -> Result<()>
{
	let _sentry = sentry::init((
		"https://b21e1528a3974724b2f9790b19f39143@o1122681.ingest.us.sentry.io/6380718",
		sentry::ClientOptions {
			release: sentry::release_name!(),
			..sentry::ClientOptions::default()
		},
	));
	let _logger = setup_logger();
	let _diagnostics = setup_diagnostics();

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
				ingestion::service::get_ingestion(view_ingestion.ingestion_id)
					.await
					.map_err(|e| miette!(e))
					.and_then(|maybe_ingestion| {
						maybe_ingestion
							.map(|ingestion| ingestion.display(context.stdout_format))
							.ok_or_else(|| miette!("Ingestion not found"))
					})?;
				Ok(())
			}
			| IngestionActions::Analyze(analyze_ingestion) => {
				ingestion::service::analyze_ingestion(analyze_ingestion)
					.await
					.map_err(|e| miette!(e))
					.map(|ingestion| ingestion.display(context.stdout_format))?;
				Ok(())
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
		| ApplicationCommands::Formulation(cmd) => {
			let id = cmd.id.clone();
			let command = &cmd.command.clone();

			// If id is provided and no command is provided,
			// application should default into providing default id for create command

			if (id.is_some() && command.is_none()) {
				let id = id.unwrap();
				let command = GetFormulation {
					id: Some(id as u32),
				};
				let formulation = get_formulation(&command, context.database_connection);
				formulation.map(|f| f.display(context.stdout_format));
				return Ok(());
			}

			if (id.is_none() && command.is_none()) {
				let formulations = list_formulations(
					&formulation::ListFormulation::default(),
					context.database_connection,
				);
				let formulations = crate::cli::formulation::FormulationList::from(formulations);
				formulations.display(context.stdout_format);
				return Ok(());
			}

			if (command.is_some()) {
				match command.clone().unwrap() {
					| Command::Create(cmd) => {
						let formulation = create_formulation(&cmd, &context.database_connection);
						formulation.display(context.stdout_format);
					}
					| Command::Update(cmd) => {
						let formulation = update_formulation(&cmd, &context.database_connection);
						formulation?.display(context.stdout_format);
					}
					| Command::Delete(cmd) => {
						if (cmd.confirmation.is_none()) {
							if (cli::is_interactive()) {
								let is_confirmed = Confirm::new()
									.with_prompt("Operation will be irreversible, are you sure?")
									.default(false)
									.interact()
									.map_err(|e| miette!("Failed to get confirmation: {}", e))?;

								if (!is_confirmed) {
									miette!("Failed to confirm");
								};
							}
						} else if (cmd.confirmation.is_some() && cmd.confirmation.unwrap() == false)
						{
							miette!("Failed to confirm");
						};

						delete_formulation(&cmd, &context.database_connection)?;
						println!("Formulation deleted successfully!");
					}
					| Command::View(_) => {}
					| Command::List(_) => {},
					| Command::Igr(cmd) => {
						match cmd.command {
							formulation::ingredient::Command::Create(cmd) => {
								let fi = create_formulation_ingredient(cmd, &context.database_connection).await?;
								fi.display(context.stdout_format);
							},
						}
					}
				}
			}

			Ok(())
		}
		| ApplicationCommands::Completion { .. } => unreachable!(),
	}
}
