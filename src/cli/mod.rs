use crate::Application;
use crate::config::VERSION;
use crate::database::entities::ingestion::Column as IngestionColumn;
use crate::database::entities::ingestion::Entity as IngestionEntity;
use crate::database::entities::ingestion_phase::Column as IngestionPhaseColumn;
use crate::database::entities::ingestion_phase::Entity as IngestionPhaseEntity;
use crate::ingestion::LogIngestion;
use atty::Stream;
use chrono::Duration;
use chrono::NaiveDateTime;
use chrono::Utc;
use clap::ColorChoice;
use clap::CommandFactory;
use clap::Parser;
use clap::Subcommand;
use ingestion::IngestionCommand;
use json_to_table::json_to_table;
use miette::IntoDiagnostic;
use minimo::Printable;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::prelude::*;
use serde::Serialize;
use serde_json::json;
use std::collections::HashMap;
use std::fmt::Debug;
use std::fmt::Display;
use substance::SubstanceCommand;
use tabled::Table;
use tabled::Tabled;
use tabled::settings::Style;
use textplots::Chart;
use textplots::Plot;
use textplots::Shape;
use tracing::log::Log;
mod ingestion;
pub mod substance;

fn is_interactive() -> bool { atty::is(Stream::Stdout) }

// TODO: Markdown?
// TODO: TUI?
// TODO: CSV?
#[derive(clap::ValueEnum, Clone, Debug)]
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
        if is_interactive()
        {
            MessageFormat::Pretty
        }
        else
        {
            MessageFormat::Json
        }
    }
}

trait PrettyPrintable: Printable
{
    fn print(&self) {}
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
        let formatted_output = match format
        {
            | MessageFormat::Pretty => self.as_pretty(),
            | MessageFormat::Json => self.as_json(),
        };

        println!("{}", formatted_output);
    }
}

#[derive(Subcommand)]
pub(crate) enum ApplicationCommands
{
    /// Manage ingestion entries
    Ingestion(IngestionCommand),
    #[command(hide = true)]
    Substance(SubstanceCommand),
    Stats(crate::statistics::ShowStatistics),
    /// Launch the TUI monitor for ingestion intensity
    Monitor,
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
    pub(crate) command: ApplicationCommands,

    /// Pretty-print or return raw version of data in JSON
    #[arg(short, long = "format", value_enum, default_value_t = MessageFormat::default())]
    pub format: MessageFormat,

    #[command(flatten)]
    verbose: clap_verbosity_flag::Verbosity,
}
