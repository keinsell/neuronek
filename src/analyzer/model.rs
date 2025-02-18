use crate::substance::route_of_administration::dosage::{Dosage, DosageClassification};
use crate::substance::route_of_administration::{RouteOfAdministration, RouteOfAdministrationClassification};
use crate::substance::Substance;

struct AnalyzerReport {
    pub dosage_classification: DosageClassification,
    pub ingestion: Box<crate::ingestion::Ingestion>,
    pub substance: Box<crate::substance::Substance>,
}

/// Progression is a representation of total duration related to ingestion in scale of 0.0 to 1.0
///
/// References: [#531](https://github.com/keinsell/neuronek/issues/531)
#[nutype::nutype(
    validate(greater_or_equal = 0.0, less_or_equal = 1.0),
    derive(Debug, PartialEq, Clone),
)]
pub struct IngestionProgress(f32);