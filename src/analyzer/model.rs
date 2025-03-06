use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::TimeZone;
use std::range::Range;
use std::str::FromStr;
use textplots::Plot;

use crate::ingestion::model::IngestionPhases;
use crate::substance::route_of_administration::dosage::DosageClassification;
use rust_decimal::prelude::*;
use serde::Deserialize;
use serde::Serialize;


#[derive(Debug, Clone)]
pub struct Report
{
    pub ingestion_id: Option<u32>,
    pub substance_name: String,
    pub dosage_classification: DosageClassification,
    pub phases: IngestionPhases,
    /// Estimated duration of ingestion
    pub duration: Range<Duration>,
    /// Estimated duration of ingestion incl. aftereffects
    pub total_duration: Range<Duration>,
}


/// Progression is a representation of total duration related to ingestion in
/// scale of 0.0 to 1.0
///
/// References: [#531](https://github.com/keinsell/neuronek/issues/531)
#[nutype::nutype(
    validate(greater_or_equal = 0.0, less_or_equal = 1.0),
    derive(Debug, PartialEq, Clone)
)]
pub struct IngestionProgress(f32);
