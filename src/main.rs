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

use chrono::{DateTime, Local};
use chrono_english::Dialect;
use clap::{CommandFactory, Parser};
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
	let cli = CommandLineInterface::parse();
	let mut session = Session {
		database_connection: &DATABASE_CONNECTION,
	};

	match cli.command {
		ApplicationCommands::Ingestion(cmd) => {
			use crate::ingestion::IngestionActions;
			use crate::ingestion::service::{log_ingestion, get_ingestion, list_ingestion};
			use crate::ingestion::analyzer::analyze_ingestion;
			match cmd.commands {
				IngestionActions::Log(log) => {
					let result = log_ingestion(&log, session.database_connection).await;
					match result {
						Ok(output) => output.display(cli.format.clone()),
						Err(e) => eprintln!("{}", e.to_string()),
					}
				}
				IngestionActions::List(list) => {
					let result = list_ingestion(&list).await;
					match result {
						Ok(output) => crate::cli::ingestion::IngestionList(output).display(cli.format.clone()),
						Err(e) => eprintln!("{}", e.to_string()),
					}
				}
				IngestionActions::Delete(del) => {
					// Fallback: print not implemented
					eprintln!("Delete not implemented in main");
				}
				IngestionActions::Update(upd) => {
					// Fallback: print not implemented
					eprintln!("Update not implemented in main");
				}
				IngestionActions::View(view) => {
					let result = get_ingestion(view.ingestion_id).await;
					match result {
						Ok(Some(output)) => output.display(cli.format.clone()),
						Ok(None) => {
							eprintln!("Ingestion not found");
							std::process::exit(1);
						}
						Err(e) => eprintln!("{}", e.to_string()),
					}
				}
				IngestionActions::Analyze(analyze) => {
					let result = analyze_ingestion(&analyze).await;
					match result {
						Ok(output) => output.display(cli.format.clone()),
						Err(e) => eprintln!("{}", e.to_string()),
					}
				}
			}
		}
		ApplicationCommands::Substance(cmd) => {
			let result = cmd.execute(&session).await;
			match result {
				Ok(output) => output.display(cli.format.clone()),
				Err(e) => eprintln!("{}", e.to_string()),
			}
		}
		ApplicationCommands::Completion { shell } => {
			let mut cmd = CommandLineInterface::command();
			clap_complete::generate(shell, &mut cmd, "neuronek", &mut std::io::stdout());
		}
	}

	Ok(())
}
