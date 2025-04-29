use std::fmt::{Debug, Display};

use atty::Stream;
use clap::{ColorChoice, CommandFactory, Parser, Subcommand, arg, command};
use miette::IntoDiagnostic;
use minimo::Printable;
use sea_orm::prelude::*;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, QueryOrder};
use serde::Serialize;
use tabled::settings::Style;
use tabled::{Table, Tabled};
use textplots::Plot;
use tracing::log::Log;

use crate::config::VERSION;
pub mod formulation;
pub mod ingestion;
pub mod substance;

use crate::r#abstract::CommandHandler;

pub fn is_interactive() -> bool { atty::is(Stream::Stdout) }

// TODO: Markdown?
// TODO: TUI?
// TODO: CSV?
#[derive(clap::ValueEnum, Clone, Debug, Copy)]
/// The output format specifies how application data is presented:
///
/// - `Pretty`: Used in interactive shells to display data in a visually
///   appealing table format.
/// - `Json`: Used in non-interactive shells (e.g., scripts or when data is
///   piped) to provide raw JSON for automated parsing.
pub enum MessageFormat
{
	/// Pretty printed tables
	Pretty,
	/// JSON formatted output
	Json,
	// TODO: Application may support custom templates like liquidless or smth
}

impl Default for MessageFormat
{
	fn default() -> Self
	{
		if is_interactive() {
			MessageFormat::Pretty
		} else {
			MessageFormat::Json
		}
	}
}

/// TODO: Display in alternative screen vs direct
pub trait Displayable: Serialize + Sized + Debug
{
	fn as_json(&self) -> String { serde_json::to_string(self).unwrap() }
	fn as_table(&self) -> String
	where Self: Tabled
	{
		let mut table = Table::new(vec![self]);
		table.with(Style::modern_rounded());
		table.to_string()
	}
	fn as_debug(&self) -> String { format!("{:?}", self) }

	fn as_pretty(&self) -> String { self.as_debug() }

	fn display(&self, format: MessageFormat)
	{
		let formatted_output = match format {
			| MessageFormat::Pretty => self.as_pretty(),
			| MessageFormat::Json => self.as_json(),
		};

		println!("{}", formatted_output.trim());
	}
}

#[derive(clap::Subcommand)]
pub enum ApplicationCommands
{
	/// Manage ingestion entries
	Ingestion(ingestion::IngestionCommand),
	#[command(hide = true)]
	Substance(substance::SubstanceCommand),
	Formulation(formulation::Command),
	/// Generate shell completion scripts
	#[command(hide = true)]
	Completion
	{
		/// The shell to generate completions for
		#[arg(value_enum)]
		shell: clap_complete::Shell,
	},
}

#[derive(Parser)]
#[command(
    version = env!("CARGO_PKG_VERSION"),
    long_about = "🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body.",
    about = "🧬 Intelligent dosage tracker",
    color = ColorChoice::Auto,
    version=VERSION
)]
pub struct CommandLineInterface
{
	#[command(subcommand)]
	pub command: ApplicationCommands,

	/// Pretty-print or return raw version of data in JSON
	#[arg(short, long = "format", value_enum, default_value_t = MessageFormat::default())]
	pub format: MessageFormat,

	#[command(flatten)]
	verbose: clap_verbosity_flag::Verbosity,
}
