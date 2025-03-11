use crate::statistics::substance_prominence::generate_prominence_summary;
use crate::statistics::substance_prominence::get_most_prominent_substance;
use crate::statistics::substance_prominence::get_substance_prominence;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use clap::Parser;
use miette::Result;
use serde::Serialize;
use tabled::Table;
use tabled::Tabled;
use tabled::settings::Style;

#[derive(Parser, Debug)]
#[clap(version, about = "Show substance prominence information", long_about, aliases = vec!["prom", "p"])]
pub struct ProminenceCommand
{
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

#[derive(Debug, Serialize)]
struct ProminenceOutput
{
    summaries: Vec<ProminenceSummary>,
    most_prominent: Option<String>,
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

impl From<crate::statistics::substance_prominence::SubstanceProminenceSummary> for ProminenceSummary
{
    fn from(summary: crate::statistics::substance_prominence::SubstanceProminenceSummary) -> Self
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
    // Calculate time range based on parameters
    let now = Local::now();
    let start_time = now - Duration::hours(cmd.hours_back);
    let end_time = now + Duration::hours(cmd.hours_forward);

    // Get prominence data
    let prominence_data =
        get_substance_prominence(start_time, end_time, Some(cmd.resolution)).await?;

    if prominence_data.substance_series.is_empty()
    {
        println!("No substance data found for the specified time range.");
        return Ok(());
    }

    // Generate summary for display
    let summaries = generate_prominence_summary(&prominence_data);
    let most_prominent = get_most_prominent_substance(&prominence_data);

    // Display results based on command options
    if cmd.current
    {
        if let Some(substance) = &most_prominent
        {
            println!("Most prominent substance: {}", substance);
        }
        else
        {
            println!("No prominent substance found at the current time.");
        }
    }
    else
    {
        // Print summary table
        let mapped_summaries: Vec<ProminenceSummary> =
            summaries.into_iter().map(ProminenceSummary::from).collect();

        if !mapped_summaries.is_empty()
        {
            println!("Substance Prominence Summary:\n");
            let mut table = Table::new(mapped_summaries);
            table.with(Style::modern_rounded());
            println!("{}", table);

            if let Some(substance) = most_prominent
            {
                println!("\nMost prominent substance at current time: {}", substance);
            }
        }
        else
        {
            println!("No substance prominence data available.");
        }
    }

    Ok(())
}
