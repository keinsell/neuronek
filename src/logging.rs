pub fn setup_logger() -> miette::Result<()>
{
	use std::fs::create_dir_all;
	use etcetera::base_strategy::{BaseStrategy, Xdg};
	use miette::IntoDiagnostic;
	use tracing_appender::non_blocking::WorkerGuard;
	use tracing_appender::rolling::{RollingFileAppender, Rotation};
	use tracing_subscriber::prelude::*;
	use tracing_subscriber::{EnvFilter, fmt};
	use tracing_subscriber::prelude::*;

	let xdg = Xdg::new().into_diagnostic()?.cache_dir().join("neuronek").join("
	logs"); create_dir_all(&xdg).into_diagnostic()?;

	let file_appender = RollingFileAppender::new(Rotation::DAILY, &xdg,
	"neuronek"); let (non_blocking_appender, guard) =
	tracing_appender::non_blocking(file_appender);

	let file_layer = fmt::layer()
		.with_file(true)
		.with_line_number(true)
		.with_thread_ids(true)
		.with_target(false)
		.with_writer(non_blocking_appender);

	let registry = tracing_subscriber::registry()
		.with(EnvFilter::from_default_env().add_directive(tracing::Level::INFO.
	into()))
		.with(file_layer);

	registry.init();

	Ok(())
}
