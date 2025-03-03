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

use crate::database::DATABASE_CONNECTION;
use crate::ingestion::Ingestion;
use crate::substance::RoutesOfAdministration;
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::dosage::DosageClassification;

mod ingestion_flow;
pub mod model;
pub mod query;

pub use model::Report as IngestionReport;
pub use query::AnalyzeIngestion;
