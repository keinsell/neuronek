use std::str::FromStr;

use chrono::TimeZone;
use clap::Parser;
use miette::IntoDiagnostic;
use rust_decimal::prelude::FromPrimitive;
use sea_orm::sea_query::ExprTrait;
use sea_orm::{ActiveModelTrait, EntityTrait, QueryOrder, QuerySelect};
use sea_orm_migration::IntoSchemaManagerConnection;

pub mod model;
pub mod query;
mod service;

pub use model::Report as IngestionReport;
pub use query::AnalyzeIngestion;
pub use service::analyze_ingestion;
