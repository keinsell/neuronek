use std::str::FromStr;

use chrono::{DateTime, Local};
use chrono_english::Dialect;
use clap::{Parser, Subcommand};
use miette::IntoDiagnostic;
use serde::{Deserialize, Serialize};

use crate::ValueParser;
use crate::cli::is_interactive;
use crate::ingestion::model::AnalyzeIngestion;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;

/**
# Log Ingestion

The `Log Ingestion` feature is the core functionality of neuronek, enabling users to record
information about any substances they consume.
This feature is designed for tracking supplements, medications, nootropics,
or any psychoactive substances in a structured and organized way.

By logging ingestion, users can provide details such as the substance.rs name, dosage, and the time of ingestion.
This data is stored in a low-level database that serves as the foundation for further features,
such as journaling, analytics, or integrations with external tools.
While power users may prefer to work directly with this raw data,
many user-friendly abstractions are planned to make this process seamless,
such as simplified commands (e.g., `neuronek a coffee`) for quicker entries.

Logging ingestion not only serves the purpose of record-keeping
but also helps users build a personalized database of their consumption habits.
This database can be used to analyze trends over time,
providing insights into the long-term effects of different substances on physical and mental well-being.
*/
#[derive(Parser, Debug)]
#[command(
    version,
    about = "Create a new ingestion record",
    long_about,
    aliases = vec!["create", "add", "make", "new", "mk"]
)]
pub struct LogIngestion
{
	/// Name of substance.rs that is being ingested, e.g. "Paracetamol"
	#[arg(short = 's', long = "substance", required = true)]
	pub substance_name: String,
	/// Dosage of given substance.rs provided as string with unit (e.g., 10 mg)
	#[arg(
        short = 'd',
        long = "dosage",
        required = true,
        value_parser = Dosage::from_str
    )]
	pub dosage: Dosage,
	/// Date of ingestion, by default current date is used if not provided.
	///
	/// Date can be provided as timestamp and in human-readable format such as
	/// "today 10:00", "yesterday 13:00", "monday 15:34" which will be later
	/// parsed into proper timestamp.
	#[arg(
        short='t',
        long="date",
        default_value = "now",
        value_parser=DateTime::<Local>::parse_value
    )]
	pub ingestion_date: DateTime<Local>,
	/// Route of administration related to given ingestion (defaults to "oral")
	#[arg(short = 'r', long = "roa", default_value = "oral", value_enum)]
	pub route_of_administration: RouteOfAdministrationClassification,
}

#[derive(Parser, Debug)]
#[command(version, about = "Update an existing ingestion", aliases = vec![ "edit"])]
pub struct UpdateIngestion
{
	/// ID of the ingestion to update
	#[arg(index = 1, value_name = "INGESTION_ID")]
	pub ingestion_identifier: i32,

	/// New name of the substance.rs (optional)
	#[arg(short = 'n', long = "name", value_name = "SUBSTANCE_NAME")]
	pub substance_name: Option<String>,

	/// New dosage (optional, e.g., 20 mg)
	#[arg(short = 'd', long = "dosage", value_name = "DOSAGE", value_parser=Dosage::from_str)]
	pub dosage: Option<Dosage>,

	/// New ingestion date (optional, e.g., "today 10:00")
	#[arg(short = 't', long = "date", value_name = "INGESTION_DATE", value_parser=DateTime::<Local>::parse_value
    )]
	pub ingestion_date: Option<DateTime<Local>>,

	/// New route of administration (optional, defaults to "oral")
	#[arg(short = 'r', long = "roa", value_enum)]
	pub route_of_administration: Option<RouteOfAdministrationClassification>,
}

#[derive(Parser, Debug)]
#[command(version, about = "Delete selected ingestion", long_about, aliases = vec!["rm", "del",
                                                                                   "remove"])]
pub struct DeleteIngestion
{
	#[arg(
		index = 1,
		value_name = "INGESTION_ID",
		help = "ID of the ingestion to delete"
	)]
	pub ingestion_id: i32,
	#[clap(short, long, default_value_t=is_interactive())]
	pub interactive: bool,
	#[clap(short = 'y', long = "no-confirm")]
	pub confirmation: Option<bool>,
}


#[derive(Parser, Debug)]
#[command(
    version,
    about = "View detailed information about a specific ingestion",
    aliases = vec!["show", "display", "info"]
)]
pub struct ViewIngestion
{
	#[arg(
		index = 1,
		value_name = "INGESTION_ID",
		help = "ID of the ingestion to view"
	)]
	pub ingestion_id: i32,
}

#[derive(Parser, Debug, Copy, Clone, Serialize, Deserialize, bon::Builder)]
#[command(version, about = "Query ingestions", long_about, aliases = vec!["ls", "get"])]
pub struct ListIngestion
{
	/// Defines the amount of ingestion to display
	#[arg(short = 'l', long, default_value_t = 10)]
	pub limit: u64,
}

impl std::default::Default for ListIngestion
{
	fn default() -> Self { Self::builder().limit(100).build() }
}


#[derive(Debug, Subcommand)]
pub enum Actions
{
	/// Create a new ingestion record
	Log(LogIngestion),
	/// List all ingestions
	List(ListIngestion),
	/// Delete an ingestion
	Delete(DeleteIngestion),
	/// Update an existing ingestion
	Update(UpdateIngestion),
	Analyze(AnalyzeIngestion),
	/// View details of a specific ingestion
	View(ViewIngestion),
}
