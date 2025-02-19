use crate::cli::MessageFormat;
use crate::cli::formatter::Formatter;
use crate::cli::formatter::FormatterVector;
use crate::core::CommandHandler;
use crate::core::QueryHandler;
use crate::database::entities::ingestion;
use crate::database::entities::ingestion::Entity as Ingestion;
use crate::database::entities::ingestion::Model;
use crate::database::entities::ingestion_phase;
use crate::database::entities::ingestion_phase::Entity as IngestionPhase;
use crate::ingestion::command::DeleteIngestion;
use crate::ingestion::command::LogIngestion;
use crate::ingestion::command::UpdateIngestion;
use crate::ingestion::query::AnalyzeIngestion;
use crate::ingestion::service::IngestionService;
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::phase::PhaseClassification;
use crate::substance::route_of_administration::phase::PhaseIcon;
use crate::utils::AppContext;
use crate::utils::DATABASE_CONNECTION;
use crate::utils::parse_date_string;
use crate::visualization::TimeSeriesData;
use crate::visualization::plot_ingestion_phases;
use async_std::task;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::NaiveDateTime;
use chrono::TimeZone;
use chrono_humanize::Accuracy;
use chrono_humanize::HumanTime;
use chrono_humanize::Humanize;
use chrono_humanize::Tense;
use clap::Parser;
use clap::Subcommand;
use crossterm::style::Color::Rgb;
use indicatif::ProgressBar;
use indicatif::ProgressStyle;
use miette::IntoDiagnostic;
use miette::miette;
use owo_colors::OwoColorize;
use owo_colors::colors::xterm::White;
use owo_colors::style;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use sea_orm_migration::IntoSchemaManagerConnection;
use serde::Deserialize;
use serde::Serialize;
use std::cmp::Ordering;
use std::collections::BTreeMap;
use std::fmt::Debug;
use std::fmt::Display;
use std::range::Range;
use std::str::FromStr;
use tabled::Table;
use tabled::Tabled;
use tabled::settings::Alignment;
use tabled::settings::Modify;
use tabled::settings::Padding;
use tabled::settings::Style;
use tabled::settings::object::Columns;
use tabled::settings::object::Segment;
use termimad::MadSkin;
use termimad::rgb;
use textplots::Chart;
use textplots::Plot;
use textplots::Shape;
use tracing::Level;
use tracing::event;
use tracing::info;
use uuid::Uuid;

#[async_trait]
impl CommandHandler for UpdateIngestion
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        if Ingestion::find_by_id(self.ingestion_identifier)
            .one(ctx.database_connection)
            .await
            .into_diagnostic()?
            .is_none()
        {
            return Err(miette!(
                "Ingestion with ID {} not found",
                self.ingestion_identifier
            ));
        }

        let updated_model = ingestion::ActiveModel {
            id: ActiveValue::Set(self.ingestion_identifier),
            substance_name: self
                .substance_name
                .as_ref()
                .map(|name| ActiveValue::Set(name.clone()))
                .unwrap_or(ActiveValue::NotSet),
            dosage: self
                .dosage
                .as_ref()
                .map(|dosage| ActiveValue::Set(dosage.as_base_units() as f32))
                .unwrap_or(ActiveValue::NotSet),
            route_of_administration: self
                .route_of_administration
                .as_ref()
                .map(|roa| ActiveValue::Set(serde_json::to_string(roa).unwrap()))
                .unwrap_or(ActiveValue::NotSet),
            ingested_at: self
                .ingestion_date
                .as_ref()
                .map(|date| ActiveValue::Set(date.to_utc().naive_local()))
                .unwrap_or(ActiveValue::NotSet),
            updated_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
            ..Default::default()
        };

        let updated_record = updated_model
            .update(ctx.database_connection)
            .await
            .into_diagnostic()?;

        // Re-analyze the updated ingestion to get complete data
        let analysis_query = AnalyzeIngestion::builder()
            .substance(updated_record.substance_name.clone())
            .date(Local.from_utc_datetime(&updated_record.ingested_at))
            .dosage(Dosage::from_base_units(updated_record.dosage as f64))
            .roa(
                updated_record
                    .route_of_administration
                    .parse()
                    .unwrap_or(RouteOfAdministrationClassification::Oral),
            )
            .ingestion_id(updated_record.id)
            .build();

        info!(
            "Successfully updated ingestion with ID {}.",
            self.ingestion_identifier
        );

        match analysis_query.query().await
        {
            | Ok(analysis) =>
            {
                println!(
                    "{}",
                    IngestionViewModel::from(analysis).format(ctx.stdout_format)
                );
            }
            | Err(e) =>
            {
                event!(
                    name: "ingestion_analysis_failed",
                    Level::WARN,
                    error = ?e,
                    ingestion_id = updated_record.id
                );
                println!(
                    "{}",
                    IngestionViewModel::from(updated_record).format(ctx.stdout_format)
                );
            }
        }

        Ok(())
    }
}

#[derive(Parser, Debug)]
#[command(version, about = "List all ingestions", long_about, aliases = vec!["ls", "get"])]
pub struct ListIngestion
{
    /// Defines the amount of ingestion to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub limit: u64,
}

#[async_trait]
impl CommandHandler for ListIngestion
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        let ingestions = Ingestion::find()
            .order_by_desc(ingestion::Column::IngestedAt)
            .limit(Some(self.limit))
            .all(ctx.database_connection)
            .await
            .map_err(|e| e.to_string())
            .unwrap()
            .iter()
            .map(|i| IngestionViewModel::from(i.clone()))
            .collect();

        println!(
            "{}",
            FormatterVector::new(ingestions).format(ctx.stdout_format)
        );

        Ok(())
    }
}


#[async_trait]
impl CommandHandler for DeleteIngestion
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        let delete_ingestion = Ingestion::delete_by_id(self.ingestion_id)
            .exec(ctx.database_connection)
            .await;

        if delete_ingestion.is_err()
        {
            return Err(miette!(
                "Failed to delete ingestion: {}",
                &delete_ingestion.unwrap_err()
            ));
        }

        info!(
            "Successfully deleted ingestion with ID {}.",
            self.ingestion_id
        );

        Ok(())
    }
}

#[derive(Parser, Debug)]
#[command(version, about = "Get a single ingestion by ID")]
pub struct GetIngestion
{
    /// ID of the ingestion to retrieve
    #[arg(index = 1, value_name = "INGESTION_ID")]
    pub ingestion_id: i32,
}

#[async_trait]
impl CommandHandler for GetIngestion
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        let ingestion = Ingestion::find_by_id(self.ingestion_id)
            .one(ctx.database_connection)
            .await
            .into_diagnostic()?
            .ok_or_else(|| miette::miette!("Ingestion with ID {} not found", self.ingestion_id))?;

        let analysis_query = AnalyzeIngestion::builder()
            .substance(ingestion.substance_name.clone())
            .date(Local.from_utc_datetime(&ingestion.ingested_at))
            .dosage(Dosage::from_base_units(ingestion.dosage as f64))
            .roa(
                ingestion
                    .route_of_administration
                    .parse()
                    .unwrap_or(RouteOfAdministrationClassification::Oral),
            )
            .ingestion_id(ingestion.id)
            .build();

        match analysis_query.query().await
        {
            | Ok(analysis) =>
            {
                let view_model = IngestionViewModel::from(analysis.clone());
                println!("{}", view_model.format(ctx.stdout_format));
                crate::visualization::plot_ingestion_phases(&analysis.phases);
            }
            | Err(e) =>
            {
                event!(
                    name: "ingestion_analysis_failed",
                    Level::WARN,
                    error = ?e,
                    ingestion_id = ingestion.id
                );
                println!(
                    "{}",
                    IngestionViewModel::from(ingestion).format(ctx.stdout_format)
                );
            }
        }

        Ok(())
    }
}

#[derive(Debug, Subcommand)]
pub enum IngestionCommands
{
    /// Create a new ingestion record
    Log(LogIngestion),
    /// List all ingestions
    List(ListIngestion),
    /// Delete an ingestion
    Delete(DeleteIngestion),
    /// Update an existing ingestion
    Update(UpdateIngestion),
    /// Show a single ingestion by ID
    View(GetIngestion),
}

#[derive(Debug, Parser)]
pub struct IngestionCommand
{
    #[command(subcommand)]
    commands: IngestionCommands,
}

#[async_trait]
impl CommandHandler for IngestionCommand
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        match &self.commands
        {
            | IngestionCommands::Log(log_ingestion) =>
            {
                let analysis = IngestionService::log(log_ingestion)
                    .await
                    .map_err(|e| miette!(e))?;

                // Immediately display the complete ingestion data including phases
                let message = IngestionViewModel::from(analysis.clone()).format(ctx.stdout_format);
                println!("{}", message);

                plot_ingestion_phases(&analysis.phases);

                Ok(())
            }
            | IngestionCommands::List(list_ingestions) => list_ingestions.handle(ctx).await,
            | IngestionCommands::Delete(delete_ingestion) => delete_ingestion.handle(ctx).await,
            | IngestionCommands::Update(update_ingestion) => update_ingestion.handle(ctx).await,
            | IngestionCommands::View(get_ingestion) => get_ingestion.handle(ctx).await,
        }
    }
}

fn display_date(date: &DateTime<Local>) -> String { HumanTime::from(*date).to_string() }

#[derive(Debug, Serialize, Tabled, bon::Builder)]
struct IngestionViewModel
{
    #[tabled(rename = "ID")]
    pub id: i32,
    #[tabled(rename = "Substance")]
    pub substance_name: String,
    #[tabled(rename = "ROA")]
    pub route: String,
    #[tabled(rename = "Dosage")]
    pub dosage: String,
    #[tabled(rename = "Ingestion Date")]
    #[tabled(display_with = "display_date")]
    pub ingested_at: DateTime<Local>,
    #[tabled(rename = "Dosage Classification")]
    pub dosage_classification: String,
    #[tabled(skip)]
    pub phases: Vec<Phase>,
}

#[derive(Debug, Serialize, bon::Builder, Clone)]
struct Phase
{
    pub classification: PhaseClassification,
    pub start_time: DateRange,
    pub end_time: DateRange,
    pub duration: DurationRange,
    #[serde(skip)]
    pub icon: PhaseIcon,
    pub weight: f32,
}

#[derive(Debug, Serialize, bon::Builder, Clone)]
struct DateRange
{
    min: DateTime<Local>,
    max: DateTime<Local>,
}

#[derive(Debug, Serialize, bon::Builder, Clone)]
pub struct DurationRange
{
    start: Duration,
    end: Duration,
}

impl Display for DurationRange
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result
    {
        let avg_duration =
            Duration::seconds((self.start.num_seconds() + self.end.num_seconds()) / 2);
        let duration_diff = (self.end.num_seconds() - self.start.num_seconds()).abs() / 2;
        if self.start == self.end
        {
            write!(f, "{}", self.start.humanize())
        }
        else
        {
            if avg_duration.num_hours() > 0
            {
                let diff_hours = duration_diff as f64 / 3600.0;
                write!(f, "{} ±{:.1}h", avg_duration.humanize(), diff_hours)
            }
            else
            {
                write!(f, "{} ±{}m", avg_duration.humanize(), duration_diff / 60)
            }
        }
    }
}

/// Formats a date range into a concise human-readable string based on its
/// relation to the ingestion date.
///
/// The function takes a reference to a `DateRange` (which contains a minimum
/// and maximum `DateTime<Local>`) and a reference to an ingestion date
/// (`DateTime<Local>`). It performs the following actions:
///
/// 1. Defines a closure (`format_time`) that formats a given date as follows:
///    - If the date falls on the same day as the ingestion date, formats it as
///      `HH:MM`.
///    - Otherwise, formats it as `YYYY-MM-DD HH:MM`.
///
/// 2. Applies this closure to both the minimum (`min`) and maximum (`max`)
///    dates of the range.
///
/// 3. Compares the formatted `min` and `max` strings:
///    - If they are identical, returns the formatted date (indicating that both
///      dates fall at the same formatted point).
///    - If they differ, calculates the difference in minutes between `max` and
///      `min`.
///       - If the difference is 60 minutes or more, converts the difference to
///         hours (with one decimal precision) and returns a string in the
///         format: `<min_str> ±<hours>h`.
///       - If the difference is less than 60 minutes, returns a string in the
///         format: `<min_str> ±<minutes>m`.
fn format_date_range(range: &DateRange, ingestion_date: &DateTime<Local>) -> String
{
    let format_time = |dt: &DateTime<Local>| {
        if dt.date_naive() == ingestion_date.date_naive()
        {
            dt.format("%H:%M").to_string()
        }
        else
        {
            dt.format("%Y-%m-%d %H:%M").to_string()
        }
    };

    let min_str = format_time(&range.min);
    let max_str = format_time(&range.max);

    if min_str == max_str
    {
        min_str
    }
    else
    {
        let time_diff = (range.max - range.min).num_minutes();

        if time_diff >= 60
        {
            let hours = time_diff as f64 / 60.0;
            format!("{} ±{:.1}h", min_str, hours)
        }
        else
        {
            format!("{} ±{}m", min_str, time_diff)
        }
    }
}


impl Formatter for IngestionViewModel
{
    fn pretty(&self) -> String
    {
        let mut skin = MadSkin::default();
        skin.set_fg(rgb(248, 248, 242)); // Base text (off\-white)
        skin.bold.set_fg(rgb(224, 108, 117)); // Bold (soft red)
        skin.italic.set_fg(rgb(80, 250, 123)); // Italic (vivid green)
        skin.headers[0].set_fg(rgb(189, 147, 249)); // Main header (pastel purple)
        skin.headers[1].set_fg(rgb(139, 233, 253)); // Sub header (pastel cyan)
        skin.paragraph.set_fg(rgb(248, 248, 242)); // Paragraph text (off\-white)
        skin.table.set_fg(rgb(224, 108, 117)); // Table texts (soft red)

        let mut output = String::new();

        output.push_str(&skin.text(&self.render_header(), None).to_string());
        output.push_str(
            &skin
                .text(&self.render_ingestion_information(), None)
                .to_string(),
        );
        output.push_str(&skin.text(&self.render_progress_section(), None).to_string());
        output.push_str(&skin.text(&self.render_phases_timeline(), None).to_string());

        output
    }
}

impl IngestionViewModel
{
    // Header could be something like this I think
    //
    // Ingestion #70 | Oral | 90.0 mg | 18 minutes ago
    // Status: Comeup (7%) [▶──────]...........
    // ─────────────────────────────────────────────
    //
    // Or this...
    //
    // ┌─────────────────────────────┬───────────────────────┐
    // │ Ingestion #70 | Oral        │ Status: Comeup (7%)   │
    // │ 90.0 mg | 18 min ago        │ [▶──────────────]     │
    // └─────────────────────────────┴───────────────────────┘
    //
    /// Render a top-level header with more pronounced styling.
    fn render_header(&self) -> String
    {
        let mut substance = self.substance_name.clone();
        if let Some(first) = substance.chars().next()
        {
            let first_upper = first.to_uppercase().to_string();
            substance.replace_range(0..first.len_utf8(), &first_upper);
        }

        format!("\n\n# Ingestion #{}\n\n", self.id)
    }

    // Potential Design Inspiration for Administration Section Display:

    // 1. Compact Single-Line:
    // Administered: [Date/Time] | [Route] | [Dosage]  (e.g., 2024-07-27 10:30:00 |
    // Oral | 100mg)

    // 2. Two-Line Format:
    // Date/Time: [Date/Time]  Route: [Route]
    // Dosage: [Dosage]

    // 3. Table-like Layout:
    // Date/Time:      [Date/Time]
    // Route:          [Route]
    // Dosage:         [Dosage]

    // 4. Markdown List:
    // - **Date/Time:** [Date/Time]
    // - **Route:** [Route]
    // - **Dosage:** [Dosage]

    // 5. Key-Value Pairs:
    // Date/Time = [Date/Time]
    // Route = [Route]
    // Dosage = [Dosage]

    /// Render the Administration section.
    fn render_ingestion_information(&self) -> String
    {
        format!(
            "**Date/Time:** {} (Now)\n**Route:** {}\n**Dosage:** {}\n\n",
            self.ingested_at.format("%Y-%m-%d %H:%M:%S"),
            self.route,
            self.dosage,
        )
    }

    /// Render the Progress section with a progress bar.
    fn render_progress_section(&self) -> String
    {
        let status = self
            .get_current_phase()
            .map_or("Not started".to_string(), |phase| {
                phase.classification.to_string()
            });
        let percentage = self.progress_percentage();
        let bar = self.generate_fancy_progress_bar(percentage);
        format!("Status: {} ({}%)\n[{}]\n\n", status, percentage, bar)
    }

    fn render_phases_timeline(&self) -> String
    {
        let mut timeline = String::new();
        timeline.push_str("## Phases\n\n");
        let phase_strs: Vec<String> = self
            .phases
            .iter()
            .map(|phase| {
                format!(
                    "● {}: {} ({} - {})",
                    phase.classification.to_string(),
                    phase.duration.to_string(),
                    format_date_range(&phase.start_time, &self.ingested_at),
                    format_date_range(&phase.end_time, &self.ingested_at)
                )
            })
            .collect();
        timeline.push_str(&phase_strs.join("\n"));
        timeline
    }
    fn generate_fancy_progress_bar(&self, percentage: u8) -> String
    {
        let width = 15;
        let filled = ((percentage as f32 / 100.0) * width as f32) as usize;
        let empty = width - filled;

        let mut bar = String::with_capacity(width);
        if filled > 0
        {
            bar.push_str(&"─".repeat(filled - 1));
            bar.push('▶');
        }
        bar.push_str(&"─".repeat(empty));
        bar
    }

    fn get_current_phase(&self) -> Option<&Phase>
    {
        let now = Local::now();
        self.phases
            .iter()
            .find(|phase| now >= phase.start_time.min && now <= phase.end_time.max)
    }
}

impl From<Model> for IngestionViewModel
{
    fn from(model: Model) -> Self
    {
        let dosage = Dosage::from_base_units(model.dosage.into());
        let route_enum: RouteOfAdministrationClassification =
            model.route_of_administration.parse().unwrap_or_default();
        let local_ingestion_date = Local::from_utc_datetime(&Local, &model.ingested_at);

        Self::builder()
            .id(model.id)
            .substance_name(model.substance_name)
            .route(RouteOfAdministrationClassification::to_string(&route_enum))
            .dosage(dosage.to_string())
            .ingested_at(local_ingestion_date)
            .dosage_classification(
                model
                    .dosage_classification
                    .map_or("n/a".to_string(), |c| c.to_string()),
            )
            .phases(vec![])
            .build()
    }
}

impl From<crate::ingestion::model::Ingestion> for IngestionViewModel
{
    fn from(model: crate::ingestion::model::Ingestion) -> Self
    {
        let phases = model
            .phases
            .into_iter()
            .map(|phase| {
                Phase::builder()
                    .classification(phase.class)
                    .start_time(
                        DateRange::builder()
                            .min(phase.start_time.start)
                            .max(phase.start_time.end)
                            .build(),
                    )
                    .end_time(
                        DateRange::builder()
                            .min(phase.end_time.start)
                            .max(phase.end_time.end)
                            .build(),
                    )
                    .duration(
                        DurationRange::builder()
                            .start(phase.duration.start)
                            .end(phase.duration.end)
                            .build(),
                    )
                    .icon(PhaseIcon::from(&phase.class))
                    .weight(phase.weight.try_into().unwrap_or(0.0))
                    .build()
            })
            .collect();

        Self::builder()
            .id(model.id.unwrap_or(0))
            .substance_name(model.substance_name)
            .route(RouteOfAdministrationClassification::to_string(&model.route))
            .dosage(model.dosage.to_string())
            .ingested_at(model.ingestion_date)
            .dosage_classification(
                model
                    .dosage_classification
                    .map_or("n/a".to_string(), |c| c.to_string()),
            )
            .phases(phases)
            .build()
    }
}

impl IngestionViewModel
{
    /// Calculates the progress from onset to end of comedown as a percentage.
    pub fn progress_percentage(&self) -> u8
    {
        // Ensure there are phases to calculate progress
        if self.phases.is_empty()
        {
            return 0;
        }

        // Find onset and comedown phases
        let onset = self
            .phases
            .iter()
            .find(|p| p.classification == PhaseClassification::Onset);
        let comedown = self
            .phases
            .iter()
            .find(|p| p.classification == PhaseClassification::Comedown);

        if let (Some(onset_phase), Some(comedown_phase)) = (onset, comedown)
        {
            let total_duration = comedown_phase.end_time.max - onset_phase.start_time.min;
            let elapsed = Local::now() - onset_phase.start_time.min;

            match elapsed.partial_cmp(&total_duration)
            {
                | Some(Ordering::Greater) | Some(Ordering::Equal) => 100,
                | Some(Ordering::Less) =>
                {
                    ((elapsed.num_seconds() as f64 / total_duration.num_seconds() as f64) * 100.0)
                        as u8
                }
                | None => 0,
            }
        }
        else
        {
            0
        }
    }
}
