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

use crate::ingestion::Ingestion;
use crate::ingestion::IngestionPhase;
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::dosage::DosageClassification;
use crate::substance::route_of_administration::phase::PhaseClassificationFactor;
use crate::utils::DATABASE_CONNECTION;

mod model;
mod query;

pub use query::AnalyzeIngestion;
pub use model::Report as IngestionReport;

pub struct IngestionAnalyzer {}

impl IngestionAnalyzer
{
    // TODO: Design and implement structure that would represent analysis of
    // ingestion aside from ingestion data-model.
    pub async fn analyze_ingestion(
        analyze_ingestion: &AnalyzeIngestion,
    ) -> miette::Result<Ingestion>
    {
        let db: &DatabaseConnection = &DATABASE_CONNECTION;

        let substance_name = &analyze_ingestion.substance.clone();
        let dosage = analyze_ingestion.dosage;
        let date = analyze_ingestion.date;
        let route = analyze_ingestion.roa;

        let substance = get_substance(substance_name, db)
            .await
            .map_err(|e| miette::miette!("Failed to get substance: {}", e))?;

        let mut ingestion = Ingestion {
            id: analyze_ingestion.ingestion_id,
            substance_name: substance_name.clone(),
            dosage,
            route,
            ingestion_date: date,
            dosage_classification: None,
            substance: substance.clone().map(Box::new),
            phases: Vec::new(),
        };

        if ingestion.substance.is_none()
        {
            return Ok(ingestion);
        }

        let substance = ingestion.substance.as_ref().unwrap();
        let route_of_administration = substance
            .routes_of_administration
            .get(&analyze_ingestion.roa);

        if route_of_administration.is_none()
        {
            return Ok(ingestion);
        }

        let route_of_administration = route_of_administration.unwrap();
        let dosages = &route_of_administration.dosages;
        let ingestion_dosage = ingestion.dosage;

        ingestion.dosage_classification = dosages
            .iter()
            .find(|(_, range)| range.contains(&ingestion_dosage))
            .map(|(classification, _)| *classification)
            .or_else(|| {
                dosages
                    .iter()
                    .filter_map(|(_classification, range)| {
                        match (range.start.as_ref(), range.end.as_ref())
                        {
                            | (Some(start), _) if &ingestion_dosage >= start =>
                            {
                                Some(DosageClassification::Heavy)
                            }
                            | (_, Some(end)) if &ingestion_dosage <= end =>
                            {
                                Some(DosageClassification::Threshold)
                            }
                            | _ => None,
                        }
                    })
                    .next()
            });

        let phases = &route_of_administration.phases;
        let mut ingestion_phases = Vec::new();
        let mut prev_phase_end = ingestion.ingestion_date..ingestion.ingestion_date;

        for phase_class in crate::substance::route_of_administration::phase::PHASE_ORDER.iter()
        {
            if let Some(duration_range) = phases.get(phase_class)
            {
                let min_duration =
                    chrono::Duration::from_std(duration_range.start.to_std().unwrap()).unwrap();
                let max_duration =
                    chrono::Duration::from_std(duration_range.end.to_std().unwrap()).unwrap();

                let phase_start_time_min = prev_phase_end.start;
                let phase_start_time_max = prev_phase_end.end;
                let phase_end_time_min = phase_start_time_min + min_duration;
                let phase_end_time_max = phase_start_time_max + max_duration;
                prev_phase_end = phase_end_time_min..phase_end_time_max;


                let phase = IngestionPhase {
                    id: None,
                    class: *phase_class,
                    weight: {
                        let factor = PhaseClassificationFactor::from(*phase_class);
                        let dosage = ingestion.dosage.as_base_units();
                        let common_dosage = &dosages[&DosageClassification::Common];
                        let common_dosage_value = common_dosage.start.as_ref().unwrap();
                        let substance_weighted_dosage =
                            dosage / common_dosage_value.as_base_units();
                        let weighted_dosage = Decimal::from_f64(substance_weighted_dosage).unwrap();
                        weighted_dosage * factor.0
                    },
                    start_time: phase_start_time_min..phase_start_time_max,
                    end_time: phase_end_time_min..phase_end_time_max,
                    duration: min_duration..max_duration,
                    substance_name: ingestion.substance_name.clone(),
                };

                ingestion_phases.push(phase);
            }
        }
        ingestion.phases = ingestion_phases;

        Ok(ingestion)
    }
}
