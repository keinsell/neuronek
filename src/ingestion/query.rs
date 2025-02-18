use crate::DATABASE_CONNECTION;
use crate::core::QueryHandler;
use crate::database::entities::ingestion;
use crate::database::entities::ingestion::Entity as IngestionEntity;
use crate::database::entities::ingestion_phase;
use crate::ingestion::IngestionPhase;
use crate::ingestion::model::Ingestion;
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::RouteOfAdministration;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::dosage::DosageClassification;
use crate::substance::route_of_administration::phase::PhaseClassification;
use crate::utils::AppContext;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::Duration as TimeDelta;
use chrono::Local;
use chrono::TimeZone;
use clap::Parser;
use clap::arg;
use clap::command;
use derive_more::FromStr;
use miette::IntoDiagnostic;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use sea_orm_migration::IntoSchemaManagerConnection;
use std::ops::Range;
use std::str::FromStr;
use tracing::field::debug;
use uuid::Uuid;

#[derive(Parser, Debug, Copy, Clone, Serialize, Deserialize, bon::Builder)]
#[command(version, about = "Query ingestions", long_about, aliases = vec!["ls", "get"])]
pub struct ListIngestion
{
    /// Defines the amount of ingestion to display
    #[arg(short = 'l', long, default_value_t = 10)]
    pub limit: u64,
}

/// Analyze a previously logged ingestion activity.
///
/// Either the `ingestion_id` **or** the combination of `substance.rs` and
/// `dosage` must be provided, but not both at the same time. If
/// `ingestion_id` is provided, all other arguments are ignored.
#[derive(Parser, Debug, bon::Builder)]
#[command(
    version,
    about = "Generate insights about a given ingestion",
    long_about = "Analyze ingestion entries based on their unique identifier or specific \
                  substance and dosage details."
)]
pub struct AnalyzeIngestion
{
    #[arg(short, long, value_name = "INGESTION_ID")]
    pub ingestion_id: Option<i32>,
    /// Name of the substance involved in the ingestion.
    // #[arg(
    //     short,
    //     long,
    //     value_name = "SUBSTANCE",
    //     help = "Name of the substance",
    //     requires = "dosage",
    //     conflicts_with = "ingestion_id"
    // )]
    #[arg(short, long, value_name = "SUBSTANCE")]
    pub substance: String,

    /// Dosage of the substance ingested (if not using `ingestion_id`).
    #[arg(
        short,
        long,
        value_name = "DOSAGE",
        help = "Dosage of the substance",
        value_parser = Dosage::from_str,
    )]
    pub dosage: Dosage,

    /// Date of ingestion (defaults to the current date if not provided).
    #[arg(
        short = 't',
        long = "date",
        default_value = "now",
        value_parser = crate::utils::parse_date_string,
    )]
    pub date: chrono::DateTime<Local>,

    /// Route of administration of the substance (defaults to "oral").
    #[arg(short = 'r', long = "roa", default_value = "oral", value_enum)]
    pub roa: RouteOfAdministrationClassification,
}

impl From<Ingestion> for AnalyzeIngestion
{
    fn from(ingestion: super::model::Ingestion) -> Self
    {
        AnalyzeIngestion {
            ingestion_id: ingestion.id,
            substance: ingestion.substance_name,
            dosage: ingestion.dosage,
            date: ingestion.ingestion_date,
            roa: ingestion.route,
        }
    }
}

impl std::default::Default for ListIngestion
{
    fn default() -> Self { Self::builder().limit(100).build() }
}


#[async_trait::async_trait]
impl crate::core::QueryHandler<Vec<Ingestion>> for ListIngestion
{
    async fn query(&self) -> miette::Result<Vec<Ingestion>>
    {
        let ingestions = crate::database::entities::prelude::Ingestion::find()
            .order_by_desc(ingestion::Column::IngestedAt)
            .limit(Some(self.limit))
            .all(&DATABASE_CONNECTION.into_schema_manager_connection())
            .await
            .into_diagnostic()?
            .iter()
            .map(|i| Ingestion::from(i.clone()))
            .collect();

        Ok(ingestions)
    }
}

#[async_trait]
impl QueryHandler<Ingestion> for AnalyzeIngestion
{
    async fn query(&self) -> miette::Result<Ingestion>
    {
        let db: &DatabaseConnection = &DATABASE_CONNECTION;

        let substance_name = &self.substance.clone();
        let dosage = self.dosage;
        let date = self.date;
        let route = self.roa;

        // Fetch substance with related data
        let substance = get_substance(substance_name, db)
            .await
            .map_err(|e| miette::miette!("Failed to get substance: {}", e))?;

        let mut ingestion = Ingestion {
            id: self.ingestion_id,
            substance_name: substance_name.clone(),
            dosage,
            route,
            ingestion_date: date,
            dosage_classification: None,
            substance: substance.clone().map(Box::new),
            phases: Vec::new(),
        };

        if ingestion.substance.is_none()
        {
            return Ok(ingestion);
        }

        let substance = ingestion.substance.as_ref().unwrap();
        let route_of_administration = substance.routes_of_administration.get(&self.roa);

        if route_of_administration.is_none()
        {
            return Ok(ingestion);
        }

        let route_of_administration = route_of_administration.unwrap();
        let dosages = &route_of_administration.dosages;
        let ingestion_dosage = ingestion.dosage;

        ingestion.dosage_classification = dosages
            .iter()
            .find(|(_, range)| range.contains(&ingestion_dosage))
            .map(|(classification, _)| *classification)
            .or_else(|| {
                dosages
                    .iter()
                    .filter_map(|(_classification, range)| {
                        match (range.start.as_ref(), range.end.as_ref())
                        {
                            | (Some(start), _) if &ingestion_dosage >= start =>
                            {
                                Some(DosageClassification::Heavy)
                            }
                            | (_, Some(end)) if &ingestion_dosage <= end =>
                            {
                                Some(DosageClassification::Threshold)
                            }
                            | _ => None,
                        }
                    })
                    .next()
            });

        let phases = &route_of_administration.phases;
        let mut current_time = ingestion.ingestion_date;
        let mut ingestion_phases = Vec::new();

        for phase_class in crate::substance::route_of_administration::phase::PHASE_ORDER.iter()
        {
            if let Some(duration_range) = phases.get(phase_class)
            {
                let start_minutes = duration_range.start.num_minutes().unwrap_or(0.0) as i64;
                let end_minutes = duration_range.end.num_minutes().unwrap_or(0.0) as i64;

                let start_duration = TimeDelta::minutes(start_minutes);
                let end_duration = TimeDelta::minutes(end_minutes);

                let start_time = current_time;
                let end_time = current_time + end_duration;

                let phase = IngestionPhase {
                    id: None,
                    class: *phase_class,
                    start_time: Range::from(start_time..(start_time + start_duration)),
                    end_time: Range::from(end_time..(end_time + (end_duration - start_duration))),
                    duration: Range::from(start_duration..end_duration),
                };

                current_time = end_time;
                ingestion_phases.push(phase);
            }
        }

        ingestion.phases = ingestion_phases;

        Ok(ingestion)
    }
}
