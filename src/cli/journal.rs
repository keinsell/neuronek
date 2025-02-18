use crate::cli::MessageFormat;
use crate::cli::formatter::Formatter;
use crate::core::CommandHandler;
use crate::core::QueryHandler;
use crate::database::entities::ingestion::Entity as Ingestion;
use crate::database::entities::ingestion::Model as IngestionModel;
use crate::ingestion::query::AnalyzeIngestion;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::utils::AppContext;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::TimeZone;
use chrono::Timelike;
use chrono::Utc;
use clap::Parser;
use humantime::format_duration;
use miette::IntoDiagnostic;
use miette::Result;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use serde::Serialize;
use std::borrow::Cow;
use std::collections::HashMap;
use tabled::Tabled;
use termimad::MadSkin;
use termimad::rgb;


#[derive(Parser, Debug)]
pub struct ViewJournal
{
    /// Show all ingestions, including completed ones
    #[arg(short, long)]
    all: bool,
}

#[derive(Debug, Serialize, Clone)]
struct EnhancedIngestion
{
    model: IngestionModel,
    is_active: bool,
    current_phase: Option<String>,
    time_remaining: Option<Duration>,
}

/// Journal view is a list separated by hour of the day
/// with each hour containing a list of ingestions for that hour.
#[derive(Serialize, Debug)]
pub struct JournalViewModel
{
    entries: HashMap<u32, Vec<EnhancedIngestion>>,
    current_time: DateTime<Local>,
}

impl Tabled for JournalViewModel
{
    const LENGTH: usize = 2;

    fn fields(&self) -> Vec<Cow<'_, str>>
    {
        vec![
            Cow::Borrowed("Journal Date"),
            Cow::Owned(self.current_time.format("%Y-%m-%d").to_string()),
        ]
    }

    fn headers() -> Vec<Cow<'static, str>> { vec![Cow::Borrowed("Field"), Cow::Borrowed("Value")] }
}

impl JournalViewModel
{
    pub async fn new(ingestions: Vec<IngestionModel>) -> Result<Self>
    {
        let mut entries = HashMap::new();
        let current_time = Local::now();

        for ingestion in ingestions
        {
            let hour = Local.from_utc_datetime(&ingestion.ingested_at).hour();

            let analysis_query = AnalyzeIngestion::builder()
                .substance(ingestion.substance_name.clone())
                .date(Local.from_utc_datetime(&ingestion.ingested_at))
                .dosage(Dosage::from_base_units(ingestion.dosage as f64))
                .roa(
                    ingestion
                        .route_of_administration
                        .parse()
                        .unwrap_or_default(),
                )
                .ingestion_id(ingestion.id)
                .build();

            let enhanced = if let Ok(analysis) = analysis_query.query().await
            {
                let current_phase = analysis
                    .phases
                    .iter()
                    .find(|phase| {
                        let now = Local::now();
                        now >= phase.start_time.start && now <= phase.end_time.end
                    })
                    .map(|phase| {
                        let remaining = phase.end_time.end.signed_duration_since(Local::now());
                        (phase.class.to_string(), remaining)
                    });

                EnhancedIngestion {
                    model: ingestion,
                    is_active: current_phase.is_some(),
                    current_phase: current_phase.as_ref().map(|(phase, _)| phase.clone()),
                    time_remaining: current_phase.map(|(_, remaining)| remaining),
                }
            }
            else
            {
                EnhancedIngestion {
                    model: ingestion,
                    is_active: false,
                    current_phase: None,
                    time_remaining: None,
                }
            };

            entries.entry(hour).or_insert_with(Vec::new).push(enhanced);
        }

        Ok(Self {
            entries,
            current_time,
        })
    }
}

impl Formatter for JournalViewModel
{
    fn format(&self, format: MessageFormat) -> String
    {
        match format
        {
            | MessageFormat::Pretty => self.pretty(),
            | MessageFormat::Json => serde_json::to_string_pretty(self).unwrap(),
        }
    }

    fn pretty(&self) -> String
    {
        let mut skin = MadSkin::default();
        skin.set_fg(rgb(205, 214, 244));
        skin.bold.set_fg(rgb(166, 227, 161));
        skin.italic.set_fg(rgb(250, 179, 135));
        skin.headers[0].set_fg(rgb(198, 160, 246));
        skin.headers[1].set_fg(rgb(245, 224, 220));
        skin.paragraph.set_fg(rgb(198, 208, 245));

        let mut md = String::new();
        md.push_str(&format!("# {}\n\n", self.current_time.format("%Y-%m-%d")));

        let mut hours: Vec<_> = self.entries.keys().collect();
        hours.sort();

        for &hour in &hours
        {
            if let Some(ingestions) = self.entries.get(hour)
            {
                md.push_str(&format!("## {:02}:00\n\n", hour));

                for ingestion in ingestions
                {
                    let dosage = Dosage::from_base_units(ingestion.model.dosage as f64);
                    let route_enum: RouteOfAdministrationClassification = ingestion
                        .model
                        .route_of_administration
                        .parse()
                        .unwrap_or_default();

                    let status_icon = match (
                        ingestion.is_active,
                        Local.from_utc_datetime(&ingestion.model.ingested_at) > self.current_time,
                    )
                    {
                        | (true, _) => "**▶**",
                        | (false, true) => "*○*",
                        | (false, false) => "✓",
                    };

                    let phase_info = ingestion
                        .current_phase
                        .as_ref()
                        .map_or(String::new(), |phase| format!(" *{}*", phase));

                    let time_info = if let Some(remaining) = ingestion.time_remaining
                    {
                        if remaining.num_minutes() > 0
                        {
                            format!(
                                " _{:02}h {:02}m remaining_",
                                remaining.num_hours(),
                                remaining.num_minutes() % 60
                            )
                        }
                        else
                        {
                            String::new()
                        }
                    }
                    else
                    {
                        String::new()
                    };

                    let dosage_class = ingestion
                        .model
                        .dosage_classification
                        .as_ref()
                        .map(|c| format!(" [{}]", c))
                        .unwrap_or_default();

                    md.push_str(&format!(
                        "{} **{}** (#{}) - {} via {}{}{}{}\n\n",
                        status_icon,
                        ingestion.model.substance_name,
                        ingestion.model.id,
                        dosage.to_string(),
                        route_enum.to_string(),
                        dosage_class,
                        phase_info,
                        time_info
                    ));
                }
            }
        }

        skin.text(&md, None).to_string()
    }
}

#[async_trait::async_trait]
impl CommandHandler for ViewJournal
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> Result<()>
    {
        let today_start = Local::now().date_naive().and_hms_opt(0, 0, 0).unwrap();
        let today_end = Local::now().date_naive().and_hms_opt(23, 59, 59).unwrap();

        let mut query = Ingestion::find()
            .filter(crate::database::entities::ingestion::Column::IngestedAt.gte(today_start))
            .filter(crate::database::entities::ingestion::Column::IngestedAt.lte(today_end));

        if !self.all
        {
            query = query.filter(
                crate::database::entities::ingestion::Column::DosageClassification.ne("Completed"),
            );
        }

        let ingestions = query
            .order_by_asc(crate::database::entities::ingestion::Column::IngestedAt)
            .all(ctx.database_connection)
            .await
            .into_diagnostic()?;

        let view_model = JournalViewModel::new(ingestions).await?;
        println!("{}", view_model.format(ctx.stdout_format));

        Ok(())
    }
}
