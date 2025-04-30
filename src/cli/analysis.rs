use clap::{Args, Parser, Subcommand};
use crate::{Application, ValueParser};
use crate::analysis::promienience::{self, PromieniencePoint, PromienienceResult};
use miette::{IntoDiagnostic, Result};
use chrono::{DateTime, Local, Utc, Duration};
use crate::cli::Displayable;
use std::collections::{HashMap, BTreeMap};
use serde::Serialize;
use tabled::{Table, Tabled, settings::Style};

#[derive(Parser, Debug)]
pub struct AnalysisCommand {
    #[clap(subcommand)]
    pub command: AnalysisSubcommand,
}

#[derive(Subcommand, Debug)]
pub enum AnalysisSubcommand {
    /// Calculate and display the 'promienience' (temporal intensity) of substances.
    Promienience(PromienienceArgs),
}

#[derive(Args, Debug)]
pub struct PromienienceArgs {
    /// Start date/time for the analysis window (e.g., "yesterday 5pm", "2023-10-26")
    /// [default: 12 hours ago]
    #[arg(long)]
    start_date: Option<String>,

    /// End date/time for the analysis window (e.g., "now", "2023-10-27 09:00")
    /// [default: 12 hours from now]
    #[arg(long)]
    end_date: Option<String>,

    /// Number of time points to calculate within the window.
    #[arg(long, default_value = "100")]
    resolution: u32,

    /// Size of the moving average window for smoothing (0 or 1 to disable).
    #[arg(long, default_value = "5")]
    smoothing_window: u32,

    /// Optional list of substance names to include in the analysis.
    #[arg(long)]
    substances: Option<Vec<String>>,

    // TODO: Add output format option (json, csv, table)
}

// Add Tabled derive for PromieniencePoint
#[derive(Debug, Clone, Serialize, Tabled)]
struct PromieniencePointDisplay {
    #[tabled(rename = "Time (UTC)")]
    time: String,
    #[tabled(rename = "Intensity")]
    intensity: String, // Format as string for table
}

// Wrapper struct for displaying the results
#[derive(Debug, Serialize)]
struct PromienienceOutput(PromienienceResult);

impl Displayable for PromienienceOutput
{
	fn as_pretty(&self) -> String
	{
        if self.0.is_empty() {
            return "No promienience data to display.".to_string();
        }

        let mut combined_output = String::new();

        for (substance, points) in &self.0 {
            if points.is_empty() {
                continue;
            }

            let display_points: Vec<PromieniencePointDisplay> = points.iter()
                .map(|p| PromieniencePointDisplay {
                    time: p.time.to_rfc3339_opts(chrono::SecondsFormat::Secs, true), // Format time
                    intensity: format!("{:.4}", p.intensity), // Format intensity
                })
                .collect();
                
            let table = Table::new(display_points)
                .with(Style::modern_rounded())
                .to_string();

            combined_output.push_str(&format!("\n--- Substance: {} ---\n", substance));
            combined_output.push_str("\n");
        }

		if combined_output.is_empty() {
             "No promienience data points found after filtering.".to_string()
        } else {
            combined_output
        }
    }
    // Default as_json is likely fine
}

pub async fn handle(args: PromienienceArgs, context: Application<'_>) -> Result<()>
{
    println!("Handling promienience analysis...");
    println!("Args: {:?}", args);

    // 1. Determine dates
    let now_local = Local::now();
    let start_date_local = match args.start_date {
        Some(date_str) => DateTime::<Local>::parse_value(&date_str)?,
        None => now_local - Duration::hours(12), // Default: 12 hours ago
    };
    let end_date_local = match args.end_date {
        Some(date_str) => DateTime::<Local>::parse_value(&date_str)?,
        None => now_local + Duration::hours(12), // Default: 12 hours from now
    };

    let start_date_utc: DateTime<Utc> = start_date_local.into();
    let end_date_utc: DateTime<Utc> = end_date_local.into();

    // Validate dates
    if start_date_utc >= end_date_utc {
        return Err(miette::miette!("Start date must be before end date (Start: {}, End: {})", start_date_local, end_date_local));
    }
    println!("Analysis window: {} -> {}", start_date_local, end_date_local);

    // 2. Call the core calculation function
    let results = promienience::calculate_promienience(
        context.database_connection,
        start_date_utc,
        end_date_utc,
        args.resolution,
        args.smoothing_window,
        args.substances,
    )
    .await
    .map_err(|e| miette::miette!("Analysis calculation failed: {}", e))?;

    // 3. Display results
    let output = PromienienceOutput(results);
    output.display(context.stdout_format);

	Ok(())
}
