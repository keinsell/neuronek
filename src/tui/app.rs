use crate::database::DATABASE_CONNECTION;
use crate::database::entities::ingestion_phase;
use crate::ingestion::IngestionPhase;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use crossterm::event::Event;
use crossterm::event::KeyCode;
use crossterm::event::{self};
use miette::IntoDiagnostic;
use miette::Result;
use rust_decimal::prelude::*;
use sea_orm::ColumnTrait;
use sea_orm::Condition;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use std::collections::HashMap;
use std::ops::Deref;

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
        substances: HashMap<String, Vec<IngestionPhase>>,
        current_time: DateTime<Local>,
    ) -> (Vec<Dataset>, f64)
    {
        let mut datasets = Vec::new();
        let mut max_weight_sum = 0.0;

        for (substance_name, phases) in substances
        {
            let mut points = vec![0.0; TOTAL_POINTS];
            Self::distribute_phase_weights(&mut points, &phases, current_time);

            let substance_max = points.iter().copied().fold(0.0, f64::max);
            max_weight_sum = f64::max(max_weight_sum, substance_max);

            let chart_points = Self::create_chart_points(&points);

            if chart_points.iter().any(|(_, weight)| *weight > 0.0)
            {
                datasets.push((substance_name, chart_points));
            }
        }

        Self::normalize_datasets(&mut datasets, max_weight_sum);
        (datasets, max_weight_sum)
    }

    fn distribute_phase_weights(
        points: &mut [f64],
        phases: &[IngestionPhase],
        current_time: DateTime<Local>,
    )
    {
        for phase in phases
        {
            let weight = phase.weight.0.to_string().parse::<f64>().unwrap_or(0.0);
            let time_range = (
                phase
                    .start_time
                    .start
                    .signed_duration_since(current_time)
                    .num_hours() as f64,
                phase
                    .end_time
                    .end
                    .signed_duration_since(current_time)
                    .num_hours() as f64,
            );

            if time_range.1 >= HOURS_BACK as f64 && time_range.0 <= HOURS_FORWARD as f64
            {
                let idx_range = (
                    ((time_range.0 + 2.0) * POINTS_PER_HOUR as f64).round() as i64,
                    ((time_range.1 + 2.0) * POINTS_PER_HOUR as f64).round() as i64,
                );

                for i in idx_range.0..=idx_range.1
                {
                    if i >= 0 && i < TOTAL_POINTS as i64
                    {
                        points[i as usize] += weight;
                    }
                }
            }
        }
    }

    fn create_chart_points(points: &[f64]) -> Vec<DataPoint>
    {
        points
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

    fn normalize_datasets(datasets: &mut [Dataset], max_weight: f64)
    {
        if max_weight > 0.0
        {
            for (_, points) in datasets
            {
                for point in points
                {
                    point.1 = (point.1 / max_weight) * 100.0;
                }
            }
        }
    }

    pub fn on_key(&mut self, key: KeyCode)
    {
        if matches!(key, KeyCode::Char('q'))
        {
            self.running = false;
        }
    }

    pub fn run(&mut self) -> Result<()>
    {
        if event::poll(std::time::Duration::from_millis(50)).into_diagnostic()?
        {
            if let Event::Key(key) = event::read().into_diagnostic()?
            {
                self.on_key(key.code);
            }
        }
        Ok(())
    }
}
