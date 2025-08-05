//! # Neuronek CLI
//! 
//! 🧬 Intelligent dosage tracker application for monitoring supplements, nootropics and psychoactive substances 
//! along with their long-term influence on one's mind and body.
//!
//! ## Features
//!
//! - **Substance Management**: Track and manage various supplements, nootropics, and psychoactive substances
//! - **Ingestion Logging**: Record and monitor substance intake with detailed timing and dosage information
//! - **Route of Administration**: Support for different administration methods (oral, sublingual, etc.)
//! - **Data Analysis**: Analyze patterns and trends in substance usage over time
//! - **Terminal UI**: Rich terminal-based user interface for easy interaction
//! - **Database Storage**: Persistent storage using SQLite with Sea-ORM
//!
//! ## Usage
//!
//! ```bash
//! # Log a new ingestion
//! neuronek log <substance> <dosage>
//!
//! # View ingestion history
//! neuronek list
//!
//! # Get substance information
//! neuronek substance info <substance_name>
//! ```
//!
//! ## Architecture
//!
//! The application is structured around several core modules:
//! - [`cli`] - Command-line interface and argument parsing
//! - [`ingestion`] - Ingestion logging and management functionality
//! - [`substance`] - Substance database and information management
//! - [`database`] - Database entities, migrations, and ORM setup
//! - [`ui`] - Terminal user interface components and themes

#![feature(new_range_api)]
#![allow(unused_imports)]
#![feature(trivial_bounds)]
#![feature(type_alias_impl_trait)]
#![feature(impl_trait_in_bindings)]
#![feature(min_specialization)]
#![feature(negative_impls)]
#![feature(trait_alias)]
#![feature(extern_types)]

use std::fmt::Display;
use std::env;

use chrono::{DateTime, Local};
use chrono_english::Dialect;
use clap::{CommandFactory, Parser};
// Use CompleteEnv from clap_complete::env as per documentation
use clap_complete::env::CompleteEnv;
use clap_complete::Shell;
use cli::Executable;
use miette::{Diagnostic, IntoDiagnostic, Result, miette};
use tracing_subscriber::util::SubscriberInitExt;

use crate::cli::{ApplicationCommands, CommandLineInterface, Displayable, MessageFormat, };
use crate::database::{DATABASE_CONNECTION, migrate_database};
use crate::ingestion::IngestionActions;

mod cli;
pub mod config;
mod database;
mod ingestion;
mod substance;
mod ui;
mod application;

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
use crate::application::{AppResult, Application, ApplicationSession, Phase};

#[derive(Clone)]
struct Session {
	database_connection: &'static sea_orm::DatabaseConnection,
}

impl ApplicationSession for Session {}

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
	let mut session = Session {
		database_connection: &DATABASE_CONNECTION,
	};

	let final_result = match cli.command {
		ApplicationCommands::Ingestion(cmd) => {
			use crate::ingestion::IngestionActions;
			use crate::ingestion::service::{log_ingestion, get_ingestion, list_ingestion};
			use crate::ingestion::analyzer::analyze_ingestion;
			match cmd.commands {
				IngestionActions::Log(log) => {
					match log_ingestion(&log, session.database_connection).await {
						Ok(output) => {
							output.display(cli.format.clone());
							Ok(())
						}
						Err(e) => Err(miette!("{}", e)),
					}
				}
				IngestionActions::List(list) => {
					match list_ingestion(&list).await {
						Ok(output) => {
							crate::cli::ingestion::IngestionList(output).display(cli.format.clone());
							Ok(())
						}
						Err(e) => Err(miette!("{}", e)),
					}
				}
				IngestionActions::Delete(del) => {
					// Fallback: print not implemented
					eprintln!("Delete not implemented in main");
					Ok(()) // Explicitly return Ok(())
				}
				IngestionActions::Update(upd) => {
					// Fallback: print not implemented
					eprintln!("Update not implemented in main");
					Ok(()) // Explicitly return Ok(())
				}
				IngestionActions::View(view) => {
					match get_ingestion(view.ingestion_id).await {
						Ok(Some(output)) => {
							output.display(cli.format.clone());
							Ok(())
						}
						Ok(None) => {
							// eprintln!("Ingestion not found");
							// std::process::exit(1);
							Err(miette!("Ingestion not found"))
						}
						Err(e) => Err(miette!("{}", e)),
					}
				}
				IngestionActions::Analyze(analyze) => {
					match analyze_ingestion(&analyze).await {
						Ok(output) => {
							output.display(cli.format.clone());
							Ok(())
						}
						Err(e) => Err(miette!("{}", e)),
					}
				}
			}
		}
		ApplicationCommands::Substance(cmd) => {
			// Handle special case for listing substance names
			if cmd.list_names {
				let names = crate::cli::substance::get_substance_names().await;
				for name in names {
					println!("{}", name);
				}
				Ok(())
			} else {
				match cmd.execute(&session).await {
					Ok(output) => {
						output.display(cli.format.clone());
						Ok(())
					}
					Err(e) => Err(e), // cmd.execute already returns miette::Result
				}
			}
		}
		ApplicationCommands::Completion(cmd) => {
			match cmd.execute(&session).await {
				Ok(_) => {
					Ok(())
				}
				Err(e) => Err(e), // cmd.execute already returns miette::Result
			}
		}
	};

	final_result
}
