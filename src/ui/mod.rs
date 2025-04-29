pub mod theme;

use derive_more::Display;

use crate::substance::route_of_administration::dosage::DosageClassification;
use crate::substance::route_of_administration::phase::PhaseClassification;
pub mod interactive;


#[derive(Clone, Debug, Display)]
pub struct PhaseIcon(pub String);

impl From<&PhaseClassification> for PhaseIcon
{
	fn from(value: &PhaseClassification) -> Self
	{
		let icon = match value {
			| PhaseClassification::Onset => "—".to_string(),
			| PhaseClassification::Comeup => "↑".to_string(),
			| PhaseClassification::Peak => "≡".to_string(),
			| PhaseClassification::Comedown => "↓".to_string(),
			| PhaseClassification::Afterglow => "≈".to_string(),
			| _ => "".to_string(),
		};

		PhaseIcon(icon)
	}
}


#[derive(Clone, Debug, Display)]
pub struct DosageIcon(pub String);

/// DosageIcon represents dosage levels inspired by Alexander Shulgin's rating
/// scale, used in his books PIHKAL and TIHKAL to categorize psychoactive
/// substance intensity.
///
/// The Shulgin Scale uses symbols to indicate intensity of effects:
/// - (±): Threshold effects, barely perceptible
/// - (+): Light but noticeable effects
/// - (++): Definite and distinct effects
/// - (+++): Strong and intense effects
/// - (++++): Extremely intense, overwhelming effects
///
/// These ratings help standardize subjective experience reporting and
/// provide a framework for harm reduction through dose classification.
impl From<&DosageClassification> for DosageIcon
{
	fn from(value: &DosageClassification) -> Self
	{
		let icon = match value {
			| DosageClassification::Threshold => "(±)".to_string(),
			| DosageClassification::Light => "(+)".to_string(),
			| DosageClassification::Common => "(++)".to_string(),
			| DosageClassification::Strong => "(+++)".to_string(),
			| DosageClassification::Heavy => "(++++)".to_string(),
			| _ => "".to_string(),
		};
		DosageIcon(icon)
	}
}
