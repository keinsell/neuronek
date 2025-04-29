use sea_orm::{DbErr, EntityTrait, QueryFilter, ColumnTrait, QuerySelect, DatabaseConnection, FromQueryResult};
use std::collections::{HashMap, BTreeMap};
use chrono::{DateTime, Utc, Duration};
use crate::database::entities::prelude::IngestionPhase;
use crate::database::entities::ingestion_phase;
use sea_orm::Condition;
use serde::Serialize;

// Placeholder for data points
#[derive(Debug, Clone, Serialize)]
pub struct PromieniencePoint {
    pub time: DateTime<Utc>,
    pub intensity: f64, // Using f64 for intensity
}

// Use BTreeMap to keep results sorted by substance, and Vec for time points
pub type PromienienceResult = BTreeMap<String, Vec<PromieniencePoint>>;

// Placeholder for potential custom errors
#[derive(Debug, thiserror::Error)]
pub enum AnalysisError {
    #[error("Database error: {0}")]
    Database(#[from] DbErr),
    #[error("Calculation error: {0}")]
    Calculation(String),
    // Add other specific errors as needed
}

pub async fn calculate_promienience(
    db: &DatabaseConnection,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
    resolution: u32,
    smoothing_window: u32,
    substance_filter: Option<Vec<String>>,
) -> Result<PromienienceResult, AnalysisError> {
    // Validate resolution
    if resolution < 2 {
        return Err(AnalysisError::Calculation("Resolution must be at least 2".to_string()));
    }

    // --- Database Query --- 
    let mut condition = Condition::all()
        .add(ingestion_phase::Column::StartDateMin.lte(end_date))
        .add(ingestion_phase::Column::EndDateMax.gte(start_date));

    if let Some(substances) = substance_filter {
        if !substances.is_empty() {
            condition = condition.add(ingestion_phase::Column::SubstanceName.is_in(substances));
        }
    }

    let phases = IngestionPhase::find()
        .filter(condition)
        .select_only()
        .columns([
            ingestion_phase::Column::SubstanceName,
            ingestion_phase::Column::StartDateMin,
            ingestion_phase::Column::EndDateMax,
            ingestion_phase::Column::Weight,
        ])
        .into_model::<PartialIngestionPhase>()
        .all(db)
        .await?;

    if phases.is_empty() {
        println!("No relevant ingestion phases found for the given criteria.");
        return Ok(BTreeMap::new()); // Return empty if no data
    }

    println!("Fetched {} relevant ingestion phases.", phases.len());

    // --- Timeline Generation ---
    let total_duration = end_date - start_date;
    // Calculate time step to get 'resolution' points including start and end
    let time_step = total_duration / (resolution as i32 - 1);

    let timeline: Vec<DateTime<Utc>> = (0..resolution)
        .map(|i| start_date + time_step * (i as i32))
        .collect();

    // --- Intensity Aggregation ---
    let mut substance_intensities: HashMap<String, Vec<f64>> = HashMap::new();

    // Initialize intensity vectors for substances found in phases
    for phase in &phases {
        substance_intensities.entry(phase.substance_name.clone()).or_insert_with(|| vec![0.0; resolution as usize]);
    }

    // Aggregate intensities
    for (substance, intensities) in substance_intensities.iter_mut() {
        let substance_phases: Vec<&PartialIngestionPhase> = phases
            .iter()
            .filter(|p| p.substance_name == *substance)
            .collect();

        for (i, &time_point) in timeline.iter().enumerate() {
            for phase in &substance_phases {
                if time_point >= phase.start_date_min && time_point <= phase.end_date_max {
                    intensities[i] += phase.weight;
                }
            }
        }
    }
    
    // --- Smoothing (Moving Average) ---
    let mut final_results: PromienienceResult = BTreeMap::new();
    let window = smoothing_window as usize;

    for (substance, intensities) in substance_intensities {
        let smoothed_intensities = if window <= 1 || window >= intensities.len() {
            intensities // No smoothing or window too large
        } else {
            let mut smoothed = Vec::with_capacity(intensities.len());
            let half_window = window / 2;
            // Use rolling window approach (similar to pandas center=True)
            for i in 0..intensities.len() {
                 let start = i.saturating_sub(half_window);
                 // Adjust end based on whether window size is odd or even
                 let end = (i + half_window + (window % 2)).min(intensities.len());
                 let slice = &intensities[start..end];
                 let avg = slice.iter().sum::<f64>() / slice.len() as f64;
                 smoothed.push(avg);
            }
            smoothed
        };

        let points = timeline.iter().zip(smoothed_intensities.iter())
            .map(|(&time, &intensity)| PromieniencePoint { time, intensity })
            .collect();
            
        final_results.insert(substance, points);
    }

    Ok(final_results)
}

// Define a partial model for the select_only query
#[derive(Debug, FromQueryResult)]
struct PartialIngestionPhase {
    substance_name: String,
    start_date_min: DateTime<Utc>,
    end_date_max: DateTime<Utc>,
    weight: f64, // Assuming weight is stored/retrieved as f64 or compatible
} 