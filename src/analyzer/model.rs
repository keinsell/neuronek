use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::TimeZone;
use hashbrown::HashMap;
use rust_decimal::Decimal;
use std::range::Range;
use std::str::FromStr;
use textplots::Chart;
use textplots::Plot;
use textplots::Shape;

use super::AnalyzeIngestion;
use crate::ingestion::model::IngestionPhases;
use crate::ingestion::phase::Weight;
use crate::substance::Substance;
use crate::substance::route_of_administration::dosage::DosageClassification;
use crate::substance::route_of_administration::phase::PhaseClassification;
use rust_decimal::prelude::*;
use serde::Deserialize;
use serde::Serialize;

type Phase = crate::ingestion::IngestionPhase;

#[derive(Debug, Clone)]
pub struct Report
{
    pub ingestion_id: Option<u32>,
    pub substance_name: String,
    pub dosage_classification: DosageClassification,
    pub phases: IngestionPhases,
    /// Estimated duration of ingestion
    pub duration: Range<Duration>,
    /// Estimated duration of ingestion incl. aftereffects
    pub total_duration: Range<Duration>,
}

impl Report
{
    pub fn build(
        analyze_ingestion: &AnalyzeIngestion,
        substance: &Substance,
    ) -> miette::Result<Self>
    {
        let dosage = analyze_ingestion.dosage;
        let date = analyze_ingestion.date;

        let route_of_administration = substance
            .routes_of_administration
            .get(&analyze_ingestion.roa)
            .ok_or_else(|| miette::miette!("Route of administration not found"))?;

        let dosages = &route_of_administration.dosages;
        let ingestion_dosage = dosage;

        let dosage_classification = dosages
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
        let mut phases_map = vec![];
        let mut prev_phase_end = date..date;

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

                let phase_weight = Weight::calculate(
                    ingestion_dosage.clone(),
                    *phase_class,
                    dosages[&DosageClassification::Common]
                        .clone()
                        .start
                        .unwrap(),
                );

                let phase = Phase {
                    id: None,
                    ingestion_id: None,
                    classification: *phase_class,
                    weight: phase_weight,
                    start_time: phase_start_time_min..phase_start_time_max,
                    end_time: phase_end_time_min..phase_end_time_max,
                    duration: min_duration..max_duration,
                    substance_name: analyze_ingestion.substance.clone(),
                };

                phases_map.push(phase);
            }
        }

        let mut duration_min = Duration::zero();
        let mut duration_max = Duration::zero();
        let mut total_min = Duration::zero();
        let mut total_max = Duration::zero();

        for phase in phases_map.clone()
        {
            total_min += phase.duration.start;
            total_max += phase.duration.end;

            if phase.classification != PhaseClassification::Afterglow
            {
                duration_min += phase.duration.start;
                duration_max += phase.duration.end;
            }
        }

        Ok(Report {
            ingestion_id: None,
            substance_name: analyze_ingestion.substance.clone(),
            dosage_classification: dosage_classification.unwrap_or(DosageClassification::Common),
            phases: IngestionPhases(phases_map),
            duration: (duration_min..duration_max).into(),
            total_duration: (total_min..total_max).into(),
        })
    }

    pub fn intensivity_over_time(&self) -> miette::Result<IntensivityOverTime>
    {
        let mut points = Vec::new();

        let ordered_phases = crate::substance::route_of_administration::phase::PHASE_ORDER
            .iter()
            .filter_map(|pc| self.phases.get(pc))
            .filter(|phase| phase.classification != PhaseClassification::Afterglow);

        for phase in ordered_phases.clone()
        {
            points.push(Point(phase.avg_start_time(), phase.weight.0));
        }

        if let Some(last_phase) = ordered_phases.clone().next_back()
        {
            points.push(Point(last_phase.avg_end_time(), Decimal::ZERO));
        }

        Ok(IntensivityOverTime(points))
    }
}


/// Progression is a representation of total duration related to ingestion in
/// scale of 0.0 to 1.0
///
/// References: [#531](https://github.com/keinsell/neuronek/issues/531)
#[nutype::nutype(
    validate(greater_or_equal = 0.0, less_or_equal = 1.0),
    derive(Debug, PartialEq, Clone)
)]
pub struct IngestionProgress(f32);

pub struct Point(DateTime<Local>, Decimal);

pub struct IntensivityOverTime(Vec<Point>);

impl IntensivityOverTime
{
    /// Generates smoother curve with linear interpolation between points
    pub fn to_xy_points(&self) -> Vec<(f32, f32)>
    {
        if self.0.is_empty()
        {
            return Vec::new();
        }

        let reference_time = self.0[0].0;

        self.0
            .iter()
            .map(|Point(time, weight)| {
                let hours_offset =
                    time.signed_duration_since(reference_time).num_minutes() as f32 / 60.0;
                let intensity = weight.to_f32().unwrap_or(0.0);
                (hours_offset, intensity)
            })
            .collect()
    }

    /// Calculate duration from first to last point
    fn total_duration_hours(&self) -> f32
    {
        if self.0.len() < 2
        {
            return 0.0;
        }

        let first = self.0.first().unwrap().0;
        let last = self.0.last().unwrap().0;
        last.signed_duration_since(first).num_minutes() as f32 / 60.0
    }

    /// Renders an ASCII plot of the intensity curve with timeline markers
    pub fn plot(&self)
    {
        let points = self.to_xy_points();
        let total_duration = self.total_duration_hours();

        let min_x = 0.0;
        let max_x = total_duration;
        let peak_intensity = points
            .iter()
            .map(|(_, y)| *y)
            .fold(f32::NEG_INFINITY, f32::max);

        let current_x = self.calculate_current_progression();

        crate::theme::THEME.print_text(&format!(
            "\n\n## Substance Effect Profile\n**Duration:** {:.1}h | **Peak Intensity:** {:.1}\n\n",
            max_x - min_x,
            peak_intensity
        ));

        crate::theme::THEME.print_text("```");
        Chart::new(120, 40, min_x, max_x)
            .lineplot(&Shape::Lines(&points))
            .lineplot(&Shape::Bars(&[
                (current_x, 0.0),
                (current_x, peak_intensity),
            ]))
            .display();
        crate::theme::THEME.print_text("```");

        crate::theme::THEME.print_text(&format!(
            "**Now:** ◼ {:.1}h | **Peak:** ⭧ {:.1} | **Current Intensity:** {:.1}",
            current_x,
            peak_intensity,
            self.current_intensity_at(current_x)
        ));
    }

    /// Calculates current position in the timeline
    fn calculate_current_progression(&self) -> f32
    {
        if self.0.is_empty()
        {
            return 0.0;
        }

        let reference_time = self.0[0].0;
        let total_duration = self
            .0
            .last()
            .map(|p| p.0.signed_duration_since(reference_time))
            .unwrap_or_else(Duration::zero);

        let elapsed = Local::now()
            .signed_duration_since(reference_time)
            .num_minutes() as f32
            / 60.0;

        elapsed.min(total_duration.num_minutes() as f32 / 60.0)
    }

    /// Gets intensity near current time position
    fn current_intensity_at(&self, hours_offset: f32) -> f32
    {
        self.0
            .iter()
            .find(|Point(time, _)| {
                let t = time.signed_duration_since(self.0[0].0).num_minutes() as f32 / 60.0;
                (t - hours_offset).abs() < 0.1
            })
            .map(|p| p.1.to_f32().unwrap_or(0.0))
            .unwrap_or(0.0)
    }
}


impl crate::ingestion::phase::IngestionPhase
{
    pub fn avg_start_time(&self) -> DateTime<Local>
    {
        self.start_time.start + self.duration.start / 2
    }
    pub fn avg_end_time(&self) -> DateTime<Local> { self.end_time.start + self.duration.start / 2 }
    pub fn avg_duration(&self) -> Duration { self.duration.start + self.duration.end / 2 }
}
