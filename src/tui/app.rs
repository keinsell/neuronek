use std::collections::HashMap;
use std::ops::Deref;

use chrono::{DateTime, Duration, Local};
use crossterm::event::{
	Event,
	KeyCode,
	{self},
};
use miette::{IntoDiagnostic, Result};
use sea_orm::{ColumnTrait, Condition, EntityTrait, QueryFilter, QueryOrder};

use crate::database::DATABASE_CONNECTION;
use crate::database::entities::ingestion_phase;
use crate::ingestion::IngestionPhase;
use crate::substance::route_of_administration::phase::PhaseClassification;

type DataPoint = (f64, f64);
type Dataset = (String, Vec<DataPoint>);

const POINTS_PER_HOUR: usize = 4;
const HOURS_RANGE: usize = 15;
const TOTAL_POINTS: usize = HOURS_RANGE * POINTS_PER_HOUR;
const HOURS_BACK: i64 = -2;
const HOURS_FORWARD: i64 = 12;

pub struct App
{
	pub running: bool,
	pub datasets: Vec<Dataset>,
	pub time_range: (DateTime<Local>, DateTime<Local>),
	pub current_time: DateTime<Local>,
	pub max_weight: f64,
}

impl App
{
	pub async fn new() -> Result<App>
	{
		let current_time = Local::now();
		let time_range = (
			current_time + Duration::hours(HOURS_BACK),
			current_time + Duration::hours(HOURS_FORWARD),
		);

		let phases = Self::fetch_phases(&time_range).await?;
		let substances = Self::group_phases_by_substance(phases);
		let (datasets, max_weight) = Self::process_substances(substances, current_time);

		Ok(App {
			running: true,
			datasets,
			time_range,
			current_time,
			max_weight,
		})
	}

	async fn fetch_phases(
		time_range: &(DateTime<Local>, DateTime<Local>),
	) -> Result<Vec<IngestionPhase>>
	{
		let phases = ingestion_phase::Entity::find()
			.filter(
				Condition::all()
					.add(ingestion_phase::Column::StartDateMin.gt(time_range.0.naive_utc()))
					.add(ingestion_phase::Column::EndDateMax.lt(time_range.1.naive_utc())),
			)
			.order_by_asc(ingestion_phase::Column::StartDateMin)
			.all(DATABASE_CONNECTION.deref())
			.await
			.into_diagnostic()?;

		Ok(phases.into_iter().map(IngestionPhase::from).collect())
	}

	fn group_phases_by_substance(
		phases: Vec<IngestionPhase>,
	) -> HashMap<String, Vec<IngestionPhase>>
	{
		phases.into_iter().fold(HashMap::new(), |mut acc, phase| {
			acc.entry(phase.substance_name.clone())
				.or_default()
				.push(phase);
			acc
		})
	}

	fn process_substances(
		substances: HashMap<String, Vec<IngestionPhase>>, current_time: DateTime<Local>,
	) -> (Vec<Dataset>, f64)
	{
		let mut datasets = Vec::new();
		let mut all_substance_points = Vec::new();
		let mut combined_points = vec![0.0; TOTAL_POINTS];


		// Process each substance individually
		for (substance_name, phases) in substances {
			let mut points = vec![0.0; TOTAL_POINTS];
			Self::distribute_phase_weights(&mut points, &phases, current_time);

			// Update combined points for calculating total intensity
			for (i, &point) in points.iter().enumerate() {
				combined_points[i] += point;
			}

			// Only add substances with non-zero intensity
			let substance_max = points.iter().copied().fold(0.0, f64::max);
			if substance_max > 0.0 {
				let chart_points = Self::create_chart_points(&points);
				all_substance_points.push((substance_name, chart_points, substance_max));
			}
		}

		// Find overall maximum intensity for proper scaling
		let max_weight_sum = combined_points.iter().copied().fold(0.0, f64::max);

		// Sort substances by maximum intensity (descending) for better visualization
		all_substance_points.sort_by(|a, b| b.2.partial_cmp(&a.2).unwrap());

		// Create the final datasets with normalization
		for (name, points, _) in all_substance_points {
			// Apply normalization to percentage
			let normalized_points: Vec<(f64, f64)> = points
				.iter()
				.map(|(x, y)| {
					(
						*x,
						if max_weight_sum > 0.0 {
							(*y / max_weight_sum) * 100.0
						} else {
							0.0
						},
					)
				})
				.collect();

			datasets.push((name, normalized_points));
		}

		(datasets, max_weight_sum)
	}

	fn distribute_phase_weights(
		points: &mut [f64], phases: &[IngestionPhase], current_time: DateTime<Local>,
	)
	{
		for phase in phases {
			let weight = phase.weight.0.to_string().parse::<f64>().unwrap_or(0.0);

			// Calculate start and end time relative to current time in hours
			// For visualization, use the earliest start and latest end to show full
			// possible duration
			let phase_start_hours = phase
				.start_time
				.start
				.signed_duration_since(current_time)
				.num_minutes() as f64
				/ 60.0;

			let phase_end_hours = phase
				.end_time
				.end
				.signed_duration_since(current_time)
				.num_minutes() as f64
				/ 60.0;

			// Skip phases entirely outside our time window
			if phase_end_hours < HOURS_BACK as f64 || phase_start_hours > HOURS_FORWARD as f64 {
				continue;
			}

			// Calculate phase duration in hours
			let total_phase_duration = phase_end_hours - phase_start_hours;
			if total_phase_duration <= 0.0 {
				continue;
			}

			// Create a higher resolution interpolation for smoother curves
			let interpolation_points = 400;
			let phase_times = Self::interpolate_phase_times(
				phase_start_hours,
				phase_end_hours,
				interpolation_points,
			);

			// Get intensity for each interpolated time point
			let phase_intensities = phase_times
				.iter()
				.enumerate()
				.map(|(i, &t)| {
					let progress = i as f64 / (interpolation_points - 1) as f64;
					let intensity_factor = match phase.classification {
						| PhaseClassification::Onset => Self::onset_curve(progress),
						| PhaseClassification::Comeup => Self::comeup_curve(progress),
						| PhaseClassification::Peak => Self::peak_curve(progress),
						| PhaseClassification::Comedown => Self::comedown_curve(progress),
						| PhaseClassification::Afterglow => Self::afterglow_curve(progress),
						| _ => 0.0,
					};
					(t, weight * intensity_factor)
				})
				.collect::<Vec<_>>();

			// Map the higher resolution curve back to our chart points array
			for (time, intensity) in phase_intensities {
				if time >= HOURS_BACK as f64 && time <= HOURS_FORWARD as f64 {
					let idx =
						((time - HOURS_BACK as f64) * POINTS_PER_HOUR as f64).round() as usize;
					if idx < TOTAL_POINTS {
						points[idx] += intensity;
					}
				}
			}
		}
	}

	// Create a smooth, evenly-spaced set of time points
	fn interpolate_phase_times(start: f64, end: f64, count: usize) -> Vec<f64>
	{
		let mut times = Vec::with_capacity(count);
		for i in 0..count {
			let t = start + (end - start) * (i as f64 / (count - 1) as f64);
			times.push(t);
		}
		times
	}

	// Intensity curve functions - these return a value between 0.0 and 1.0
	// representing the intensity at a given point in the phase

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

	fn create_chart_points(points: &[f64]) -> Vec<DataPoint>
	{
		// Apply a light smoothing filter to reduce jagged appearance
		let smoothed_points = Self::apply_smoothing(points, 2);

		smoothed_points
			.iter()
			.enumerate()
			.map(|(idx, &weight)| {
				(
					(idx as f64) / POINTS_PER_HOUR as f64 + HOURS_BACK as f64,
					weight,
				)
			})
			.collect()
	}

	// Apply a simple moving average smoothing filter to reduce visual noise
	fn apply_smoothing(points: &[f64], radius: usize) -> Vec<f64>
	{
		let mut result = Vec::with_capacity(points.len());

		for i in 0..points.len() {
			let start = i.saturating_sub(radius);
			let end = (i + radius + 1).min(points.len());
			let count = end - start;

			let sum: f64 = points[start..end].iter().sum();
			result.push(sum / count as f64);
		}

		result
	}

	// This function is no longer needed since normalization happens in
	// process_substances
	#[allow(dead_code)]
	fn normalize_datasets(datasets: &mut [Dataset], max_weight: f64)
	{
		if max_weight > 0.0 {
			for (_, points) in datasets {
				for point in points {
					point.1 = (point.1 / max_weight) * 100.0;
				}
			}
		}
	}

	pub fn on_key(&mut self, key: KeyCode)
	{
		if matches!(key, KeyCode::Char('q')) {
			self.running = false;
		}
	}

	pub fn run(&mut self) -> Result<()>
	{
		if event::poll(std::time::Duration::from_millis(50)).into_diagnostic()? {
			if let Event::Key(key) = event::read().into_diagnostic()? {
				self.on_key(key.code);
			}
		}
		Ok(())
	}
}
