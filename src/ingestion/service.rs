use crate::analyzer::AnalyzeIngestion;
use crate::database::DATABASE_CONNECTION;
use crate::database::entities::ingestion;
use crate::database::entities::ingestion_phase;
use crate::ingestion::Ingestion;
use crate::ingestion::LogIngestion;
use crate::ingestion::action::ListIngestion;
use crate::ingestion::model::IngestionPhases;
use crate::ingestion::phase::IngestionPhase;
use crate::substance::Substance;
use crate::substance::repository::get_substance;
use chrono::Local;
use chrono::Utc;
use hashbrown::HashMap;
use miette::IntoDiagnostic;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use std::ops::Deref;
use tracing::Level;
use tracing::event;
use uuid::Uuid;

pub async fn log_ingestion(command: &LogIngestion) -> miette::Result<Ingestion>
{
    let substance = get_substance(&command.substance_name)
        .await
        .map_err(|e| miette::miette!("Failed to get substance: {}", e))?
        .ok_or_else(|| miette::miette!("Substance not found"))?;

    let analyze_request = AnalyzeIngestion {
        ingestion_id: None,
        substance: command.substance_name.clone(),
        dosage: command.dosage,
        date: command.ingestion_date,
        roa: command.route_of_administration,
    };

    let analysis_report = crate::analyzer::IngestionReport::build(&analyze_request, &substance)?;

    let ingestion_model = ingestion::ActiveModel {
        id: ActiveValue::NotSet,
        substance_name: ActiveValue::Set(command.substance_name.clone().to_lowercase()),
        route_of_administration: ActiveValue::Set(
            serde_json::to_string(&command.route_of_administration).unwrap(),
        ),
        dosage: ActiveValue::Set(command.dosage.as_base_units() as f32),
        ingested_at: ActiveValue::Set(command.ingestion_date.naive_utc()),
        updated_at: ActiveValue::Set(Local::now().naive_utc()),
        created_at: ActiveValue::Set(Local::now().naive_utc()),
    };

    let ingestion_model = ingestion_model
        .insert(DATABASE_CONNECTION.deref())
        .await
        .into_diagnostic()?;

    let mut phases = vec![];
    for phase in analysis_report.phases.0
    {
        let phase_model = ingestion_phase::ActiveModel {
            id: ActiveValue::Set(Uuid::new_v4().to_string()),
            ingestion_id: ActiveValue::Set(ingestion_model.id),
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
        };

        let saved_phase = phase_model
            .insert(DATABASE_CONNECTION.deref())
            .await
            .into_diagnostic()?;

        let phase = IngestionPhase::from(saved_phase);
        phases.push(phase);
    }

    let mut ingestion = Ingestion::from(ingestion_model);
    ingestion.phases = IngestionPhases(phases);

    Ok(ingestion)
}

pub async fn get_ingestion(ingestion_id: i32) -> miette::Result<Option<Ingestion>>
{
    let ingestion = ingestion::Entity::find_by_id(ingestion_id)
        .one(DATABASE_CONNECTION.deref())
        .await
        .into_diagnostic()?;

    if let Some(ingestion_model) = ingestion
    {
        let mut ingestion = Ingestion::from(ingestion_model);

        let phases = ingestion_phase::Entity::find()
            .filter(ingestion_phase::Column::IngestionId.eq(ingestion_id))
            .all(DATABASE_CONNECTION.deref())
            .await
            .into_diagnostic()?;

        let phases: Vec<IngestionPhase> = phases.into_iter().map(IngestionPhase::from).collect();
        ingestion.phases = IngestionPhases::from(phases);

        Ok(Some(ingestion))
    }
    else
    {
        Ok(None)
    }
}

pub async fn list_ingestions(query: ListIngestion) -> miette::Result<Vec<Ingestion>>
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
