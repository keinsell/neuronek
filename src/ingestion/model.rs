use crate::database::entities::ingestion::Model;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::dosage::DosageClassification;
use crate::substance::route_of_administration::phase::PhaseClassification;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::TimeZone;
use clap::builder::TypedValueParser;
use hashbrown::HashMap;
use std::ops::Range;
use std::str::FromStr;
use crate::ingestion::phase::model::IngestionPhase;

pub type IngestionDate = DateTime<Local>;
pub type IngestionPhases = HashMap<PhaseClassification, IngestionPhase>;

#[derive(Debug, Clone)]
pub struct Ingestion
{
    pub id: Option<i32>,
    pub substance_name: String,
    pub dosage: Dosage,
    pub route: RouteOfAdministrationClassification,
    pub ingestion_date: IngestionDate,
    /// The classification of the dosage for this ingestion.
    /// This field is an `Option` to allow for cases where the dosage
    /// classification cannot be determined.
    pub dosage_classification: Option<DosageClassification>,
    pub substance: Option<Box<crate::substance::Substance>>,
    /// A vector of `IngestionPhase` structs representing the different phases
    /// of the ingestion event.
    pub phases: Vec<IngestionPhase>,
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
            dosage_classification: None,
            substance: None,
            phases: vec![],
        }
    }
}

