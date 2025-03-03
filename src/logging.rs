use async_std::io::stdout;
use etcetera::base_strategy::BaseStrategy;
use etcetera::base_strategy::Xdg;
use std::fs::create_dir_all;
use tracing_appender::non_blocking::WorkerGuard;
use tracing_appender::rolling::RollingFileAppender;
use tracing_appender::rolling::Rotation;
use tracing_subscriber::EnvFilter;
use tracing_subscriber::fmt;
use tracing_subscriber::prelude::*;

pub fn setup_logger() -> Result<WorkerGuard, Box<dyn std::error::Error>>
{
    let xdg = Xdg::new()?.cache_dir().join("neuronek").join("logs");
    create_dir_all(&xdg)?;

    let file_appender = RollingFileAppender::new(Rotation::DAILY, &xdg, "neuronek");

    let (non_blocking_appender, guard) = tracing_appender::non_blocking(file_appender);

    let file_layer = fmt::layer()
        .with_file(true)
        .with_line_number(true)
        .with_thread_ids(true)
        .with_target(false)
        .with_writer(non_blocking_appender);

    let registry = tracing_subscriber::registry()
        .with(EnvFilter::from_default_env().add_directive(tracing::Level::INFO.into()))
        .with(file_layer);

    registry.init();


    Ok(guard)
}
