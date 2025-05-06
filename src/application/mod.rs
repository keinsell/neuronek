// Removed feature flags, using async_trait macro
use async_trait::async_trait;
use miette::Result;
use crate::cli::{CommandLineInterface, MessageFormat};
use crate::database::{migrate_database, DATABASE_CONNECTION};
use clap::Parser;
use tracing_subscriber::registry;
use async_std::task::JoinHandle;
use async_std::task::spawn;
use std::future::Future;
use std::pin::Pin;

#[derive(Copy, Clone, Debug, Default, PartialEq)]
pub enum Phase {
    #[default]
    Startup,
    Analyze,
    Execute,
    Shutdown,
}

pub struct Application {
    pub phase: Phase,
    pub exit_code: Option<u8>,
}

impl Application {
    pub fn setup_diagnostics(&self) {
        miette::set_panic_hook();
        #[cfg(not(debug_assertions))]
        {
            human_panic::setup_panic!();
        }
    }

    pub(crate) fn setup_logger(&self) -> Result<()> {
        use std::fs::create_dir_all;

        use etcetera::base_strategy::{BaseStrategy, Xdg};
        use miette::IntoDiagnostic;
        use tracing_appender::non_blocking::WorkerGuard;
        use tracing_appender::rolling::{RollingFileAppender, Rotation};
        use tracing_subscriber::prelude::*;
        use tracing_subscriber::{EnvFilter, fmt};

        let xdg = Xdg::new()
            .into_diagnostic()?
            .cache_dir()
            .join("neuronek")
            .join(
                "
	logs",
            );
        create_dir_all(&xdg).into_diagnostic()?;

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

        Ok(())
    }

    pub async fn run_session<S>(&mut self, session: &mut S) -> Result<u8>
    where
        S: ApplicationSession,
    {
        self.phase = Phase::Startup;
        (session.startup()).await?;
        self.phase = Phase::Analyze;
        (session.analyze()).await?;
        self.phase = Phase::Execute;
        (session.execute()).await?;
        self.phase = Phase::Shutdown;
        (session.shutdown()).await?;
        Ok(self.exit_code.unwrap_or(0))
    }

    /// Runs the application through its phases: Startup → Main → Shutdown.
    ///
    /// If startup or main fails, shutdown will *still* be attempted.
    pub async fn run<S: ApplicationSession + Send>(&mut self, session: &mut S) -> AppResult {
        self.phase = Phase::Startup;
        match (session.startup()).await {
            Ok(Some(code)) => {
                self.exit_code = Some(code);
                self.try_shutdown(session).await
            },
            Ok(None) => {
                // Proceed to Analyze phase
                self.phase = Phase::Analyze;
                let analyze_result = (session.analyze()).await;
                let analyze_exit_code = match &analyze_result {
                    Ok(Some(code)) => Some(*code),
                    Err(_) => None,
                    _ => None,
                };

                // Proceed to Execute phase if Analyze succeeded
                let execute_result = if analyze_result.is_ok() {
                    self.phase = Phase::Execute;
                    (session.execute()).await
                } else {
                    Err(analyze_result.err().unwrap())
                };
                let execute_exit_code = match &execute_result {
                    Ok(Some(code)) => Some(*code),
                    Err(_) => None,
                    _ => None,
                };

                // Always run shutdown, but preserve the main error/exit_code
                let shutdown_result = self.try_shutdown(session).await;

                match (execute_result, shutdown_result) {
                    (Ok(Some(code)), _) | (_, Ok(Some(code))) => {
                        self.exit_code = Some(code);
                        Ok(self.exit_code)
                    },
                    (Err(e), _) => Err(e),
                    (_, Err(e)) => Err(e),
                    _ => Ok(self.exit_code),
                }
            }
            Err(e) => {
                // Startup failed, but still try shutdown!
                let _ = self.try_shutdown(session).await;
                Err(e)
            }
        }
    }

    /// Always try to run the shutdown phase, ignoring errors from earlier phases.
    async fn try_shutdown<S: ApplicationSession + Send>(&mut self, session: &mut S) -> AppResult {
        self.phase = Phase::Shutdown;
        (session.shutdown()).await?;
        Ok(None)
    }

    /// Setup `tracing` messages with default options.
    #[cfg(feature = "tracing")]
    pub fn setup_tracing_with_defaults(&self) -> crate::tracing::TracingGuard {
        self.setup_tracing(crate::tracing::TracingOptions::default())
    }

    /// Setup `tracing` messages with custom options.
    #[cfg(feature = "tracing")]
    pub fn setup_tracing(&self, options: crate::tracing::TracingOptions) -> crate::tracing::TracingGuard {
        crate::tracing::setup_tracing(options)
    }

    /// Start the application with the provided session and execute all phases
    /// in order. If a phase fails, always run the shutdown phase.
    pub async fn run_with_parallel_execute<S, F, Fut>(&mut self, session: &mut S, op: F) -> AppResult
    where
        S: ApplicationSession + 'static,
        F: FnOnce(S) -> Fut + Send + 'static,
        Fut: std::future::Future<Output = AppResult> + Send + 'static,
    {
        use miette::IntoDiagnostic;
        use tracing::{instrument, trace};

        // Startup
        if let Err(error) = self.run_startup(session).await {
            self.run_shutdown(session, Some(&error)).await?;
            return Err(error);
        }

        // Analyze
        if let Err(error) = self.run_analyze(session).await {
            self.run_shutdown(session, Some(&error)).await?;
            return Err(error);
        }

        // Execute (parallel)
        if let Err(error) = self.run_execute_parallel(session, op).await {
            self.run_shutdown(session, Some(&error)).await?;
            return Err(error);
        }

        // Shutdown
        self.run_shutdown(session, None).await?;
        Ok(self.exit_code)
    }

    async fn run_startup<S>(&mut self, session: &mut S) -> AppResult
    where
        S: ApplicationSession,
    {
        self.phase = Phase::Startup;
        self.handle_exit_code((session.startup()).await?);
        Ok(None)
    }

    async fn run_analyze<S>(&mut self, session: &mut S) -> AppResult
    where
        S: ApplicationSession,
    {
        self.phase = Phase::Analyze;
        self.handle_exit_code((session.analyze()).await?);
        Ok(None)
    }

    async fn run_execute_parallel<S, F, Fut>(&mut self, session: &mut S, op: F) -> AppResult
    where
        S: ApplicationSession + 'static,
        F: FnOnce(S) -> Fut + Send + 'static,
        Fut: std::future::Future<Output = AppResult> + Send + 'static,
    {
        self.phase = Phase::Execute;
        let fg_session = session.clone();
        let mut bg_session = session.clone();
        let mut futures: Vec<JoinHandle<AppResult>> = vec![];
        futures.push(spawn(async move { op(fg_session).await }));
        futures.push(spawn(async move { bg_session.execute().await }));
        for future in futures {
            match future.await {
                Ok(inner) => self.handle_exit_code(Some(inner.ok_or_else(|| miette::miette!("No exit code returned from task"))?)),
                Err(join_err) => return Err(miette::miette!("Task join error: {join_err}")),
            }
        }
        Ok(None)
    }

    async fn run_shutdown<S>(&mut self, session: &mut S, error: Option<&miette::Report>) -> AppResult
    where
        S: ApplicationSession,
    {
        self.phase = Phase::Shutdown;
        self.handle_exit_code((session.shutdown()).await?);
        if error.is_some() && self.exit_code.is_none() {
            self.handle_exit_code(Some(1));
        }
        Ok(None)
    }

    fn handle_exit_code(&mut self, code: Option<u8>) {
        if let Some(code) = code {
            self.exit_code = Some(code);
        }
    }
}

pub type AppResult = miette::Result<Option<u8>>;

#[async_trait]
pub trait ApplicationSession: Clone + Send + Sync {
    async fn startup(&mut self) -> AppResult {
        Ok(None)
    }
    async fn analyze(&mut self) -> AppResult {
        Ok(None)
    }
    async fn execute(&mut self) -> AppResult {
        Ok(None)
    }
    async fn shutdown(&mut self) -> AppResult {
        Ok(None)
    }
}