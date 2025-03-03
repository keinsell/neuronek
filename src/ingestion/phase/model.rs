use crate::ingestion::IngestionPhase;
use crate::substance::route_of_administration::phase::PhaseClassification;
use chrono::Duration;
use chrono::Duration as ChronoDuration;
use chrono::Local;
use chrono::TimeZone;
use humantime::parse_rfc3339;
use iso8601_duration::Duration as IsoDuration;
use std::str::FromStr;


impl From<crate::database::entities::ingestion_phase::Model> for IngestionPhase
{
    fn from(value: crate::database::entities::ingestion_phase::Model) -> Self
    {
        fn parse_iso8601_duration(value: &str) -> ChronoDuration
        {
            let parsed_iso = IsoDuration::from_str(value).unwrap();
            let std_duration = parsed_iso.to_std().unwrap();
            ChronoDuration::from_std(std_duration).unwrap()
        }

        let min_duration = parse_iso8601_duration(&value.duration_min);
        let max_duration = parse_iso8601_duration(&value.duration_max);
        let start_time_min = Local.from_utc_datetime(&value.start_date_min);
        let start_time_max = Local.from_utc_datetime(&value.start_date_max);
        let end_time_min = Local.from_utc_datetime(&value.end_date_min);
        let end_time_max = Local.from_utc_datetime(&value.end_date_max);

        IngestionPhase {
            id: Some(value.id),
            ingestion_id: Some(value.ingestion_id),
            substance_name: value.substance_name,
            classification: PhaseClassification::from_str(&value.classification).unwrap(),
            start_time: start_time_min..start_time_max,
            end_time: end_time_min..end_time_max,
            duration: min_duration..max_duration,
            weight: value.weight.into(),
        }
    }
}
