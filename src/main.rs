#![feature(new_range_api)]
#![allow(unused_imports)]

use crate::cli::ApplicationCommands;
use crate::cli::CommandLineInterface;
use crate::cli::Displayable;
use crate::cli::MessageFormat;
use crate::database::DATABASE_CONNECTION;
use crate::database::migrate_database;
use crate::ingestion::IngestionActions;
use crate::statistics::show_statistics;
use r#abstract::CommandHandler;
use chrono::DateTime;
use chrono::Local;
use chrono_english::Dialect;
use clap::Parser;
use error_handling::setup_diagnostics;
use logging::setup_logger;
use miette::IntoDiagnostic;
use miette::Result;
use miette::miette;
use ratatui::Terminal;
use std::fmt::Display;
use tracing_subscriber::util::SubscriberInitExt;

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
mod theme;
mod tui;
mod ui;

use crossterm::ExecutableCommand;
use crossterm::event::DisableMouseCapture;
use crossterm::event::EnableMouseCapture;
use crossterm::terminal::EnterAlternateScreen;
use crossterm::terminal::LeaveAlternateScreen;
use crossterm::terminal::disable_raw_mode;
use crossterm::terminal::enable_raw_mode;
use std::io;

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


#[async_std::main]
async fn main() -> Result<()>
{
    setup_diagnostics();
    let _guard = setup_logger().unwrap();

    migrate_database(&DATABASE_CONNECTION)
        .await
        .expect("Database database failed");

    // TODO: Perform a check of completion scripts existence and update them or
    // install them https://askubuntu.com/a/1188315
    // https://github.com/scop/bash-completion#faq
    // https://apple.github.io/swift-argument-parser/documentation/argumentparser/installingcompletionscripts/
    // https://unix.stackexchange.com/a/605051

    // let no_args_provided = env::args().len() == 1;
    // let is_interactive_terminal = atty::is(Stream::Stdout);
    //
    // if no_args_provided && is_interactive_terminal
    // {
    //     return tui::run();
    // }

    let cli = CommandLineInterface::parse();

    let context = Application {
        database_connection: &DATABASE_CONNECTION,
        stdout_format: cli.format,
    };

    match cli.command
    {
        | ApplicationCommands::Ingestion(cmd) => match &cmd.commands
        {
            | IngestionActions::Log(log_ingestion) =>
            {
                let ingestion = crate::ingestion::service::log_ingestion(log_ingestion)
                    .await
                    .map_err(|e| miette!(e))?;

                ingestion.display(context.stdout_format);
                Ok(())
            }
            | IngestionActions::List(list_ingestions) => list_ingestions.handle(context).await,
            | IngestionActions::Delete(delete_ingestion) => delete_ingestion.handle(context).await,
            | IngestionActions::Update(update_ingestion) => update_ingestion.handle(context).await,
            | IngestionActions::View(view_ingestion) =>
            {
                let ingestion =
                    crate::ingestion::service::get_ingestion(view_ingestion.ingestion_id)
                        .await
                        .map_err(|e| miette!(e))?;

                if let Some(ingestion) = ingestion
                {
                    ingestion.display(context.stdout_format);
                    Ok(())
                }
                else
                {
                    Err(miette!(
                        "Ingestion with ID {} not found",
                        view_ingestion.ingestion_id
                    ))
                }
            }
        },
        | ApplicationCommands::Substance(cmd) => cmd.handle(context).await,
        | ApplicationCommands::Stats(cmd) =>
        {
            show_statistics(&cmd).await;
            Ok(())
        }
        | ApplicationCommands::Prominence(cmd) =>
        {
            cli::prominence::handle_prominence_command(&cmd).await
        }
        | ApplicationCommands::Monitor => run_tui().await,
    }
}

async fn run_tui() -> Result<()>
{
    // Setup terminal
    enable_raw_mode().into_diagnostic()?;
    let mut stdout = io::stdout();
    stdout.execute(EnterAlternateScreen).into_diagnostic()?;
    stdout.execute(EnableMouseCapture).into_diagnostic()?;
    let backend = ratatui::backend::CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend).into_diagnostic()?;

    // Create app and run it
    let mut app = tui::App::new().await?;

    terminal.clear().into_diagnostic()?;

    // Set terminal background color to Catppuccin Mocha base
    terminal
        .backend_mut()
        .execute(crossterm::style::SetBackgroundColor(
            crossterm::style::Color::from((30, 30, 46)),
        ))
        .into_diagnostic()?;

    while app.running
    {
        terminal
            .draw(|f| tui::ui::ui(f, &app))
            .map_err(|e| miette!(e))?;
        app.run()?;
    }

    // Restore terminal
    disable_raw_mode().into_diagnostic()?;
    terminal
        .backend_mut()
        .execute(LeaveAlternateScreen)
        .into_diagnostic()?;
    terminal
        .backend_mut()
        .execute(DisableMouseCapture)
        .into_diagnostic()?;
    terminal.show_cursor().into_diagnostic()?;

    Ok(())
}
