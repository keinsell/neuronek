use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use chrono::DateTime;
use chrono::Local;
use chrono_english::Dialect;
use clap::Parser;
use clap::Subcommand;
use miette::IntoDiagnostic;
use std::str::FromStr;

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
        value_parser=parse_date_string
    )]
    pub ingestion_date: DateTime<Local>,
    /// Route of administration related to given ingestion (defaults to "oral")
    #[arg(short = 'r', long = "roa", default_value = "oral", value_enum)]
    pub route_of_administration: RouteOfAdministrationClassification,
}

fn parse_date_string(humanized_input: &str) -> miette::Result<chrono::DateTime<chrono::Local>>
{
    chrono_english::parse_date_string(humanized_input, Local::now(), Dialect::Us).into_diagnostic()
}

#[derive(Debug, Subcommand)]
pub enum Commands
{
    Log(LogIngestion),
}
