use std::ops::Deref;

use chrono::Local;
use miette::IntoDiagnostic;
use sea_orm::{
	ActiveModelTrait,
	ActiveValue,
	ColumnTrait,
	EntityTrait,
	QueryFilter,
	QueryOrder,
	QuerySelect,
};
use uuid::Uuid;

pub(crate) use super::analyzer::analyze_ingestion;
use crate::database::entities::{ingestion, ingestion_phase};
use crate::database::{DATABASE_CONNECTION, DatabaseConnection};
use crate::ingestion::action::ListIngestion;
use crate::ingestion::model::{AnalyzeIngestion, IngestionPhases};
use crate::ingestion::phase::IngestionPhase;
use crate::ingestion::{Ingestion, LogIngestion};

#[tracing::instrument]
pub async fn log_ingestion(
	command: &LogIngestion, database_connection: &DatabaseConnection,
) -> miette::Result<Ingestion>
{
	let ingestion = analyze_ingestion(&AnalyzeIngestion {
		ingestion_id: None,
		substance: command.substance_name.clone(),
		dosage: command.dosage,
		date: command.ingestion_date,
		roa: command.route_of_administration,
	})
	.await?;

	let mut model: Ingestion = ingestion::ActiveModel {
		id: ActiveValue::NotSet,
		substance_name: ActiveValue::Set(ingestion.substance_name.into()),
		route_of_administration: ActiveValue::Set(
			serde_json::to_value(ingestion.route)
				.unwrap()
				.as_str()
				.unwrap()
				.to_string(),
		),
		dosage: ActiveValue::Set(command.dosage.as_base_units() as f32),
		ingested_at: ActiveValue::Set(command.ingestion_date.naive_utc()),
		updated_at: ActiveValue::Set(Local::now().naive_utc()),
		created_at: ActiveValue::Set(Local::now().naive_utc()),
	}
	.insert(database_connection)
	.await
	.into_diagnostic()?
	.into();


	if !ingestion.phases.0.is_empty() {
		model.phases = insert_ingestion_phases(ingestion.phases, database_connection).await?;
	}

	Ok(model)
}

#[tracing::instrument]
pub async fn get_ingestion(ingestion_id: i32) -> miette::Result<Option<Ingestion>>
{
	let ingestion = ingestion::Entity::find_by_id(ingestion_id)
		.one(DATABASE_CONNECTION.deref())
		.await
		.into_diagnostic()?;

	if let Some(ingestion_model) = ingestion {
		let mut ingestion = Ingestion::from(ingestion_model);

		let phases = ingestion_phase::Entity::find()
			.filter(ingestion_phase::Column::IngestionId.eq(ingestion_id))
			.all(DATABASE_CONNECTION.deref())
			.await
			.into_diagnostic()?;

		let phases: Vec<IngestionPhase> = phases.into_iter().map(IngestionPhase::from).collect();
		ingestion.phases = IngestionPhases::from(phases);

		Ok(Some(ingestion))
	} else {
		Ok(None)
	}
}

#[tracing::instrument]
pub async fn list_ingestion(query: ListIngestion) -> miette::Result<Vec<Ingestion>>
{
	let ingestion = ingestion::Entity::find()
		.order_by_desc(ingestion::Column::IngestedAt)
		.limit(query.limit)
		.all(DATABASE_CONNECTION.deref())
		.await
		.into_diagnostic()?;

	let ingestions: Vec<Ingestion> = ingestion.into_iter().map(Ingestion::from).collect();

	Ok(ingestions)
}

#[tracing::instrument]
async fn insert_ingestion_phases(
	ingestion_phases: IngestionPhases, database_connection: &DatabaseConnection,
) -> miette::Result<IngestionPhases>
{
	use sea_orm::ActiveValue;

	let mut phases: Vec<IngestionPhase> = Vec::new();

	for phase in &ingestion_phases.0 {
		let mut phase: IngestionPhase = ingestion_phase::ActiveModel {
			id: ActiveValue::Set(Uuid::new_v4().to_string()),
			ingestion_id: ActiveValue::Set(phase.ingestion_id.unwrap()),
			substance_name: ActiveValue::Set(phase.substance_name.clone()),
			classification: ActiveValue::Set(phase.classification.to_string()),
			start_date_min: ActiveValue::Set(phase.start_time.start.naive_utc()),
			start_date_max: ActiveValue::Set(phase.start_time.end.naive_utc()),
			end_date_min: ActiveValue::Set(phase.end_time.start.naive_utc()),
			end_date_max: ActiveValue::Set(phase.end_time.end.naive_utc()),
			duration_min: ActiveValue::Set(phase.duration.start.to_string()),
			duration_max: ActiveValue::Set(phase.duration.end.to_string()),
			weight: ActiveValue::Set(phase.weight.0),
			created_at: ActiveValue::Set(Local::now().to_rfc3339()),
			updated_at: ActiveValue::Set(Local::now().to_rfc3339()),
		}
		.insert(database_connection)
		.await
		.into_diagnostic()?
		.into();

		phases.push(IngestionPhase::from(phase));
	}

	Ok(IngestionPhases::from(phases))
}


#[cfg(test)]
mod tests
{
	use std::ops::Deref;
	use std::str::FromStr;

	use chrono::Local;
	use sea_orm::EntityTrait;

	use crate::database::DATABASE_CONNECTION;
	use crate::database::entities::ingestion;
	use crate::ingestion::LogIngestion;
	use crate::ingestion::service::log_ingestion;
	use crate::substance::route_of_administration::RouteOfAdministrationClassification;
	use crate::substance::route_of_administration::dosage::Dosage;

	#[async_std::test]
	async fn should_log_ingestion()
	{
		let db = &DATABASE_CONNECTION;

		let cmd = LogIngestion {
			substance_name: "TestSubstance".to_string(),
			dosage: Dosage::from_str("100 mg").unwrap(),
			ingestion_date: Local::now(),
			route_of_administration: RouteOfAdministrationClassification::Sublingual,
		};

		let result = log_ingestion(&cmd, db).await.unwrap();

		let db_entry = ingestion::Entity::find_by_id(result.id.unwrap())
			.one(DATABASE_CONNECTION.deref())
			.await
			.unwrap()
			.unwrap();

		assert_eq!(db_entry.route_of_administration, "sublingual");
		assert_eq!(db_entry.id, 1);
		assert_eq!(db_entry.substance_name, "testsubstance");
	}
}
