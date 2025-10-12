#![feature(new_range_api)]
#![allow(unused_imports)]
#![feature(trivial_bounds)]
#![feature(type_alias_impl_trait)]
#![feature(impl_trait_in_bindings)]
#![feature(min_specialization)]
#![feature(negative_impls)]
#![feature(trait_alias)]
#![feature(extern_types)]

use std::env;
use std::fmt::Display;

use chrono::{DateTime, Local};
use chrono_english::Dialect;
use clap::{CommandFactory, Parser};
use clap_complete::Shell;
use clap_complete::env::CompleteEnv;
use cli::Executable;
use miette::{Diagnostic, IntoDiagnostic, Result, miette};
use tracing_subscriber::util::SubscriberInitExt;

use crate::cli::{ApplicationCommands, CommandLineInterface, Displayable, MessageFormat};
use crate::database::{DATABASE_CONNECTION, migrate_database};
use crate::ingestion::IngestionActions;

mod cli;
pub mod config;
mod database;
mod ingestion;
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


use clap::Subcommand;


#[derive(Clone)]
struct ApplicationContext
{
	database_connection: &'static sea_orm::DatabaseConnection,
}


#[async_std::main]
async fn main() -> Result<()>
{
	// Initialize dynamic completions using CompleteEnv::with_factory.
	// The `.complete()` method will handle callbacks from the shell.
	// - If it's a completion call and succeeds, it prints to stdout and exits.
	// - If it's a completion call and an error occurs within clap_complete's
	//   handling, it will return an Err(e).
	// - If it's not a completion call, it returns Ok(()).
	CompleteEnv::with_factory(CommandLineInterface::command).complete();

	// If we reach here, it means CompleteEnv::complete() returned Ok(()),
	// which signifies it was NOT a completion call, so we proceed with
	// normal application logic.
	let cli = CommandLineInterface::parse();
	let mut session = ApplicationContext {
		database_connection: &DATABASE_CONNECTION,
	};

	let final_result = match cli.command {
		| ApplicationCommands::Ingestion(cmd) => {
			use crate::ingestion::IngestionActions;
			use crate::ingestion::analyzer::analyze_ingestion;
			use crate::ingestion::service::{get_ingestion, list_ingestion, log_ingestion};
			match cmd.commands {
				| IngestionActions::Log(log) => {
					match log_ingestion(&log, session.database_connection).await {
						| Ok(output) => {
							output.display(cli.format.clone());
							Ok(())
						}
						| Err(e) => Err(miette!("{}", e)),
					}
				}
				| IngestionActions::List(list) => match list_ingestion(&list).await {
					| Ok(output) => {
						crate::cli::ingestion::IngestionList(output).display(cli.format.clone());
						Ok(())
					}
					| Err(e) => Err(miette!("{}", e)),
				},
				| IngestionActions::Delete(_del) => {
					// Fallback: print not implemented
					eprintln!("Delete not implemented in main");
					Ok(()) // Explicitly return Ok(())
				}
				| IngestionActions::Update(_upd) => {
					// Fallback: print not implemented
					eprintln!("Update not implemented in main");
					Ok(()) // Explicitly return Ok(())
				}
				| IngestionActions::View(view) => {
					match get_ingestion(view.ingestion_id).await {
						| Ok(Some(output)) => {
							output.display(cli.format.clone());
							Ok(())
						}
						| Ok(None) => {
							// eprintln!("Ingestion not found");
							// std::process::exit(1);
							Err(miette!("Ingestion not found"))
						}
						| Err(e) => Err(miette!("{}", e)),
					}
				}
				| IngestionActions::Analyze(analyze) => match analyze_ingestion(&analyze).await {
					| Ok(output) => {
						output.display(cli.format.clone());
						Ok(())
					}
					| Err(e) => Err(miette!("{}", e)),
				},
			}
		}
		| ApplicationCommands::Substance(cmd) => {
			// Handle special case for listing substance names
			if cmd.list_names {
				let names = crate::cli::substance::get_substance_names().await;
				for name in names {
					println!("{}", name);
				}
				Ok(())
			} else {
				match cmd.execute(&session).await {
					| Ok(output) => {
						output.display(cli.format.clone());
						Ok(())
					}
					| Err(e) => Err(e), // cmd.execute already returns miette::Result
				}
			}
		}
		| ApplicationCommands::Completion(cmd) => {
			match cmd.execute(&session).await {
				| Ok(_) => Ok(()),
				| Err(e) => Err(e), // cmd.execute already returns miette::Result
			}
		}
		| ApplicationCommands::Dashboard(_cmd) => {
			let mut app = ui::app::App::new(session.database_connection);
			app.run().await
		}
	};

	final_result
}
