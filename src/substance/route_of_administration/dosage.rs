use std::fmt;
use std::str::FromStr;

use delegate::delegate;
use derivative::Derivative;
use float_pretty_print::PrettyPrintFloat;
use measurements::{Mass, Measurement};
use serde::{Deserialize, Serialize};

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

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Hash)]
pub enum DosageClassification
{
	Threshold,
	Light,
	Common,
	Strong,
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
