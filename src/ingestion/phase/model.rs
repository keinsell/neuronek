use std::ops::Range;
use std::str::FromStr;
use chrono::{DateTime, Duration, Local, TimeZone};
use crate::substance::route_of_administration::phase::PhaseClassification;

#[derive(Debug, Clone)]
pub struct IngestionPhase
{
    pub id: Option<String>,
    pub class: PhaseClassification,
    pub start_time: Range<DateTime<Local>>,
    pub end_time: Range<DateTime<Local>>,
    pub duration: Range<Duration>,
}

impl From<crate::database::entities::ingestion_phase::Model> for IngestionPhase
{
    fn from(value: crate::database::entities::ingestion_phase::Model) -> Self
    {
        let duration_lower = value.duration_min;
        let duration_upper = value.duration_max;

        Self {
            id: Some(value.id),
            class: PhaseClassification::from_str(&value.classification).unwrap(),
            start_time: Range::from(Local.from_utc_datetime(&value.start_date_min)
                ..Local.from_utc_datetime(&value.start_date_max)),
            end_time: Range::from(Local.from_utc_datetime(&value.end_date_min)
                ..Local.from_utc_datetime(&value.end_date_max)),
            duration: Range::from(Duration::minutes(duration_lower as i64)
                ..Duration::minutes(duration_upper as i64)),
        }
    }
}