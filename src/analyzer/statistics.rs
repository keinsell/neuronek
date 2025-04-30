use super::timeseries::Observation;
use crate::ingestion::IngestionPhase;

pub trait StatisticalAnalysis
{
	type Input;
	type Output;

	fn compute(&self, data: &Self::Input) -> Self::Output;
}

/// Temporal intensivity captures the magnitude or strength of a substance’s
/// activity as it changes across time. In your context—where you analyze logs
/// or records of substance use—this means calculating, for each point in time,
/// how "intense" the effect or presence of a substance is, based on recorded
/// events (such as ingestion, dose, or exposure).
pub struct TemporalIntensivity {}
