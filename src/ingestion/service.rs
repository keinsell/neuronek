use crate::core::QueryHandler;
use crate::database::IngestionPhase;
use crate::database::entities::ingestion;
use crate::database::entities::ingestion_phase;
use crate::ingestion::Ingestion;
use crate::ingestion::LogIngestion;
use crate::ingestion::query::AnalyzeIngestion;
use crate::utils::DATABASE_CONNECTION;
use chrono::Local;
use miette::IntoDiagnostic;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::EntityTrait;
use std::ops::Deref;
use tracing::Level;
use tracing::event;
use uuid::Uuid;

pub struct IngestionService {}

impl IngestionService
{
    pub async fn log(command: &LogIngestion) -> miette::Result<Ingestion>
    {
        let substance_name = pubchem::Compound::with_name(&command.substance_name)
            .title()
            .into_diagnostic()
            .unwrap_or(command.substance_name.clone());

        let ingestion = crate::database::Ingestion::insert(ingestion::ActiveModel {
            id: ActiveValue::default(),
            substance_name: ActiveValue::Set(substance_name.to_lowercase().clone()),
            route_of_administration: ActiveValue::Set(
                serde_json::to_value(command.route_of_administration)
                    .unwrap()
                    .as_str()
                    .unwrap()
                    .to_string(),
            ),
            dosage: ActiveValue::Set(command.dosage.as_base_units() as f32),
            dosage_classification: ActiveValue::NotSet,
            ingested_at: ActiveValue::Set(command.ingestion_date.to_utc().naive_local()),
            updated_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
            created_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
        })
        .exec_with_returning(DATABASE_CONNECTION.deref())
        .await
        .into_diagnostic()?;

        event!(name: "ingestion_logged", Level::INFO, ingestion=?&ingestion);

        let analysis_query = AnalyzeIngestion::builder()
            .substance(command.substance_name.clone())
            .date(command.ingestion_date)
            .dosage(command.dosage)
            .roa(command.route_of_administration)
            .ingestion_id(ingestion.id)
            .build();

        match analysis_query.query().await
        {
            | Ok(analysis) =>
            {
                let mut analysis = analysis;
                analysis.id = Some(ingestion.id);

                if analysis.dosage_classification.is_some()
                {
                    let update_model = ingestion::ActiveModel {
                        id: ActiveValue::Set(ingestion.id),
                        dosage_classification: ActiveValue::Set(
                            analysis.dosage_classification.map(|d| d.to_string()),
                        ),
                        ..Default::default()
                    };

                    update_model
                        .update(DATABASE_CONNECTION.deref())
                        .await
                        .into_diagnostic()?;

                    if !analysis.phases.is_empty()
                    {
                        let phase_models = analysis
                            .phases
                            .clone()
                            .into_iter()
                            .map(|phase| ingestion_phase::ActiveModel {
                                id: ActiveValue::Set(Uuid::new_v4().to_string()),
                                ingestion_id: ActiveValue::Set(ingestion.id),
                                classification: ActiveValue::Set(phase.class.to_string()),
                                start_date_min: ActiveValue::Set(
                                    phase.start_time.start.naive_utc(),
                                ),
                                start_date_max: ActiveValue::Set(phase.start_time.end.naive_utc()),
                                end_date_min: ActiveValue::Set(phase.end_time.start.naive_utc()),
                                end_date_max: ActiveValue::Set(phase.end_time.end.naive_utc()),
                                common_dosage_weight: ActiveValue::Set(
                                    command.dosage.as_base_units() as i32,
                                ),
                                duration_min: ActiveValue::Set(
                                    phase.duration.start.num_minutes() as i32
                                ),
                                duration_max: ActiveValue::Set(
                                    phase.duration.end.num_minutes() as i32
                                ),
                                notes: ActiveValue::NotSet,
                                created_at: ActiveValue::Set(Local::now().to_string()),
                                updated_at: ActiveValue::Set(Local::now().to_string()),
                            })
                            .collect::<Vec<_>>();

                        IngestionPhase::insert_many(phase_models.clone())
                            .exec(DATABASE_CONNECTION.deref())
                            .await
                            .into_diagnostic()?;

                        event!(
                            name: "ingestion_analyzed",
                            Level::INFO,
                            ingestion = ?&analysis,
                        );

                        analysis.phases = vec![];
                    }
                }
            }
            | Err(e) =>
            {
                event!(
                    name: "ingestion_analysis_failed",
                    Level::WARN,
                    error = ?e,
                    ingestion_id = ingestion.id
                );
            }
        }

        Ok(Ingestion::from(ingestion))
    }
}
