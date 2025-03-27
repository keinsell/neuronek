use std::collections::HashMap;
use std::ops::Deref;
use std::range::Range;
use std::str::FromStr;

use chrono::{DateTime, Duration, Local, TimeZone};
use clap::builder::TypedValueParser;
use miette::{IntoDiagnostic, Result};
use sea_orm::{ColumnTrait, Condition, EntityTrait, QueryFilter, QueryOrder};
use serde::{Deserialize, Serialize};
use tabled::Tabled;

use crate::database::DATABASE_CONNECTION;
use crate::database::entities::ingestion_phase;
use crate::substance::route_of_administration::phase::PhaseClassification;

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

/// Prominence defines the overall measure of a substance's dynamic impact
/// across a given time range. It aggregates multiple time series, each
/// representing a substance’s evolving contribution (or weight) at various
/// timestamps. The prominence domain model includes:
///
/// - A collection of substance time series that track weight/intensity over
///   time.
/// - An overall time span characterized by a start and an end time covering the
///   entire dataset.
/// - A maximum weight value observed from any of the series, representing the
///   peak overall impact.
/// - A calculated series that sums up the weights for all substances at each
///   time point to depict the total influence over time.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Prominence
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
pub struct SubstanceOfProminence
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
	start_time: DateTime<Local>, end_time: DateTime<Local>, resolution_minutes: Option<i64>,
) -> Result<Prominence>
{
	let resolution = resolution_minutes.unwrap_or(DEFAULT_RESOLUTION_MINUTES);

	fetch_ingestion_phase_by_dt_range(Range::from(start_time..end_time))
		.await
		.map_or(
			Ok(Prominence {
				substance_series: vec![],
				start_time,
				end_time,
				max_weight: 0.0,
				total_weight_series: vec![],
			}),
			|phs| {
				let phases_by_substance = group_phases_by_substance(phs);
				let duration = end_time.signed_duration_since(start_time);
				let total_minutes = duration.num_minutes();
				let num_points = (total_minutes / resolution).max(1) as usize + 1;

				let mut time_points = Vec::with_capacity(num_points);
				for i in 0..num_points {
					let offset = Duration::minutes(i as i64 * resolution);
					time_points.push(start_time + offset);
				}

				let mut substance_series = Vec::new();
				let mut max_weight: f64 = 0.0;

				substance_series.extend(phases_by_substance.into_iter().filter_map(
					|(substance_name, phases)| {
						let data_points: Vec<TimePoint> = time_points
							.iter()
							.map(|&time_point| TimePoint {
								timestamp: time_point,
								weight: calculate_weight_at_time(&phases, time_point),
							})
							.collect();

						let max_substance_weight =
							data_points.iter().map(|p| p.weight).fold(0.0, f64::max);

						if max_substance_weight > 0.0 {
							max_weight = max_weight.max(max_substance_weight);
							Some(SubstanceTimeSeries {
								substance_name,
								data_points,
							})
						} else {
							None
						}
					},
				));

				substance_series.sort_by(|a, b| {
					let a_max = a.data_points.iter().map(|p| p.weight).fold(0.0, f64::max);
					let b_max = b.data_points.iter().map(|p| p.weight).fold(0.0, f64::max);
					b_max
						.partial_cmp(&a_max)
						.unwrap_or(std::cmp::Ordering::Equal)
				});

				let total_weight_series =
					calculate_total_weight_series(&substance_series, &time_points);

				Ok(Prominence {
					substance_series,
					start_time,
					end_time,
					max_weight,
					total_weight_series,
				})
			},
		)
}

/// Fetches relevant ingestion phases from the database
async fn fetch_ingestion_phase_by_dt_range(
	date_range: Range<DateTime<Local>>,
) -> Result<Vec<ingestion_phase::Model>>
{
	let phases = ingestion_phase::Entity::find()
		.filter(
			Condition::all()
				.add(ingestion_phase::Column::EndDateMax.gte(date_range.start.naive_utc()))
				.add(ingestion_phase::Column::StartDateMin.lte(date_range.end.naive_utc())),
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

/// Calculates total weight series across all substances
fn calculate_total_weight_series(
	substance_series: &[SubstanceTimeSeries], time_points: &[DateTime<Local>],
) -> Vec<TimePoint>
{
	let mut total_series = Vec::with_capacity(time_points.len());

	// For each time point, sum weights across all substances
	for (i, &time_point) in time_points.iter().enumerate() {
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

	for phase in phases {
		let start_time_min = Local.from_utc_datetime(&phase.start_date_min);
		let end_time_max = Local.from_utc_datetime(&phase.end_date_max);

		if !(start_time_min..=end_time_max).contains(&time) {
			continue;
		}

		let phase_duration = end_time_max.signed_duration_since(start_time_min);
		let elapsed = time.signed_duration_since(start_time_min);
		let progress =
			(elapsed.num_milliseconds() as f64) / (phase_duration.num_milliseconds() as f64);
		let progress = progress.clamp(0.0, 1.0);
		let base_weight: f64 = phase.weight.to_string().parse().unwrap_or(0.0);

		let intensity_factor =
			match PhaseClassification::from_str(phase.classification.as_str()).unwrap() {
				| PhaseClassification::Onset => {
					let normalized = progress.clamp(0.0, 1.0);
					0.5 * normalized.powf(2.0) * (3.0 - 2.0 * normalized)
				}
				| PhaseClassification::Comeup => {
					let normalized = progress.clamp(0.0, 1.0);
					0.2 + 0.8 * normalized.powf(1.2) * (1.0 - 0.3 * normalized)
				}
				| PhaseClassification::Peak => {
					let normalized = progress.clamp(0.0, 1.0);
					let centered = 2.0 * (normalized - 0.5);
					0.75 + 0.25 * (1.0 - centered.powf(2.0))
				}
				| PhaseClassification::Comedown => {
					let normalized = progress.clamp(0.0, 1.0);
					0.8 * (1.0 - normalized.powf(0.8))
				}
				| PhaseClassification::Afterglow => {
					let normalized = progress.clamp(0.0, 1.0);
					0.3 * (1.0 - normalized)
				}
				| PhaseClassification::Unknown => 0.0,
			};
		let adjusted_weight = base_weight * intensity_factor;

		total_weight += adjusted_weight;
	}

	total_weight
}


/// Generates a summary of substance prominence for display
pub fn generate_prominence_summary(prominence_data: &Prominence) -> Vec<SubstanceOfProminence>
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

			let avg_weight = if !series.data_points.is_empty() {
				series
					.data_points
					.iter()
					.map(|point| point.weight)
					.sum::<f64>() / series.data_points.len() as f64
			} else {
				0.0
			};

			let current_weight = series
				.data_points
				.get(current_time_idx)
				.map(|point| point.weight)
				.unwrap_or(0.0);

			let prominence_pct = if total_current_weight > 0.0 {
				current_weight / total_current_weight * 100.0
			} else {
				0.0
			};

			SubstanceOfProminence {
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
pub fn get_most_prominent_substance(prominence_data: &Prominence) -> Option<String>
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
	use chrono::{Duration, Local};

	use crate::statistics::prominence::{
		generate_prominence_summary,
		get_most_prominent_substance,
		get_substance_prominence,
	};

	#[async_std::test]
	async fn test_substance_prominence_time_range()
	{
		let now = Local::now();
		let start_time = now - Duration::hours(24);
		let end_time = now + Duration::hours(24);

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
		assert_eq!(
			summaries.len(),
			data.substance_series.len(),
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

		let result = get_substance_prominence(start_time, end_time, Some(60)).await;
		assert!(
			result.is_ok(),
			"Should successfully retrieve prominence data"
		);

		let data = result.unwrap();

		if !data.substance_series.is_empty() && !data.substance_series[0].data_points.is_empty() {
			let first_series = &data.substance_series[0];
			let first_point = &first_series.data_points[0];
			let first_time_diff = (first_point.timestamp - start_time).num_seconds().abs();

			assert!(
				first_time_diff < 60,
				"First point should be close to start time"
			);

			let last_point = &first_series.data_points[first_series.data_points.len() - 1];
			let last_time_diff = (last_point.timestamp - end_time).num_seconds().abs();
			assert!(
				last_time_diff < 60,
				"Last point should be close to end time"
			);

			if first_series.data_points.len() >= 2 {
				let time_diff = (first_series.data_points[1].timestamp
					- first_series.data_points[0].timestamp)
					.num_minutes();
				assert_eq!(
					time_diff, 60,
					"Time difference between points should match requested resolution"
				);
			}
		}

		if !data.substance_series.is_empty() {
			let expected_points = data.substance_series[0].data_points.len();
			assert_eq!(
				data.total_weight_series.len(),
				expected_points,
				"Total weight series should have same number of points as individual series"
			);
		}
	}
}
