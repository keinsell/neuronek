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
use crate::ingestion::command::LogIngestion;
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
use indicatif::ProgressBar;
use indicatif::ProgressStyle;
use miette::IntoDiagnostic;
use miette::miette;
use owo_colors::OwoColorize;
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

#[derive(Parser, Debug)]
#[command(version, about = "Update an existing ingestion", aliases = vec![ "edit"])]
pub struct UpdateIngestion
{
    /// ID of the ingestion to update
    #[arg(index = 1, value_name = "INGESTION_ID")]
    pub ingestion_identifier: i32,

    /// New name of the substance.rs (optional)
    #[arg(short = 'n', long = "name", value_name = "SUBSTANCE_NAME")]
    pub substance_name: Option<String>,

    /// New dosage (optional, e.g., 20 mg)
    #[arg(short = 'd', long = "dosage", value_name = "DOSAGE", value_parser=Dosage::from_str)]
    pub dosage: Option<Dosage>,

    /// New ingestion date (optional, e.g., "today 10:00")
    #[arg(short = 't', long = "date", value_name = "INGESTION_DATE", value_parser=parse_date_string
    )]
    pub ingestion_date: Option<DateTime<Local>>,

    /// New route of administration (optional, defaults to "oral")
    #[arg(short = 'r', long = "roa", value_enum)]
    pub route_of_administration: Option<RouteOfAdministrationClassification>,
}

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

#[derive(Parser, Debug)]
#[command(version, about = "Delete selected ingestion", long_about, aliases = vec!["rm", "del",
                                                                                   "remove"])]
pub struct DeleteIngestion
{
    #[arg(
        index = 1,
        value_name = "INGESTION_ID",
        help = "ID of the ingestion to delete"
    )]
    pub ingestion_id: i32,
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
                let message = IngestionViewModel::from(analysis).format(ctx.stdout_format);
                println!("{}", message);
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
        // Calculate average duration
        let avg_duration =
            Duration::seconds((self.start.num_seconds() + self.end.num_seconds()) / 2);

        // Calculate the difference from the average
        let duration_diff = (self.end.num_seconds() - self.start.num_seconds()).abs() / 2;

        // If start and end are the same, just display the duration
        if self.start == self.end
        {
            write!(f, "{}", self.start.humanize())
        }
        else
        {
            // Decide whether to use hours or minutes
            if avg_duration.num_hours() > 0
            {
                // Convert duration_diff to hours
                let diff_hours = duration_diff as f64 / 3600.0;
                write!(f, "{} ±{:.1}h", avg_duration.humanize(), diff_hours)
            }
            else
            {
                // Display average duration with ± range in minutes
                write!(f, "{} ±{}m", avg_duration.humanize(), duration_diff / 60)
            }
        }
    }
}

// Helper function to format DateRange concisely
fn format_date_range(range: &DateRange, ingestion_date: &DateTime<Local>) -> String
{
    let min_str = if range.min.date_naive() == ingestion_date.date_naive()
    {
        range.min.format("%H:%M").to_string()
    }
    else
    {
        range.min.format("%Y-%m-%d %H:%M").to_string()
    };
    let max_str = if range.max.date_naive() == ingestion_date.date_naive()
    {
        range.max.format("%H:%M").to_string()
    }
    else
    {
        range.max.format("%Y-%m-%d %H:%M").to_string()
    };

    // If min and max are the same, just return the time
    if min_str == max_str
    {
        min_str
    }
    else
    {
        // Calculate the time difference
        let time_diff = (range.max - range.min).num_minutes();

        // If time difference is large (more than 60 minutes), use hours
        if time_diff >= 60
        {
            let time_diff_hours = time_diff as f64 / 60.0;
            format!("{} ±{:.1}h", min_str, time_diff_hours)
        }
        else
        {
            // Otherwise, use minutes
            format!("{} ±{}m", min_str, time_diff)
        }
    }
}

#[derive(Debug, Serialize, Tabled)]
struct PhaseRow
{
    #[tabled(rename = "Phase")]
    phase: String,
    #[tabled(rename = "Duration")]
    duration: String,
    #[tabled(rename = "Start Time")]
    start_time: String,
    #[tabled(rename = "End Time")]
    end_time: String,
}

impl Formatter for IngestionViewModel
{
    fn pretty(&self) -> String
    {
        let mut skin = MadSkin::default();

        // Tokyo Night inspired colors
        skin.set_fg(rgb(169, 177, 214)); // Base text color
        skin.bold.set_fg(rgb(192, 202, 245)); // Bold text
        skin.italic.set_fg(rgb(125, 207, 255)); // Italic text
        skin.headers[0].set_fg(rgb(187, 154, 247)); // Main header
        skin.headers[1].set_fg(rgb(255, 158, 100)); // Sub header
        skin.paragraph.set_fg(rgb(169, 177, 214)); // Paragraphs
        skin.table.set_fg(rgb(192, 202, 245)); // Table text

        fn ingestion_sentence(vm: &IngestionViewModel) -> String
        {
            let dosage = format!(
                "{} _{}_",
                vm.dosage,
                if vm.dosage_classification != "n/a"
                {
                    format!("({})", vm.dosage_classification)
                }
                else
                {
                    String::new()
                }
            );
            let time_since = HumanTime::from(vm.ingested_at);
            let ingested_at = format!(
                "{} _{}_",
                vm.ingested_at.format("%Y-%m-%d %H:%M:%S"),
                time_since
            );

            format!(
                "The ingestion of **{}** occurred via the **{}** route, with a dosage of **{}**, \
                 and was ingested on **{}**.\n\n",
                vm.substance_name, vm.route, dosage, ingested_at
            )
        }

        let mut md = String::new();

        // Add more spacing at the top
        md.push('\n');
        md.push('\n');

        // Main header with substance name
        md.push_str(&format!("# {} #{}\n\n", self.substance_name, self.id));

        // Summary section
        md.push_str(&ingestion_sentence(self));

        // Details section with improved spacing
        md.push_str("## Details\n\n");
        md.push_str(&format!("**Route**: {}\n", self.route));
        md.push_str(&format!(
            "**Dosage**: {} _{}_\n",
            self.dosage,
            if self.dosage_classification != "n/a"
            {
                format!("({})", self.dosage_classification)
            }
            else
            {
                String::new()
            }
        ));

        let time_since = HumanTime::from(self.ingested_at);
        md.push_str(&format!(
            "**Ingested**: {} _{}_\n\n",
            self.ingested_at.format("%Y-%m-%d %H:%M:%S"),
            time_since
        ));

        if !self.phases.is_empty()
        {
            // Progress section
            md.push_str("## Progress\n\n");
            let progress_bar = self.progress_bar();
            md.push_str(&format!("{}\n\n", progress_bar));

            // Phases section with improved table
            md.push_str("## Phases\n\n");

            // Create table rows
            let phase_rows: Vec<PhaseRow> = self
                .phases
                .iter()
                .map(|phase| {
                    let start_range = format_date_range(&phase.start_time, &self.ingested_at);
                    let end_range = format_date_range(&phase.end_time, &self.ingested_at);
                    let phase_name_with_icon = format!("{} {}", phase.icon.0, phase.classification);

                    PhaseRow {
                        phase: phase_name_with_icon,
                        duration: phase.duration.to_string(),
                        start_time: start_range,
                        end_time: end_range,
                    }
                })
                .collect();

            // Create and style the table
            let table = Table::new(phase_rows)
                .with(Style::rounded())
                .with(Padding::new(1, 1, 0, 0))
                .with(Modify::new(Columns::new(1..)).with(Alignment::center()))
                .with(Modify::new(Segment::all()).with(Alignment::center()))
                .to_string();

            md.push_str(&table);
            md.push('\n');
            md.push('\n');
        }

        skin.text(&md, None).to_string()
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
        let dosage = model.dosage;
        let route_enum = model.route;

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
                    .build()
            })
            .collect::<Vec<_>>();

        Self::builder()
            .id(model.id.unwrap_or(0))
            .substance_name(model.substance_name)
            .route(RouteOfAdministrationClassification::to_string(&route_enum))
            .dosage(dosage.to_string())
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

    /// Generates a progress bar using indicatif
    pub fn progress_bar(&self) -> String
    {
        let percentage = self.progress_percentage();

        // Create a progress bar with a fixed length
        let pb = ProgressBar::new(100);

        // Customize the progress bar style
        let style =
            ProgressStyle::with_template("{spinner:.green} [{bar:30.cyan/blue}] {percent}%")
                .unwrap()
                .progress_chars("█░");
        pb.set_style(style);

        // Set the current progress
        pb.set_position(percentage as u64);

        // Manually create a string representation
        format!(
            "[{:30}] {}%",
            "█".repeat(((percentage as f64 / 100.0) * 30.0).round() as usize)
                + &"░".repeat(30 - ((percentage as f64 / 100.0) * 30.0).round() as usize),
            percentage
        )
    }
}
