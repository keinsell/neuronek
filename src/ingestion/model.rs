use crate::database::entities::ingestion::Model;
use crate::ingestion::IngestionPhase;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::phase::PhaseClassification;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::TimeZone;
use clap::builder::TypedValueParser;
use hashbrown::HashMap;
use serde::Serialize;
use std::fmt::Display;
use std::range::Range;
use tabled::Tabled;

#[derive(Debug, Clone, Tabled, Serialize)]
#[serde(rename_all = "camelCase")]
#[tabled(display(Option, "tabled::derive::display::option", ""))]
pub struct Ingestion
{
    #[tabled(rename = "ID")]
    pub id: Option<i32>,
    #[tabled(rename = "Substance")]
    pub substance_name: String,
    #[tabled(rename = "Dosage")]
    pub dosage: Dosage,
    #[tabled(rename = "Route")]
    pub route: RouteOfAdministrationClassification,
    #[tabled(rename = "Ingested At")]
    pub ingestion_date: DateTime<Local>,
    #[tabled(skip)]
    pub phases: IngestionPhases,
}

impl From<Model> for Ingestion
{
    fn from(value: Model) -> Self
    {
        Ingestion {
            id: Some(value.id),
            substance_name: value.substance_name,
            dosage: Dosage::from_base_units(value.dosage as f64),
            ingestion_date: Local.from_utc_datetime(&value.ingested_at),
            route: value
                .route_of_administration
                .parse()
                .unwrap_or(RouteOfAdministrationClassification::Oral),
            phases: IngestionPhases::from(vec![]),
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct IngestionPhases(pub Vec<IngestionPhase>);

impl From<Vec<IngestionPhase>> for IngestionPhases
{
    fn from(mut phases: Vec<IngestionPhase>) -> Self
    {
        phases.sort_by_key(|phase| phase.classification);
        IngestionPhases(phases)
    }
}


impl IngestionPhases
{
    pub fn get(&self, classification: &PhaseClassification) -> Option<&IngestionPhase>
    {
        self.0
            .iter()
            .find(|phase| &phase.classification == classification)
    }

    /// Calculate the duration range from all phases
    pub fn duration_range(&self) -> Option<Range<Duration>>
    {
        let mut min_duration = Duration::zero();
        let mut max_duration = Duration::zero();

        for phase in &self.0
        {
            if phase.classification == PhaseClassification::Afterglow
            {
                continue;
            }
            min_duration = min_duration + phase.duration.start;
            max_duration = max_duration + phase.duration.end;
        }

        Some((min_duration..max_duration).into())
    }
}
