use anyhow::Result;

pub mod plotting;

mod time_series;

pub use plotting::plot_ingestion_phases;
pub use time_series::TimeSeriesData;
