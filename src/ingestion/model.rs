use std::fmt;
use std::fmt::{Display, Formatter};
use std::range::Range;
use std::str::FromStr;

use chrono::{DateTime, Duration, Local, TimeZone};
use clap::Parser;
use clap::builder::TypedValueParser;
use nutype::nutype;
use serde::Serialize;
use tabled::Tabled;
use valuable::Valuable;
use crate::ValueParser;
use crate::database::entities::ingestion::Model;
use crate::ingestion::IngestionPhase;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::{Dosage, DosageClassification};
use crate::substance::route_of_administration::phase::PhaseClassification;


#[nutype(
	sanitize(trim, lowercase),
	validate(not_empty),
	derive(Debug, Clone, Serialize, TryFrom, Into, Hash, PartialEq, Eq)
)]
pub struct SubstanceName(String);

impl fmt::Display for SubstanceName
{
	fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result
	{
		let s = &self.clone().into_inner();
		let mut chars = s.chars();

		if let Some(first) = chars.next() {
			let first_cap: String = first.to_uppercase().collect();
			let rest: String = chars.collect();
			write!(f, "{}{}", first_cap, rest)
		} else {
			write!(f, "")
		}
	}
}

#[derive(Debug, Clone, Tabled, Serialize)]
#[serde(rename_all = "camelCase")]
#[tabled(display(Option, "tabled::derive::display::option", ""))]
pub struct Ingestion
{
	#[tabled(rename = "ID")]
	pub id: Option<i32>,
	#[tabled(rename = "Substance")]
	pub substance_name: SubstanceName,
	#[tabled(rename = "Dosage")]
	pub dosage: Dosage,
	#[tabled(rename = "Route")]
	pub route: RouteOfAdministrationClassification,
	#[tabled(rename = "Ingested At")]
	pub ingestion_date: DateTime<Local>,
	#[tabled(skip)]
	pub phases: IngestionPhases,
	#[tabled(skip)]
	pub duration: Option<Duration>,
	#[tabled(skip)]
	pub dosage_classification: Option<DosageClassification>,
}

impl From<Model> for Ingestion
{
	fn from(value: Model) -> Self
	{
		Ingestion {
			id: Some(value.id),
			substance_name: value.substance_name.try_into().unwrap(),
			dosage: Dosage::from_base_units(value.dosage as f64),
			ingestion_date: Local.from_utc_datetime(&value.ingested_at),
			route: value
				.route_of_administration
				.parse()
				.unwrap_or(RouteOfAdministrationClassification::Oral),
			phases: IngestionPhases::from(vec![]),
			duration: None,
			dosage_classification: None,
		}
	}
}

#[derive(Debug, Clone, Serialize)]
pub struct IngestionPhases(pub Vec<IngestionPhase>);

impl From<Vec<IngestionPhase>> for IngestionPhases
{
	fn from(mut phases: Vec<IngestionPhase>) -> Self
	{
		phases.sort_by_key(|phase| phase.classification);
		IngestionPhases(phases)
	}
}


impl IngestionPhases
{
	pub fn get(&self, classification: &PhaseClassification) -> Option<&IngestionPhase>
	{
		self.0
			.iter()
			.find(|phase| &phase.classification == classification)
	}

	/// Calculate the duration range from all phases
	pub fn duration_range(&self) -> Option<Range<Duration>>
	{
		let mut min_duration = Duration::zero();
		let mut max_duration = Duration::zero();

		if self.0.is_empty() {
			return None;
		}

		for phase in &self.0 {
			if phase.classification == PhaseClassification::Afterglow {
				continue;
			}
			min_duration += phase.duration.start;
			max_duration += phase.duration.end;
		}

		Some((min_duration..max_duration).into())
	}
}

/// Progression is a representation of total duration related to ingestion in
/// scale of 0.0 to 1.0
///
/// References: [#531](https://github.com/keinsell/neuronek/issues/531)
#[nutype::nutype(
	validate(greater_or_equal = 0.0, less_or_equal = 1.0),
	derive(Debug, PartialEq, Clone)
)]
pub struct IngestionProgress(f32);

/// Analyzes ingestion information for additional insights.
///
/// This command requires you to either:
/// 1. Provide an `ingestion_id`, which fetches and analyzes the particular
///    ingestion entry, ignoring all other parameters.
/// 2. Omit `ingestion_id` and specify both a `substance` and a `dosage` to
///    perform the analysis based on those details.
///
/// If `ingestion_id` is given, `substance` and `dosage` are unused. If
/// `ingestion_id` is not provided, you must specify both `substance` and
/// `dosage`.
///
/// Additional arguments include:
/// - `date`: The date of ingestion, falling back to the current date if not
///   provided.
/// - `roa`: The route of administration, which defaults to `"oral"` if no other
///   route is specified.
///
/// This structure should be used when you want to study ingestion patterns:
/// either by referencing a specific entry already stored in the system or by
/// supplying new ingestion details such as substance name, dosage, date, and
/// route of administration.
#[derive(Parser, Debug, bon::Builder)]
#[command(
	version,
	about = "Generate insights about a given ingestion",
	long_about = "Analyze ingestion entries either by referencing a unique identifier (ID) or by \
	              specifying a substance and dosage."
)]
pub struct AnalyzeIngestion
{
	#[arg(short, long, value_name = "INGESTION_ID")]
	pub ingestion_id: Option<i32>,

	/// Name of the substance involved in the ingestion (required if not
	/// providing `ingestion_id`).
	#[arg(short, long, value_name = "SUBSTANCE")]
	pub substance: String,

	/// Dosage of the substance involved in the ingestion (required if not
	/// providing `ingestion_id`).
	#[arg(
        short,
        long,
        value_name = "DOSAGE",
        help = "Dosage of the substance in the appropriate unit (e.g., mg)",
        value_parser = Dosage::from_str,
	)]
	pub dosage: Dosage,

	/// Date of ingestion. Defaults to the current date if unspecified.
	#[arg(
        short = 't',
        long = "date",
        default_value = "now",
        value_parser =  DateTime::<Local>::parse_value
	)]
	pub date: chrono::DateTime<Local>,

	/// Route of administration for the substance, defaulting to `"oral"`.
	#[arg(short = 'r', long = "roa", default_value = "oral", value_enum)]
	pub roa: RouteOfAdministrationClassification,
}
