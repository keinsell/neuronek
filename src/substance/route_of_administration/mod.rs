pub mod dosage;
pub mod phase;

use std::fmt;
use std::fmt::Display;
use std::str::FromStr;

use crate::substance::route_of_administration::dosage::{DosageClassification, DosageRange};
use crate::substance::route_of_administration::phase::{DurationRange, PhaseClassification};
use hashbrown::HashMap;
use serde::{Deserialize, Serialize};
use tabled::Tabled;

#[derive(
	clap::ValueEnum,
	Debug,
	Clone,
	Copy,
	Default,
	PartialEq,
	Serialize,
	Deserialize,
	Eq,
	Hash,
	Ord,
	PartialOrd
)]
#[serde(rename_all = "snake_case")]
pub enum RouteOfAdministrationClassification
{
	Buccal,
	Inhaled,
	Insufflated,
	Intramuscular,
	Intravenous,
	/// Oral administration is the most common route of administration for most
	/// substance classes. This route allows a substance to be absorbed through
	/// blood vessels lining the stomach and intestines. The onset is generally
	/// slower than other methods of ingestion as it must undergo first-pass
	/// metabolism through the liver (may vary greatly between individual
	/// substances).
	#[default]
	Oral,
	Rectal,
	Smoked,
	Sublingual,
	Transdermal,
}

impl fmt::Display for RouteOfAdministrationClassification
{
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result
	{
		let name = match self {
			| RouteOfAdministrationClassification::Buccal => "Buccal",
			| RouteOfAdministrationClassification::Inhaled => "Inhaled",
			| RouteOfAdministrationClassification::Insufflated => "Insufflated",
			| RouteOfAdministrationClassification::Intramuscular => "Intramuscular",
			| RouteOfAdministrationClassification::Intravenous => "Intravenous",
			| RouteOfAdministrationClassification::Oral => "Oral",
			| RouteOfAdministrationClassification::Rectal => "Rectal",
			| RouteOfAdministrationClassification::Smoked => "Smoked",
			| RouteOfAdministrationClassification::Sublingual => "Sublingual",
			| RouteOfAdministrationClassification::Transdermal => "Transdermal",
		};

		write!(f, "{}", name)
	}
}

impl FromStr for RouteOfAdministrationClassification
{
	type Err = ();

	fn from_str(input: &str) -> Result<Self, Self::Err>
	{
		match input {
			| "buccal" => Ok(Self::Buccal),
			| "inhaled" => Ok(Self::Inhaled),
			| "insufflated" => Ok(Self::Insufflated),
			| "intramuscular" => Ok(Self::Intramuscular),
			| "intravenous" => Ok(Self::Intravenous),
			| "oral" => Ok(Self::Oral),
			| "rectal" => Ok(Self::Rectal),
			| "smoked" => Ok(Self::Smoked),
			| "sublingual" => Ok(Self::Sublingual),
			| "transdermal" => Ok(Self::Transdermal),
			| _ => Err(()),
		}
	}
}

#[derive(Debug, Clone, Serialize, Tabled)]
pub struct RouteOfAdministration
{
	pub classification: RouteOfAdministrationClassification,
	#[tabled(skip)]
	pub dosages: Dosages,
	#[tabled(skip)]
	pub phases: Phases,
}

pub type Dosages = HashMap<DosageClassification, DosageRange>;
pub type Phases = HashMap<PhaseClassification, DurationRange>;
