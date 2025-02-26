use crate::DATABASE_CONNECTION;
use crate::core::QueryHandler;
use crate::database::entities::ingestion;
use crate::database::entities::ingestion::Entity as IngestionEntity;
use crate::database::entities::ingestion_phase;
use crate::ingestion::IngestionPhase;
use crate::ingestion::model::Ingestion;
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::RouteOfAdministration;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::dosage::DosageClassification;
use crate::substance::route_of_administration::phase::PhaseClassification;
use crate::substance::route_of_administration::phase::PhaseClassificationFactor;
use crate::utils::AppContext;
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
pub(crate) use crate::analyzer::AnalyzeIngestion;

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


#[async_trait::async_trait]
impl crate::core::QueryHandler<Vec<Ingestion>> for ListIngestion
{
    async fn query(&self) -> miette::Result<Vec<Ingestion>>
    {
        let ingestions = crate::database::entities::prelude::Ingestion::find()
            .order_by_desc(ingestion::Column::IngestedAt)
            .limit(Some(self.limit))
            .all(&DATABASE_CONNECTION.into_schema_manager_connection())
            .await
            .into_diagnostic()?
            .iter()
            .map(|i| Ingestion::from(i.clone()))
            .collect();

        Ok(ingestions)
    }
}

#[async_trait]
impl QueryHandler<Ingestion> for AnalyzeIngestion
{
    async fn query(&self) -> miette::Result<Ingestion>
    {
        let ingestion = crate::analyzer::IngestionAnalyzer::analyze_ingestion(self).await?;
        Ok(ingestion)
    }
}
