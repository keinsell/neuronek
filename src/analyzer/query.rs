use crate::substance::route_of_administration::dosage::Dosage;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::Duration as TimeDelta;
use chrono::Local;
use chrono::TimeZone;
use clap::Parser;
use clap::arg;
use clap::command;
use derive_more::FromStr;
use miette::IntoDiagnostic;
use rust_decimal::Decimal;
use rust_decimal::prelude::FromPrimitive;
use rust_decimal_macros::dec;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::DatabaseConnection;
use sea_orm::EntityTrait;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use sea_orm::sea_query::ExprTrait;
use sea_orm_migration::IntoSchemaManagerConnection;
use std::ops::Range;
use std::str::FromStr;
use tracing::field::debug;
use uuid::Uuid;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;

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
/// - `roa`: The route of administration, which defaults to `"oral"` if no
///   other route is specified.
///
/// This structure should be used when you want to study ingestion patterns:
/// either by referencing a specific entry already stored in the system or by
/// supplying new ingestion details such as substance name, dosage, date, and
/// route of administration.
#[derive(Parser, Debug, bon::Builder)]
#[command(
    version,
    about = "Generate insights about a given ingestion",
    long_about = "Analyze ingestion entries either by referencing a unique identifier (ID) or by specifying a substance and dosage."
)]
pub struct AnalyzeIngestion
{
    #[arg(short, long, value_name = "INGESTION_ID")]
    pub ingestion_id: Option<i32>,

    /// Name of the substance involved in the ingestion (required if not providing `ingestion_id`).
    #[arg(short, long, value_name = "SUBSTANCE")]
    pub substance: String,

    /// Dosage of the substance involved in the ingestion (required if not providing `ingestion_id`).
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
        value_parser = crate::utils::parse_date_string,
    )]
    pub date: chrono::DateTime<Local>,

    /// Route of administration for the substance, defaulting to `"oral"`.
    #[arg(short = 'r', long = "roa", default_value = "oral", value_enum)]
    pub roa: RouteOfAdministrationClassification,
}