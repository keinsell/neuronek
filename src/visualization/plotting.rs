use crate::ingestion::phase::model::IngestionPhase;
use crate::visualization::time_series::TimeSeriesData;
use chrono::Local;
use std::fs::File;
use std::io::Write;
use termimad::MadSkin;
use textplots::Chart;
use textplots::Plot;
use textplots::Shape;

pub fn plot_ingestion_phases(phases: &[IngestionPhase])
{
    let skin = MadSkin::default();
    if phases.is_empty()
    {
        skin.print_text("**Warning:** No data to plot.");
        return;
    }

    let time_series = TimeSeriesData::from_ingestion_phases(phases);
    let points = time_series.to_xy_points();

    if points.is_empty()
    {
        skin.print_text("**Warning:** No valid data points to plot.");
        return;
    }

    let min_x = points.first().map(|(x, _)| *x).unwrap_or(0.0);
    let max_x = points.last().map(|(x, _)| *x).unwrap_or(1.0);
    let current_x = calculate_current_position(&time_series);
    let peak_intensity = points.iter().map(|p| p.1).fold(f32::NEG_INFINITY, f32::max);

    skin.print_text(&format!(
        "## Intensity Profile\n**Total Duration:** {:.1}h\n**X-axis:** 0h - {:.1}h | **Y-axis:** \
         Effect Intensity\n\n",
        max_x - min_x,
        max_x
    ));

    skin.print_text("```");
    Chart::new(120, 40, min_x, max_x)
        .lineplot(&Shape::Lines(&points))
        .lineplot(&Shape::Bars(&[
            (current_x, 0.0),
            (current_x, peak_intensity),
        ]))
        .display();
    skin.print_text("```");

    skin.print_text(&format!(
        "**Now:** ◼ {:.1}h | **Peak:** ⭧ {:.1} | **Current Intensity:** {:.1}",
        current_x,
        peak_intensity,
        points
            .iter()
            .find(|p| (p.0 - current_x).abs() < 0.1)
            .map(|p| p.1)
            .unwrap_or(0.0)
    ));
}

/// Dynamically calculate current position based on the time series
fn calculate_current_position(time_series: &TimeSeriesData) -> f32
{
    if time_series.timestamps.is_empty()
    {
        return 0.0;
    }

    let reference_time = time_series.timestamps[0];
    let current_time = Local::now();

    let elapsed_time = current_time
        .signed_duration_since(reference_time)
        .num_minutes() as f32
        / 60.0;

    let max_time = time_series
        .timestamps
        .last()
        .map(|last_time| {
            last_time
                .signed_duration_since(reference_time)
                .num_minutes() as f32
                / 60.0
        })
        .unwrap_or(0.0);

    elapsed_time.min(max_time)
}
