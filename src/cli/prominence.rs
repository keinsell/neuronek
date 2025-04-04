use async_trait::async_trait;
use chrono::{DateTime, Duration, Local, TimeZone};
use clap::{Parser, Subcommand};
use miette::Result;
use serde::Serialize;
use std::collections::HashMap;
use std::ops::Deref;
use sea_orm::{EntityTrait, QueryFilter, ColumnTrait, QueryOrder, Condition};
use tabled::settings::Style;
use tabled::{Table, Tabled};
use textplots::{Chart, Plot, Shape};

use crate::Application;
use crate::r#abstract::CommandHandler;
use crate::database::DATABASE_CONNECTION;
use crate::database::entities::ingestion_phase;
use crate::statistics::prominence::{
	generate_prominence_summary,
	get_most_prominent_substance,
	get_substance_prominence,
	TimePoint,
};

#[derive(Parser, Debug)]
#[clap(version, about = "Show substance prominence information", long_about, aliases = vec!["prom", "p"])]
pub struct ProminenceCommand
{
	#[command(subcommand)]
	pub command: Option<ProminenceSubcommands>,

	/// Number of hours to look backward from now
	#[clap(long, short = 'b', default_value_t = 12)]
	pub hours_back: i64,

	/// Number of hours to look forward from now
	#[clap(long, short = 'f', default_value_t = 12)]
	pub hours_forward: i64,

	/// Resolution in minutes between data points
	#[clap(long, short, default_value_t = 15)]
	pub resolution: i64,

	/// Show only the most prominent substance at the current time
	#[clap(long)]
	pub current: bool,
}

#[derive(Subcommand, Debug)]
pub enum ProminenceSubcommands {
	/// Show most active ingestions based on ingestion phases
	#[clap(aliases = vec!["a"])]
	Active(ActiveIngestionsCommand),
}

#[derive(Parser, Debug)]
pub struct ActiveIngestionsCommand {
	/// Number of hours to look backward from now
	#[clap(long, short = 'b', default_value_t = 12)]
	pub hours_back: i64,

	/// Number of hours to look forward from now
	#[clap(long, short = 'f', default_value_t = 12)]
	pub hours_forward: i64,

	/// Resolution in minutes between data points
	#[clap(long, short, default_value_t = 15)]
	pub resolution: i64,

	/// Filter by substance name
	#[clap(long, short)]
	pub substance: Option<String>,

	/// Show ASCII chart of activity over time
	#[clap(long)]
	pub chart: bool,

	/// Limit the number of ingestions to show
	#[clap(long, default_value_t = 5)]
	pub limit: u64,
}

#[async_trait]
impl CommandHandler for ProminenceCommand
{
	async fn handle<'a>(&self, ctx: Application<'a>) -> miette::Result<()>
	{
		match &self.command {
			Some(ProminenceSubcommands::Active(cmd)) => handle_active_ingestions_command(cmd).await,
			None => handle_prominence_command(self).await,
		}
	}
}

#[derive(Debug, Serialize, Tabled)]
struct ProminenceSummary
{
	#[tabled(rename = "Substance")]
	substance: String,
	#[tabled(rename = "Current Weight")]
	current_weight: String,
	#[tabled(rename = "Peak Weight")]
	peak_weight: String,
	#[tabled(rename = "Average Weight")]
	average_weight: String,
	#[tabled(rename = "Prominence %")]
	prominence_percentage: String,
}

impl From<crate::statistics::prominence::SubstanceOfProminence> for ProminenceSummary
{
	fn from(summary: crate::statistics::prominence::SubstanceOfProminence) -> Self
	{
		Self {
			substance: summary.substance_name,
			current_weight: summary.current_weight,
			peak_weight: summary.peak_weight,
			average_weight: summary.average_weight,
			prominence_percentage: summary.prominence_percentage,
		}
	}
}

pub async fn handle_prominence_command(cmd: &ProminenceCommand) -> Result<()>
{
	let now = Local::now();
	let start_time = now - Duration::hours(cmd.hours_back);
	let end_time = now + Duration::hours(cmd.hours_forward);

	let prominence_data =
		get_substance_prominence(start_time, end_time, Some(cmd.resolution)).await?;

	if prominence_data.substance_series.is_empty() {
		println!("No substance data found for the specified time range.");
		return Ok(());
	}

	if cmd.current {
		match get_most_prominent_substance(&prominence_data) {
			| Some(substance) => println!("Most prominent substance: {}", substance),
			| None => println!("No prominent substance found at the current time."),
		}
		return Ok(());
	}

	let mapped_summaries: Vec<ProminenceSummary> = generate_prominence_summary(&prominence_data)
		.into_iter()
		.map(ProminenceSummary::from)
		.collect();

	if mapped_summaries.is_empty() {
		println!("No substance prominence data available.");
		return Ok(());
	}

	println!("Substance Prominence Summary:\n");
	let mut table = Table::new(mapped_summaries);
	table.with(Style::modern_rounded());
	println!("{}", table);

	if let Some(substance) = get_most_prominent_substance(&prominence_data) {
		println!("\nMost prominent substance at current time: {}", substance);
	}

	Ok(())
}

/// Represents a time series for an ingestion's activity
#[derive(Debug, Clone, Serialize)]
struct IngestionTimeSeries {
    /// The ingestion ID
    pub ingestion_id: i32,
    /// The substance name
    pub substance_name: String,
    /// The data points showing activity over time
    pub data_points: Vec<TimePoint>,
}

/// Summary information about ingestion activity for display
#[derive(Debug, Serialize, Tabled)]
struct IngestionActivitySummary {
    #[tabled(rename = "Ingestion ID")]
    pub ingestion_id: String,
    #[tabled(rename = "Substance")]
    pub substance_name: String,
    #[tabled(rename = "Current Weight")]
    pub current_weight: String,
    #[tabled(rename = "Peak Weight")]
    pub peak_weight: String,
    #[tabled(rename = "Average Weight")]
    pub average_weight: String,
    #[tabled(rename = "Activity %")]
    pub activity_percentage: String,
}

/// Handles the active ingestions command
pub async fn handle_active_ingestions_command(cmd: &ActiveIngestionsCommand) -> Result<()> {
    let now = Local::now();
    let start_time = now - Duration::hours(cmd.hours_back);
    let end_time = now + Duration::hours(cmd.hours_forward);

    // Fetch ingestion phases from the database
    let mut condition = Condition::all();

    // Add time range condition
    condition = condition
        .add(ingestion_phase::Column::StartDateMax.gte(start_time.naive_utc()))
        .add(ingestion_phase::Column::EndDateMin.lte(end_time.naive_utc()));

    // Add substance filter if provided
    if let Some(substance) = &cmd.substance {
        condition = condition.add(ingestion_phase::Column::SubstanceName.eq(substance.clone()));
    }

    let phases = ingestion_phase::Entity::find()
        .filter(condition)
        .all(DATABASE_CONNECTION.deref())
        .await
        .map_err(|e| miette::miette!("Failed to fetch ingestion phases: {}", e))?;

    if phases.is_empty() {
        println!("No ingestion phases found for the specified time range.");
        return Ok(());
    }

    // Group phases by ingestion ID
    let phases_by_ingestion = group_phases_by_ingestion(phases);

    // Calculate time points based on resolution
    let duration = end_time.signed_duration_since(start_time);
    let total_minutes = duration.num_minutes();
    let resolution = cmd.resolution;
    let num_points = (total_minutes / resolution).max(1) as usize + 1;

    let mut time_points = Vec::with_capacity(num_points);
    for i in 0..num_points {
        let offset = Duration::minutes(i as i64 * resolution);
        time_points.push(start_time + offset);
    }

    // Generate time series for each ingestion
    let mut ingestion_series = Vec::new();
    let mut max_weight: f64 = 0.0;

    for (ingestion_id, phases) in phases_by_ingestion {
        let mut data_points = Vec::with_capacity(time_points.len());
        let substance_name = phases.first().map_or(String::from("Unknown"), |p| p.substance_name.clone());

        for &time in &time_points {
            let weight = calculate_weight_at_time(&phases, time);
            max_weight = max_weight.max(weight);
            data_points.push(TimePoint {
                timestamp: time,
                weight,
            });
        }

        ingestion_series.push(IngestionTimeSeries {
            ingestion_id,
            substance_name,
            data_points,
        });
    }

    // Sort by maximum weight
    ingestion_series.sort_by(|a, b| {
        let a_max = a.data_points.iter().map(|p| p.weight).fold(0.0, f64::max);
        let b_max = b.data_points.iter().map(|p| p.weight).fold(0.0, f64::max);
        b_max.partial_cmp(&a_max).unwrap_or(std::cmp::Ordering::Equal)
    });

    // Limit the number of ingestions to display
    if ingestion_series.len() > cmd.limit as usize {
        ingestion_series.truncate(cmd.limit as usize);
    }

    // Find current time index
    let current_time_idx = ingestion_series
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
    let total_current_weight = ingestion_series
        .iter()
        .filter_map(|series| series.data_points.get(current_time_idx))
        .map(|point| point.weight)
        .sum::<f64>();

    // Generate summaries
    let summaries: Vec<IngestionActivitySummary> = ingestion_series
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

            let activity_pct = if total_current_weight > 0.0 {
                current_weight / total_current_weight * 100.0
            } else {
                0.0
            };

            IngestionActivitySummary {
                ingestion_id: series.ingestion_id.to_string(),
                substance_name: series.substance_name.clone(),
                current_weight: format!("{:.2}", current_weight),
                peak_weight: format!("{:.2}", peak_weight),
                average_weight: format!("{:.2}", avg_weight),
                activity_percentage: format!("{:.1}%", activity_pct),
            }
        })
        .collect();

    // Display results
    if summaries.is_empty() {
        println!("No active ingestions found for the specified time range.");
        return Ok(());
    }

    println!("Active Ingestions Summary:\n");
    let mut table = Table::new(summaries);
    table.with(Style::modern_rounded());
    println!("{}", table);

    // Find most active ingestion at current time
    let most_active = ingestion_series
        .iter()
        .map(|series| {
            let current_weight = series
                .data_points
                .get(current_time_idx)
                .map(|point| point.weight)
                .unwrap_or(0.0);

            (series, current_weight)
        })
        .max_by(|(_, weight_a), (_, weight_b)| {
            weight_a
                .partial_cmp(weight_b)
                .unwrap_or(std::cmp::Ordering::Equal)
        })
        .filter(|(_, weight)| *weight > 0.0);

    if let Some((series, _)) = most_active {
        println!("\nMost active ingestion at current time: ID {} ({})",
                 series.ingestion_id, series.substance_name);
    }

    // Display chart if requested
    if cmd.chart && !ingestion_series.is_empty() {
        println!("\nActivity over time:");

        // Get data for the most active ingestion
        let most_active_series = &ingestion_series[0];
        let points: Vec<(f32, f32)> = most_active_series
            .data_points
            .iter()
            .enumerate()
            .map(|(i, point)| {
                let x = i as f32;
                let y = point.weight as f32;
                (x, y)
            })
            .collect();

        // Create and display the chart
        Chart::new(80, 20, 0.0, points.len() as f32)
            .lineplot(&Shape::Lines(&points))
            .nice();

        println!("Chart shows activity for ingestion ID {} ({})",
                 most_active_series.ingestion_id, most_active_series.substance_name);
        println!("X-axis: Time (resolution: {} minutes)", cmd.resolution);
        println!("Y-axis: Activity weight");
    }

    Ok(())
}

/// Groups ingestion phases by ingestion ID
fn group_phases_by_ingestion(phases: Vec<ingestion_phase::Model>) -> HashMap<i32, Vec<ingestion_phase::Model>> {
    let mut phases_by_ingestion = HashMap::new();

    for phase in phases {
        phases_by_ingestion
            .entry(phase.ingestion_id)
            .or_insert_with(Vec::new)
            .push(phase);
    }

    phases_by_ingestion
}

/// Calculates the weight at a specific time point for a set of phases
fn calculate_weight_at_time(phases: &[ingestion_phase::Model], time: DateTime<Local>) -> f64 {
    let mut total_weight = 0.0;

    for phase in phases {
        let start_time_min = Local.from_utc_datetime(&phase.start_date_min);
        let end_time_max = Local.from_utc_datetime(&phase.end_date_max);

        if !(start_time_min..=end_time_max).contains(&time) {
            continue;
        }

        let phase_duration = end_time_max.signed_duration_since(start_time_min);
        let elapsed = time.signed_duration_since(start_time_min);
        let progress = (elapsed.num_milliseconds() as f64) / (phase_duration.num_milliseconds() as f64);
        let progress = progress.clamp(0.0, 1.0);

        // Parse the weight from the Decimal type
        let base_weight: f64 = phase.weight.to_string().parse().unwrap_or(0.0);

        // Apply a simple bell curve to the weight based on progress
        // This makes the weight peak in the middle of the phase
        let weight_factor = 1.0 - (2.0 * progress - 1.0).powi(2);
        let adjusted_weight = base_weight * weight_factor;

        total_weight += adjusted_weight;
    }

    total_weight
}
