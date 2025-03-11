use crate::database::DATABASE_CONNECTION;
use crate::database::entities::ingestion_phase;
use crate::substance::route_of_administration::phase::PhaseClassification;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::TimeZone;
use miette::IntoDiagnostic;
use miette::Result;
use sea_orm::ColumnTrait;
use sea_orm::Condition;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use serde::Deserialize;
use serde::Serialize;
use std::collections::HashMap;
use std::ops::Deref;
use tabled::Tabled;

/// Represents a single data point in a time series
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimePoint
{
    /// The timestamp for this data point
    pub timestamp: DateTime<Local>,
    /// The weight/intensity value at this timestamp
    pub weight: f64,
}

/// Represents a complete time series for a substance's prominence
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubstanceTimeSeries
{
    /// The name of the substance
    pub substance_name: String,
    /// The data points showing prominence over time
    pub data_points: Vec<TimePoint>,
}

/// Represents a collection of time series data for multiple substances
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProminenceData
{
    /// Collection of time series data by substance
    pub substance_series: Vec<SubstanceTimeSeries>,
    /// The start time for the entire dataset
    pub start_time: DateTime<Local>,
    /// The end time for the entire dataset
    pub end_time: DateTime<Local>,
    /// The maximum weight value found in any series
    pub max_weight: f64,
    /// The total weight across all substances at each point in time
    pub total_weight_series: Vec<TimePoint>,
}

/// Summary information about substance prominence for display
#[derive(Debug, Clone, Tabled)]
pub struct SubstanceProminenceSummary
{
    #[tabled(rename = "Substance")]
    pub substance_name: String,
    #[tabled(rename = "Current Weight")]
    pub current_weight: String,
    #[tabled(rename = "Peak Weight")]
    pub peak_weight: String,
    #[tabled(rename = "Average Weight")]
    pub average_weight: String,
    #[tabled(rename = "Prominence %")]
    pub prominence_percentage: String,
}

const DEFAULT_RESOLUTION_MINUTES: i64 = 15;

/// Retrieves substance prominence data for a specified time range
///
/// This function fetches ingestion phase data from the database and processes
/// it to create time series data representing the prominence of each substance
/// over time.
///
/// # Arguments
/// * `start_time` - The start time for the data range
/// * `end_time` - The end time for the data range
/// * `resolution_minutes` - Optional resolution in minutes between data points
///   (defaults to 15)
///
/// # Returns
/// * A `Result` containing the `ProminenceData` if successful
pub async fn get_substance_prominence(
    start_time: DateTime<Local>,
    end_time: DateTime<Local>,
    resolution_minutes: Option<i64>,
) -> Result<ProminenceData>
{
    // Use default resolution if not specified
    let resolution = resolution_minutes.unwrap_or(DEFAULT_RESOLUTION_MINUTES);

    // Fetch phases from database
    let phases = fetch_phases(start_time, end_time).await?;

    // Return early if no phases found
    if phases.is_empty()
    {
        return Ok(ProminenceData {
            substance_series: vec![],
            start_time,
            end_time,
            max_weight: 0.0,
            total_weight_series: vec![],
        });
    }

    // Group phases by substance
    let phases_by_substance = group_phases_by_substance(phases);

    // Generate time points across the range
    let time_points = generate_time_points(start_time, end_time, resolution);

    // Calculate prominence for each substance at each time point
    let (substance_series, max_weight) =
        calculate_prominence_series(phases_by_substance, &time_points);

    // Calculate total weight across all substances for each time point
    let total_weight_series = calculate_total_weight_series(&substance_series, &time_points);

    Ok(ProminenceData {
        substance_series,
        start_time,
        end_time,
        max_weight,
        total_weight_series,
    })
}

/// Fetches relevant ingestion phases from the database
async fn fetch_phases(
    start_time: DateTime<Local>,
    end_time: DateTime<Local>,
) -> Result<Vec<ingestion_phase::Model>>
{
    // Query phases that might be active during the time period
    // A phase is considered relevant if:
    // - Its start time is before the end of our period AND
    // - Its end time is after the start of our period
    let phases = ingestion_phase::Entity::find()
        .filter(
            Condition::all()
                .add(ingestion_phase::Column::EndDateMax.gte(start_time.naive_utc()))
                .add(ingestion_phase::Column::StartDateMin.lte(end_time.naive_utc())),
        )
        .order_by_asc(ingestion_phase::Column::StartDateMin)
        .all(DATABASE_CONNECTION.deref())
        .await
        .into_diagnostic()?;

    Ok(phases)
}

/// Groups ingestion phases by substance name
fn group_phases_by_substance(
    phases: Vec<ingestion_phase::Model>,
) -> HashMap<String, Vec<ingestion_phase::Model>>
{
    phases.into_iter().fold(HashMap::new(), |mut acc, phase| {
        acc.entry(phase.substance_name.clone())
            .or_default()
            .push(phase);
        acc
    })
}

/// Generates evenly spaced time points for the time series
fn generate_time_points(
    start_time: DateTime<Local>,
    end_time: DateTime<Local>,
    resolution_minutes: i64,
) -> Vec<DateTime<Local>>
{
    let duration = end_time.signed_duration_since(start_time);
    let total_minutes = duration.num_minutes();
    let num_points = (total_minutes / resolution_minutes).max(1) as usize + 1;

    let mut time_points = Vec::with_capacity(num_points);
    for i in 0..num_points
    {
        let offset = Duration::minutes(i as i64 * resolution_minutes);
        time_points.push(start_time + offset);
    }

    time_points
}

/// Calculates prominence series for each substance
fn calculate_prominence_series(
    phases_by_substance: HashMap<String, Vec<ingestion_phase::Model>>,
    time_points: &[DateTime<Local>],
) -> (Vec<SubstanceTimeSeries>, f64)
{
    let mut substance_series = Vec::new();
    let mut overall_max_weight: f64 = 0.0;

    // Process each substance
    for (substance_name, phases) in phases_by_substance
    {
        let mut data_points = Vec::with_capacity(time_points.len());
        let mut max_substance_weight: f64 = 0.0;

        // Calculate prominence at each time point
        for &time_point in time_points
        {
            let weight = calculate_weight_at_time(&phases, time_point);
            max_substance_weight = max_substance_weight.max(weight);

            data_points.push(TimePoint {
                timestamp: time_point,
                weight,
            });
        }

        overall_max_weight = overall_max_weight.max(max_substance_weight);

        // Only include substances with non-zero weight
        if max_substance_weight > 0.0
        {
            substance_series.push(SubstanceTimeSeries {
                substance_name,
                data_points,
            });
        }
    }

    // Sort substances by maximum prominence (highest first)
    substance_series.sort_by(|a, b| {
        let a_max = a.data_points.iter().map(|p| p.weight).fold(0.0, f64::max);
        let b_max = b.data_points.iter().map(|p| p.weight).fold(0.0, f64::max);
        b_max
            .partial_cmp(&a_max)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    (substance_series, overall_max_weight)
}

/// Calculates total weight series across all substances
fn calculate_total_weight_series(
    substance_series: &[SubstanceTimeSeries],
    time_points: &[DateTime<Local>],
) -> Vec<TimePoint>
{
    let mut total_series = Vec::with_capacity(time_points.len());

    // For each time point, sum weights across all substances
    for (i, &time_point) in time_points.iter().enumerate()
    {
        let total_weight = substance_series
            .iter()
            .filter_map(|series| series.data_points.get(i))
            .map(|point| point.weight)
            .sum();

        total_series.push(TimePoint {
            timestamp: time_point,
            weight: total_weight,
        });
    }

    total_series
}

/// Calculates the prominence weight at a specific time point
fn calculate_weight_at_time(phases: &[ingestion_phase::Model], time: DateTime<Local>) -> f64
{
    let mut total_weight = 0.0;

    for phase in phases
    {
        // Parse time bounds from the model
        let start_time_min = Local.from_utc_datetime(&phase.start_date_min);
        let end_time_max = Local.from_utc_datetime(&phase.end_date_max);

        // Skip if time is outside phase bounds
        if time < start_time_min || time > end_time_max
        {
            continue;
        }

        // Calculate phase progress as a value from 0.0 to 1.0
        let phase_duration = end_time_max.signed_duration_since(start_time_min);
        let elapsed = time.signed_duration_since(start_time_min);
        let progress =
            (elapsed.num_milliseconds() as f64) / (phase_duration.num_milliseconds() as f64);
        let progress = progress.max(0.0).min(1.0);

        // Get base weight from the phase
        let base_weight: f64 = phase.weight.to_string().parse().unwrap_or(0.0);

        // Apply intensity curve based on phase classification
        let classification = match phase.classification.as_str()
        {
            | "Onset" => PhaseClassification::Onset,
            | "Comeup" => PhaseClassification::Comeup,
            | "Peak" => PhaseClassification::Peak,
            | "Comedown" => PhaseClassification::Comedown,
            | "Afterglow" => PhaseClassification::Afterglow,
            | _ => PhaseClassification::Unknown,
        };

        let intensity_factor = apply_intensity_curve(classification, progress);
        let adjusted_weight = base_weight * intensity_factor;

        total_weight += adjusted_weight;
    }

    total_weight
}

/// Applies an intensity curve based on phase classification and progress
fn apply_intensity_curve(classification: PhaseClassification, progress: f64) -> f64
{
    match classification
    {
        | PhaseClassification::Onset => onset_curve(progress),
        | PhaseClassification::Comeup => comeup_curve(progress),
        | PhaseClassification::Peak => peak_curve(progress),
        | PhaseClassification::Comedown => comedown_curve(progress),
        | PhaseClassification::Afterglow => afterglow_curve(progress),
        | PhaseClassification::Unknown => 0.0,
    }
}

// Intensity curve functions - these are adapted from the TUI implementation
// and return a value between 0.0 and 1.0 representing intensity at a given
// point

fn onset_curve(progress: f64) -> f64
{
    // S-shaped curve with slow start, gradual increase
    let normalized = progress.max(0.0).min(1.0);
    0.5 * normalized.powf(2.0) * (3.0 - 2.0 * normalized)
}


fn comeup_curve(progress: f64) -> f64
{
    // Steep increase following sigmoid-like curve
    let normalized = progress.max(0.0).min(1.0);
    0.2 + 0.8 * normalized.powf(1.2) * (1.0 - 0.3 * normalized)
}

fn peak_curve(progress: f64) -> f64
{
    // Bell curve centered at the middle of the peak phase
    let normalized = progress.max(0.0).min(1.0);
    let centered = 2.0 * (normalized - 0.5);
    0.75 + 0.25 * (1.0 - centered.powf(2.0))
}

fn comedown_curve(progress: f64) -> f64
{
    // Gradual decrease with longer tail
    let normalized = progress.max(0.0).min(1.0);
    0.8 * (1.0 - normalized.powf(0.8))
}

fn afterglow_curve(progress: f64) -> f64
{
    // Very low, gradual linear decrease
    let normalized = progress.max(0.0).min(1.0);
    0.3 * (1.0 - normalized)
}

/// Generates a summary of substance prominence for display
pub fn generate_prominence_summary(
    prominence_data: &ProminenceData,
) -> Vec<SubstanceProminenceSummary>
{
    // Find current time index (use the last point if not found)
    let now = Local::now();
    let current_time_idx = prominence_data
        .substance_series
        .first()
        .and_then(|series| {
            series
                .data_points
                .iter()
                .position(|point| point.timestamp >= now)
                .or(series.data_points.len().checked_sub(1))
        })
        .unwrap_or(0);

    // Calculate total weight at current time
    let total_current_weight = prominence_data
        .substance_series
        .iter()
        .filter_map(|series| series.data_points.get(current_time_idx))
        .map(|point| point.weight)
        .sum::<f64>();

    prominence_data
        .substance_series
        .iter()
        .map(|series| {
            let peak_weight = series
                .data_points
                .iter()
                .map(|point| point.weight)
                .fold(0.0, f64::max);

            let avg_weight = if !series.data_points.is_empty()
            {
                series
                    .data_points
                    .iter()
                    .map(|point| point.weight)
                    .sum::<f64>()
                    / series.data_points.len() as f64
            }
            else
            {
                0.0
            };

            let current_weight = series
                .data_points
                .get(current_time_idx)
                .map(|point| point.weight)
                .unwrap_or(0.0);

            let prominence_pct = if total_current_weight > 0.0
            {
                current_weight / total_current_weight * 100.0
            }
            else
            {
                0.0
            };

            SubstanceProminenceSummary {
                substance_name: series.substance_name.clone(),
                current_weight: format!("{:.2}", current_weight),
                peak_weight: format!("{:.2}", peak_weight),
                average_weight: format!("{:.2}", avg_weight),
                prominence_percentage: format!("{:.1}%", prominence_pct),
            }
        })
        .collect()
}

/// Returns the current most prominent substance based on weight
pub fn get_most_prominent_substance(prominence_data: &ProminenceData) -> Option<String>
{
    // Find current time index (use the last point if not found)
    let now = Local::now();
    let current_time_idx = prominence_data
        .substance_series
        .first()
        .and_then(|series| {
            series
                .data_points
                .iter()
                .position(|point| point.timestamp >= now)
                .or(series.data_points.len().checked_sub(1))
        })
        .unwrap_or(0);

    // Find substance with highest current weight
    prominence_data
        .substance_series
        .iter()
        .map(|series| {
            let current_weight = series
                .data_points
                .get(current_time_idx)
                .map(|point| point.weight)
                .unwrap_or(0.0);

            (series.substance_name.clone(), current_weight)
        })
        .max_by(|(_, weight_a), (_, weight_b)| {
            weight_a
                .partial_cmp(weight_b)
                .unwrap_or(std::cmp::Ordering::Equal)
        })
        .filter(|(_, weight)| *weight > 0.0)
        .map(|(name, _)| name)
}


#[cfg(test)]
mod tests
{
    use super::*;
    use chrono::Duration;

    #[async_std::test]
    async fn test_substance_prominence_time_range()
    {
        let now = Local::now();
        let start_time = now - Duration::hours(24);
        let end_time = now + Duration::hours(24);

        // Test with default resolution
        let result = get_substance_prominence(start_time, end_time, None).await;
        assert!(
            result.is_ok(),
            "Should successfully retrieve prominence data"
        );

        // Test with custom resolution
        let result = get_substance_prominence(start_time, end_time, Some(30)).await;
        assert!(
            result.is_ok(),
            "Should successfully retrieve prominence data with custom resolution"
        );

        // The data might be empty in test environment, but the function should still
        // succeed
        let data = result.unwrap();

        // Generate summaries should work even with empty data
        let summaries = generate_prominence_summary(&data);
        assert!(
            summaries.len() == data.substance_series.len(),
            "Should generate a summary for each substance"
        );

        // Most prominent substance might be None if no data
        let _ = get_most_prominent_substance(&data);
    }

    #[async_std::test]
    async fn test_substance_prominence_calculation()
    {
        let now = Local::now();
        let start_time = now - Duration::hours(6);
        let end_time = now + Duration::hours(6);

        // Use a short resolution for faster test
        let result = get_substance_prominence(start_time, end_time, Some(60)).await;
        assert!(
            result.is_ok(),
            "Should successfully retrieve prominence data"
        );

        let data = result.unwrap();

        // Check that time points are consistent with the range requested
        if !data.substance_series.is_empty() && !data.substance_series[0].data_points.is_empty()
        {
            let first_series = &data.substance_series[0];

            // First point should be close to start time (within a minute)
            let first_point = &first_series.data_points[0];
            let first_time_diff = (first_point.timestamp - start_time).num_seconds().abs();
            assert!(
                first_time_diff < 60,
                "First point should be close to start time"
            );

            // Last point should be close to end time (within a minute)
            let last_point = &first_series.data_points[first_series.data_points.len() - 1];
            let last_time_diff = (last_point.timestamp - end_time).num_seconds().abs();
            assert!(
                last_time_diff < 60,
                "Last point should be close to end time"
            );

            // Time points should be roughly 60 minutes apart (our requested resolution)
            if first_series.data_points.len() >= 2
            {
                let time_diff = (first_series.data_points[1].timestamp
                    - first_series.data_points[0].timestamp)
                    .num_minutes();
                assert_eq!(
                    time_diff, 60,
                    "Time difference between points should match requested resolution"
                );
            }
        }

        // Check that total weight series has same number of points as individual series
        if !data.substance_series.is_empty()
        {
            let expected_points = data.substance_series[0].data_points.len();
            assert_eq!(
                data.total_weight_series.len(),
                expected_points,
                "Total weight series should have same number of points as individual series"
            );
        }
    }
}
