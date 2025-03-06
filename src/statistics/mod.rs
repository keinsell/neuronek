use crate::database::entities::ingestion;
use crate::database::DATABASE_CONNECTION;
use crate::ingestion::Ingestion;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use chrono::DateTime;
use chrono::Datelike;
use chrono::Duration;
use chrono::Local;
use chrono::NaiveDate;
use chrono::Timelike;
use chrono::Utc;
use clap::Parser;
use hashbrown::HashMap;
use miette::IntoDiagnostic;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use std::collections::BTreeMap;
use std::ops::Deref;
use tabled::Table;
use tabled::Tabled;

#[derive(Parser, Debug)]
#[clap(version, about = "Show statistics", long_about, aliases = vec!["stat", "s"])]
pub struct ShowStatistics
{
    /// Limit analysis to last N days (0 means no limit)
    #[clap(long, short, default_value_t = 0)]
    pub days: u32,
}

#[derive(Debug, Tabled)]
struct SubstanceStatistics
{
    #[tabled(rename = "Substance")]
    substance_name: String,
    #[tabled(rename = "Sum of Dosages")]
    total_dosage: String,
    #[tabled(rename = "Average Dosage")]
    average_dosage: String,
    #[tabled(rename = "Min Dosage")]
    min_dosage: String,
    #[tabled(rename = "Max Dosage")]
    max_dosage: String,
    #[tabled(rename = "Average Dosage (per day)")]
    average_daily_dosage: String,
    #[tabled(rename = "First Ingestion")]
    first_ingestion_date: String,
    #[tabled(rename = "Last Ingestion")]
    last_ingestion_date: String,
    #[tabled(rename = "Days Since First")]
    days_since_first: u32,
    #[tabled(rename = "Total Ingestions")]
    total_ingestions: usize,
}

#[derive(Debug, Tabled)]
struct GeneralStatistics
{
    #[tabled(rename = "Metric")]
    metric: String,
    #[tabled(rename = "Value")]
    value: String,
}

/// Displays comprehensive statistics for recorded ingestions
pub async fn show_statistics(cmd: &ShowStatistics) -> miette::Result<()>
{
    let ingestions = fetch_ingestions(cmd.days).await?;

    if ingestions.is_empty()
    {
        println!("No ingestions recorded in the specified time period.");
        return Ok(());
    }

    // Always show both types of statistics
    show_general_statistics(&ingestions);
    println!("\n");
    show_substance_statistics(&ingestions);

    Ok(())
}

/// Fetches ingestion data from the database, optionally filtering by date range
async fn fetch_ingestions(days_limit: u32) -> miette::Result<Vec<Ingestion>>
{
    let mut query = ingestion::Entity::find().order_by_desc(ingestion::Column::IngestedAt);

    // Apply date filter if specified
    if days_limit > 0
    {
        let cutoff_date = Local::now() - Duration::days(days_limit as i64);
        query = query.filter(ingestion::Column::IngestedAt.gt(cutoff_date.naive_utc()));
    }

    let ingestions = query
        .all(DATABASE_CONNECTION.deref())
        .await
        .into_diagnostic()?
        .into_iter()
        .map(Ingestion::from)
        .collect::<Vec<_>>();

    Ok(ingestions)
}

/// Shows substance-specific statistics
fn show_substance_statistics(ingestions: &[Ingestion])
{
    // Group ingestions by substance
    let substance_map = ingestions.iter().fold(
        HashMap::<String, Vec<&Ingestion>>::new(),
        |mut acc, ingestion| {
            acc.entry(ingestion.substance_name.clone())
                .or_default()
                .push(ingestion);
            acc
        },
    );

    let now = Local::now();
    let statistics = substance_map
        .into_iter()
        .map(|(substance_name, substance_ingestions)| {
            // Sort ingestions chronologically (for first/last dates)
            let mut sorted_ingestions = substance_ingestions.clone();
            sorted_ingestions.sort_by_key(|i| i.ingestion_date);

            // Get first and last ingestion
            let first_ingestion = sorted_ingestions.first().unwrap();
            let last_ingestion = sorted_ingestions.last().unwrap();

            // Calculate time period statistics
            let days_since_first = (now - first_ingestion.ingestion_date).num_days().max(1) as u32;
            let first_date_str = first_ingestion
                .ingestion_date
                .format("%Y-%m-%d")
                .to_string();
            let last_date_str = last_ingestion.ingestion_date.format("%Y-%m-%d").to_string();

            // Calculate dosage statistics
            let total_dosage_base_units: f64 = substance_ingestions
                .iter()
                .map(|i| i.dosage.as_base_units())
                .sum();

            // Find min and max dosages
            let min_dosage = substance_ingestions
                .iter()
                .min_by(|a, b| {
                    a.dosage
                        .as_base_units()
                        .partial_cmp(&b.dosage.as_base_units())
                        .unwrap_or(std::cmp::Ordering::Equal)
                })
                .map(|i| i.dosage)
                .unwrap_or_default();

            let max_dosage = substance_ingestions
                .iter()
                .max_by(|a, b| {
                    a.dosage
                        .as_base_units()
                        .partial_cmp(&b.dosage.as_base_units())
                        .unwrap_or(std::cmp::Ordering::Equal)
                })
                .map(|i| i.dosage)
                .unwrap_or_default();

            // Calculate averages
            let count = substance_ingestions.len() as f64;
            let average_dosage = Dosage::from_base_units(
                if count > 0.0
                {
                    total_dosage_base_units / count
                } else {
                    0.0
                },
            );
            let average_daily_dosage =
                Dosage::from_base_units(total_dosage_base_units / days_since_first as f64);

            // Create statistics record
            SubstanceStatistics {
                substance_name,
                total_dosage: Dosage::from_base_units(total_dosage_base_units).to_string(),
                average_dosage: average_dosage.to_string(),
                min_dosage: min_dosage.to_string(),
                max_dosage: max_dosage.to_string(),
                average_daily_dosage: average_daily_dosage.to_string(),
                first_ingestion_date: first_date_str,
                last_ingestion_date: last_date_str,
                days_since_first,
                total_ingestions: substance_ingestions.len(),
            }
        })
        .collect::<Vec<_>>();

    if !statistics.is_empty()
    {
        let mut sorted_stats = statistics;
        sorted_stats.sort_by(|a, b| a.substance_name.cmp(&b.substance_name));

        let table = Table::new(sorted_stats).to_string();
        println!("Substance Statistics:\n");
        println!("{}", table);
    } else {
        println!("No substance statistics available.");
    }
}

/// Shows general ingestion statistics
fn show_general_statistics(ingestions: &[Ingestion])
{
    let total_ingestions = ingestions.len();
    if total_ingestions == 0
    {
        println!("No ingestion statistics available.");
        return;
    }

    // Calculate time-based metrics
    let mut first_ingestion_date = ingestions[0].ingestion_date;
    let mut last_ingestion_date = ingestions[0].ingestion_date;
    let mut total_dosage_base_units = 0.0;
    let mut unique_substances = HashMap::new();
    let mut unique_routes = HashMap::new();

    for ingestion in ingestions
    {
        if ingestion.ingestion_date < first_ingestion_date
        {
            first_ingestion_date = ingestion.ingestion_date;
        }
        if ingestion.ingestion_date > last_ingestion_date
        {
            last_ingestion_date = ingestion.ingestion_date;
        }

        total_dosage_base_units += ingestion.dosage.as_base_units();
        *unique_substances
            .entry(ingestion.substance_name.clone())
            .or_insert(0) += 1;
        *unique_routes.entry(ingestion.route).or_insert(0) += 1;
    }

    // Find most common substance and route
    let most_common_substance = unique_substances
        .iter()
        .max_by_key(|(_, count)| *count)
        .map(|(name, count)| format!("{} ({})", name, count))
        .unwrap_or_else(|| "None".to_string());

    let most_common_route = unique_routes
        .iter()
        .max_by_key(|(_, count)| *count)
        .map(|(route, count)| format!("{} ({})", route, count))
        .unwrap_or_else(|| "None".to_string());

    // Calculate time metrics
    let days_active = (last_ingestion_date - first_ingestion_date).num_days() + 1;
    let ingestions_per_day = if days_active > 0
    {
        total_ingestions as f64 / days_active as f64
    } else {
        total_ingestions as f64
    };

    let average_dosage = if total_ingestions > 0
    {
        Dosage::from_base_units(total_dosage_base_units / total_ingestions as f64).to_string()
    } else {
        "N/A".to_string()
    };

    // Prepare statistics
    let stats = vec![
        GeneralStatistics {
            metric: "Total Ingestions".to_string(),
            value: total_ingestions.to_string(),
        },
        GeneralStatistics {
            metric: "Unique Substances".to_string(),
            value: unique_substances.len().to_string(),
        },
        GeneralStatistics {
            metric: "Most Used Substance".to_string(),
            value: most_common_substance,
        },
        GeneralStatistics {
            metric: "Most Common Route".to_string(),
            value: most_common_route,
        },
        GeneralStatistics {
            metric: "First Recorded Ingestion".to_string(),
            value: first_ingestion_date.format("%Y-%m-%d").to_string(),
        },
        GeneralStatistics {
            metric: "Last Recorded Ingestion".to_string(),
            value: last_ingestion_date.format("%Y-%m-%d").to_string(),
        },
        GeneralStatistics {
            metric: "Days Between First and Last".to_string(),
            value: days_active.to_string(),
        },
        GeneralStatistics {
            metric: "Average Ingestions Per Day".to_string(),
            value: format!("{:.2}", ingestions_per_day),
        },
        GeneralStatistics {
            metric: "Average Dosage Overall".to_string(),
            value: average_dosage,
        },
    ];

    let table = Table::new(stats).to_string();
    println!("General Ingestion Statistics:\n");
    println!("{}", table);
}
