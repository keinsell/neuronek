use std::str::FromStr;

use chrono::{DateTime, Local, TimeZone};
use clap::{Parser, arg};
use miette::IntoDiagnostic;
use rust_decimal::prelude::FromPrimitive;
use sea_orm::sea_query::ExprTrait;
use sea_orm::{ActiveModelTrait, EntityTrait, QueryOrder, QuerySelect};
use sea_orm_migration::IntoSchemaManagerConnection;

use crate::ValueParser;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;

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
