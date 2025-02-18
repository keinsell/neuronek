use crate::cli::ingestion::IngestionCommands;
use crate::core::CommandHandler;
use crate::database::entities::ingestion::Column as IngestionColumn;
use crate::database::entities::ingestion::Entity as IngestionEntity;
use crate::database::entities::ingestion_phase::Column as IngestionPhaseColumn;
use crate::database::entities::ingestion_phase::Entity as IngestionPhaseEntity;
use crate::ingestion::LogIngestion;
use crate::utils::AppContext;
use atty::Stream;
use chrono::Duration;
use chrono::NaiveDateTime;
use chrono::Utc;
use clap::ColorChoice;
use clap::CommandFactory;
use clap::Parser;
use clap::Subcommand;
use ingestion::IngestionCommand;
use journal::ViewJournal;
use miette::IntoDiagnostic;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::prelude::*;
use std::collections::HashMap;
use substance::SubstanceCommand;
use textplots::Chart;
use textplots::Plot;
use textplots::Shape;
use tracing::log::Log;
pub mod formatter;
mod ingestion;
mod journal;
mod parser;
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

#[async_trait::async_trait]
impl CommandHandler for ApplicationCommands
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        match self
        {
            | ApplicationCommands::Ingestion(cmd) => cmd.handle(ctx).await,
            | ApplicationCommands::Substance(cmd) => cmd.handle(ctx).await,
            | ApplicationCommands::Journal(cmd) => cmd.handle(ctx).await,
        }
    }
}


#[derive(Subcommand)]
pub(crate) enum ApplicationCommands
{
    /// Manage ingestion entries
    Ingestion(IngestionCommand),
    #[command(hide = true)]
    Substance(SubstanceCommand),
    /// View today's ingestion journal
    Journal(ViewJournal),
}

#[derive(Parser)]
#[command(
    version = env!("CARGO_PKG_VERSION"),
    long_about = "🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body.",
    about = "🧬 Intelligent dosage tracker",
    color = ColorChoice::Auto,
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
