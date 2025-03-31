use std::fmt;
use std::str::FromStr;

use delegate::delegate;
use derivative::Derivative;
use float_pretty_print::PrettyPrintFloat;
use measurements::{Mass, Measurement};
use serde::{Deserialize, Serialize};
use tabled::Tabled;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Derivative, Eq, PartialOrd, Copy)]
pub struct Dosage(Mass);

impl std::str::FromStr for Dosage
{
	type Err = String;

	/// Parse a &str into a valid `Dosage`.
	fn from_str(s: &str) -> Result<Self, Self::Err>
	{
		let mass = Mass::from_str(s).unwrap();
		Ok(Dosage(mass))
	}
}


impl fmt::Display for Dosage
{
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result
	{
		let suggested_unit = self.0.get_appropriate_units();
		let value_of_unit = format!("{:4.4}", PrettyPrintFloat(suggested_unit.1));
		let unit = suggested_unit.0;
		let formatted = format!("{} {}", value_of_unit.trim_start(), unit);
		write!(f, "{}", formatted)
	}
}

impl Dosage
{
	pub fn from_base_units(units: f64) -> Dosage { Dosage(Mass::from_base_units(units)) }
	pub fn from_milligrams(units: f64) -> Dosage { Dosage(Mass::from_milligrams(units)) }

	delegate! {
		to self.0 {
			pub fn as_base_units(&self) -> f64;

		}
	}
}

impl TryInto<Dosage> for Option<f64>
{
	type Error = sea_orm::error::DbErr;

	fn try_into(self) -> Result<Dosage, Self::Error>
	{
		self.map(Dosage::from_base_units)
			.ok_or_else(|| sea_orm::error::DbErr::Custom("Dosage is NULL".to_string()))
	}
}

impl Default for Dosage
{
	fn default() -> Self { Dosage(Mass::from_base_units(0.0)) }
}


#[cfg(test)]
mod tests
{
	use std::str::FromStr;

	use super::*;

	#[test]
	fn test_parse_dosage()
	{
		assert_eq!(
			Dosage::from_str("100g").unwrap(),
			Dosage(Mass::from_grams(100f64))
		);
		assert_eq!(
			Dosage::from_str("100kg").unwrap(),
			Dosage(Mass::from_kilograms(100f64))
		);
		assert_eq!(
			Dosage::from_str("100kg").unwrap(),
			Dosage(Mass::from_kilograms(100f64))
		);
	}

	#[test]
	fn test_format_dosage()
	{
		let dosage = Dosage(Mass::from_grams(0.1));
		assert_eq!(dosage.to_string(), "100 mg");
	}
}

/// DosageClassification is an enumeration that defines the distinct intensities
/// of effects experienced with psychoactive substances.
/// [Psychonautwiki](https://psychonautwiki.org/wiki/Dosage_classification)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, PartialOrd, Ord)]
pub enum DosageClassification
{
	/// A threshold dose is the dose at which the mental and physical
	/// alterations produced by the substance first become apparent. These
	/// effects are distinctly beyond that of placebo but may still be ignored
	/// with some effort by directing one's focus towards the external
	/// environment. Subjects may perceive a vague sense of "something" or
	/// anticipatory energy building up in the background at this level. In the
	/// context of psychedelics, a threshold dose taken for the purpose of
	/// enhancing creativity or motivation without intoxicating the subject is
	/// known as a "microdose".
	Threshold,

	/// A light dose produces a state which is somewhat distinct from sobriety
	/// but does not threaten to override the subject's ordinary awareness. The
	/// effects can be ignored by increasing the focus one directs towards the
	/// external environment and performing complex tasks. The subject may have
	/// to pay particular attention for the substance's effects to be
	/// perceptible, or they may be slightly noticeable but will not insist
	/// upon the subject's attention.
	Light,

	/// A common dose is the dose at which the effects and nature of the
	/// substance is quite clear and distinct; the subject's ordinary awareness
	/// slips and ignoring its action becomes difficult. The subject will
	/// generally be able to partake in regular behaviors and remain functional
	/// and able to communicate, although this can depend on the individual.
	/// The effects can be allowed to occupy a predominant role or they may be
	/// suppressed and made secondary to other chosen activities with sufficient
	/// effort or in case of an emergency.
	Common,

	/// A strong dose renders its subject mostly incapable of functioning,
	/// interacting normally, or thinking in a straightforward manner. The
	/// effects of the substance are clear and can no longer be ignored or
	/// suppressed, leaving the subject entirely engaged in the experience
	/// regardless of their desire or volition. Negative effects become more
	/// common at this level. As subjects are not able to alter the trajectory
	/// of their behavior at strong doses, it is vital that they have prepared
	/// their environment and activities in advance as well as taken any
	/// precautionary measures.
	Strong,

	/// A heavy dose is the upper limit of what a substance is capable of
	/// producing in terms of psychoactive effects; doses past this range are
	/// associated with rapidly increasing side effects and marginal desirable
	/// effects. Depending on the substance consumed, the user may be rendered
	/// incapable of functioning and communicating in addition to experiencing
	/// extremely uncomfortable side effects that overshadow the positive
	/// effects experienced at lower doses. It is absolutely vital to employ
	/// harm reduction measures with heavy doses as the user will likely be
	/// unable to properly take care of themselves in the event of an emergency.
	/// The line between a heavy dose and overdose is often very blurry, with
	/// significantly higher risk of injury, hospitalization, and death.
	Heavy,
}

impl FromStr for DosageClassification
{
	type Err = ();

	fn from_str(input: &str) -> Result<Self, Self::Err>
	{
		match input {
			| "threshold" => Ok(Self::Threshold),
			| "light" => Ok(Self::Light),
			| "common" => Ok(Self::Common),
			| "strong" => Ok(Self::Strong),
			| "heavy" => Ok(Self::Heavy),
			| _ => Err(()),
		}
	}
}

impl fmt::Display for DosageClassification
{
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result
	{
		match self {
			| DosageClassification::Threshold => write!(f, "Threshold"),
			| DosageClassification::Light => write!(f, "Light"),
			| DosageClassification::Common => write!(f, "Common"),
			| DosageClassification::Strong => write!(f, "Strong"),
			| DosageClassification::Heavy => write!(f, "Heavy"),
		}
	}
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DosageRange
{
	pub start: Option<Dosage>,
	pub end: Option<Dosage>,
}

impl DosageRange
{
	pub fn contains(&self, dosage: &Dosage) -> bool
	{
		let after_start = match &self.start {
			| Some(start) => dosage >= start,
			| None => true,
		};
		let before_end = match &self.end {
			| Some(end) => dosage <= end,
			| None => true,
		};
		after_start && before_end
	}

	pub fn from_bounds(start: Option<Dosage>, end: Option<Dosage>) -> Self { Self { start, end } }
}
