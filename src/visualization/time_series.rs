use chrono::DateTime;
use chrono::Local;
use chrono::TimeZone;
use chrono::Utc;
use rust_decimal::prelude::ToPrimitive;

use crate::ingestion::phase::model::IngestionPhase;

#[derive(Debug, Clone)]
pub struct TimeSeriesData
{
    pub timestamps: Vec<DateTime<Local>>,
    pub values: Vec<f64>,
}

impl TimeSeriesData
{
    pub fn from_ingestion_phases(phases: &[IngestionPhase]) -> Self
    {
        let mut data = TimeSeriesData {
            timestamps: Vec::new(),
            values: Vec::new(),
        };

        for phase in phases
        {
            data.timestamps.push(phase.avg_start_time());
            data.values.push(phase.weight.to_f64().unwrap_or(0.0));
        }

        data
    }

    pub fn to_xy_points(&self) -> Vec<(f32, f32)>
    {
        if self.timestamps.is_empty()
        {
            return Vec::new();
        }

        let reference_time = self.timestamps[0];

        self.timestamps
            .iter()
            .zip(self.values.iter())
            .map(|(time, &value)| {
                let duration_offset =
                    time.signed_duration_since(reference_time).num_minutes() as f32 / 60.0;
                (duration_offset, value as f32)
            })
            .collect()
    }
}
