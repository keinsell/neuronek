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
use std::collections::BTreeMap;
use std::fmt::Debug;
use std::fmt::Display;
use std::str::FromStr;
use tabled::Table;
use tabled::Tabled;
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

        info!(
            "Successfully updated ingestion with ID {}.",
            self.ingestion_identifier
        );

        println!(
            "{}",
            IngestionViewModel::from(updated_record).format(ctx.stdout_format)
        );

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
                let ingestion = IngestionService::log(log_ingestion)
                    .await
                    .map_err(|e| miette!(e))?;
                let message = IngestionViewModel::from(ingestion).format(ctx.stdout_format);
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
pub struct IngestionViewModel
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
    pub phases: Vec<IngestionPhaseViewModel>,
    #[tabled(skip)]
    pub active_phase: Option<IngestionPhaseViewModel>,
}

#[derive(Debug, Serialize, bon::Builder, Clone)]
pub struct IngestionPhaseViewModel
{
    pub classification: String,
    pub start_time: DateTime<Local>,
    pub end_time: DateTime<Local>,
    pub duration: Duration,
}

#[derive(Debug, Tabled)]
struct TimelineEntry
{
    #[tabled(rename = "Phase")]
    phase: String,
    #[tabled(rename = "Average Duration")]
    duration: String,
    #[tabled(rename = "Start Time")]
    start: String,
    #[tabled(rename = "End Time")]
    end: String,
}


impl Formatter for IngestionViewModel
{
    fn pretty(&self) -> String
    {
        let mut skin = MadSkin::default_dark();
        skin.set_fg(rgb(205, 214, 244));
        skin.bold.set_fg(rgb(166, 227, 161));
        skin.italic.set_fg(rgb(250, 179, 135));
        skin.headers[0].set_fg(rgb(198, 160, 246));
        skin.headers[1].set_fg(rgb(245, 224, 220));
        skin.headers[2].set_fg(rgb(242, 205, 205));
        skin.paragraph.set_fg(rgb(198, 208, 245));

        let mut md = String::new();

        md.push_str(&format!("# Ingestion #{}\n\n", self.id));
        md.push_str(&format!("**Substance**: {}\n", self.substance_name));
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

        if let Some(active_phase) = &self.active_phase
        {
            md.push_str("## Current Phase\n\n");

            let now = Local::now();
            let time_elapsed = now.signed_duration_since(active_phase.start_time);
            let time_remaining = active_phase.end_time.signed_duration_since(now);

            md.push_str(&format!("**{}**\n", active_phase.classification));
            md.push_str(&format!(
                "- Time elapsed: _{}_\n",
                HumanTime::from(time_elapsed)
            ));
            md.push_str(&format!(
                "- Time remaining: _{}_\n\n",
                HumanTime::from(time_remaining)
            ));
        }

        if !self.phases.is_empty()
        {
            let timeline_entries: Vec<TimelineEntry> = self
                .phases
                .iter()
                .map(|phase| {
                    let duration_mins = phase.duration.num_minutes();
                    let duration_formatted = if duration_mins >= 60
                    {
                        format!("{}h", duration_mins / 60)
                    }
                    else
                    {
                        format!("{}m", duration_mins)
                    };

                    let symbol = match phase.classification.as_str()
                    {
                        | "Onset" => "▲",
                        | "Comeup" => "△",
                        | "Peak" => "◆",
                        | "Comedown" => "▽",
                        | "Afterglow" => "○",
                        | _ => "•",
                    };

                    TimelineEntry {
                        phase: format!("{} {}", symbol, phase.classification),
                        duration: duration_formatted,
                        start: phase.start_time.format("%H:%M").to_string(),
                        end: phase.end_time.format("%H:%M").to_string(),
                    }
                })
                .collect();

            let table = Table::new(timeline_entries)
                .with(tabled::settings::Style::modern())
                .to_string();

            md.push_str("```\n");
            md.push_str(&table);
            md.push_str("\n```\n\n");
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
                IngestionPhaseViewModel::builder()
                    .classification(phase.class.to_string())
                    .start_time(
                        Local
                            .from_local_datetime(&phase.start_time.start.naive_utc())
                            .unwrap(),
                    )
                    .end_time(
                        Local
                            .from_local_datetime(&phase.end_time.start.naive_utc())
                            .unwrap(),
                    )
                    .duration(phase.duration.start)
                    .build()
            })
            .collect::<Vec<_>>();

        let active_phase = phases
            .iter()
            .find(|phase| {
                let now = Local::now();
                now >= phase.start_time && now <= phase.end_time
            })
            .cloned();

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
            .maybe_active_phase(active_phase)
            .build()
    }
}
