use crate::substance::route_of_administration::phase::PhaseClassification;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::NaiveDate;
use chrono::TimeZone;
use humantime::parse_duration;
use sea_orm::prelude::Decimal;
use std::ops::Range;
use std::str::FromStr;

/// Represents a phase of substance ingestion, capturing various details about
/// the phase.
#[derive(Debug, Clone)]
pub struct IngestionPhase
{
    /// Unique identifier for the ingestion phase.
    /// This is optional and may be `None` if the phase has not been persisted
    /// to a database.
    pub id: Option<String>,

    /// Classification of the phase, indicating the type or nature of the phase.
    /// This is typically an enum value that categorizes the phase.
    pub class: PhaseClassification,

    /// The time range during which the phase starts.
    /// This is a range of `DateTime<Local>` values, representing the minimum
    /// and maximum start times.
    pub start_time: Range<DateTime<Local>>,

    /// The time range during which the phase ends.
    /// This is a range of `DateTime<Local>` values, representing the minimum
    /// and maximum end times.
    pub end_time: Range<DateTime<Local>>,

    /// The duration range of the phase.
    /// This is a range of `Duration` values, representing the minimum and
    /// maximum durations.
    pub duration: Range<Duration>,

    /// The weight associated with the phase.
    /// This is a `Decimal` value that may represent the significance or impact
    /// of the phase.
    pub weight: Decimal,

    /// The name of the substance associated with this ingestion phase.
    /// This is a string value representing the substance name.
    pub substance_name: String,
}

impl IngestionPhase
{
    pub fn avg_start_time(&self) -> DateTime<Local>
    {
        self.start_time.start + self.duration.start / 2
    }
    pub fn avg_end_time(&self) -> DateTime<Local> { self.end_time.start + self.duration.start / 2 }
    pub fn avg_duration(&self) -> Duration { self.duration.start + self.duration.end / 2 }
}

impl From<crate::database::entities::ingestion_phase::Model> for IngestionPhase
{
    fn from(value: crate::database::entities::ingestion_phase::Model) -> Self
    {
        let duration_lower: Duration =
            Duration::from_std(parse_duration(&value.duration_min).unwrap()).unwrap();
        let duration_upper: Duration =
            Duration::from_std(parse_duration(&value.duration_max).unwrap()).unwrap();
        Self {
            id: Some(value.id),
            class: PhaseClassification::from_str(&value.classification).unwrap(),
            start_time: Local.from_local_datetime(&value.start_date_min).unwrap()
                ..Local.from_local_datetime(&value.start_date_max).unwrap(),
            end_time: Local.from_local_datetime(&value.end_date_min).unwrap()
                ..Local.from_local_datetime(&value.end_date_max).unwrap(),
            duration: duration_lower..duration_upper,
            substance_name: value.substance_name,
            weight: value.weight,
        }
    }
}
