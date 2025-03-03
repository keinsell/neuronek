use crate::ingestion::model::IngestionPhases;
use chrono::DateTime;
use chrono::Local;
use rust_decimal::Decimal;

/// IngestionFlow is self-contained vector of information extracted from an
/// `IngestionPhase` vector, which is transformed into timeseries data with
/// weighted intensity values which can be plotted and analyzed.
pub struct IngestionFlow(Vec<(DateTime<Local>, Decimal)>);

impl From<IngestionPhases> for IngestionFlow
{
    fn from(phases: IngestionPhases) -> Self { IngestionFlow(vec![]) }
}
