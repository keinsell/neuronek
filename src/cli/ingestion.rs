use crate::Application;
use crate::r#abstract::CommandHandler;
use crate::analyzer::AnalyzeIngestion;
use crate::analyzer::IngestionReport;
use crate::cli::Displayable;
use crate::cli::MessageFormat;
use crate::database;
use crate::database::DATABASE_CONNECTION;
use crate::database::entities::ingestion::Entity as IngestionEntity;
use crate::database::entities::ingestion::Model as IngestionModel;
use crate::database::entities::ingestion::{self};
use crate::database::entities::ingestion_phase::Entity as IngestionPhaseEntity;
use crate::database::entities::ingestion_phase::{self};
use crate::ingestion::IngestionActions;
use crate::ingestion::action::DeleteIngestion;
use crate::ingestion::action::ListIngestion;
use crate::ingestion::action::LogIngestion;
use crate::ingestion::action::UpdateIngestion;
use crate::ingestion::action::ViewIngestion;
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::phase::PHASE_ORDER;
use crate::substance::route_of_administration::phase::PhaseClassification;
use crate::substance::route_of_administration::phase::PhaseIcon;
use crate::theme::THEME;
use async_std::task;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::NaiveDateTime;
use chrono::TimeZone;
use chrono::Utc;
use chrono::naive::serde::ts_microseconds::serialize;
use chrono_humanize::Accuracy;
use chrono_humanize::HumanTime;
use chrono_humanize::Humanize;
use chrono_humanize::Tense;
use clap::Parser;
use clap::Subcommand;
use crossterm::style::Color::AnsiValue;
use crossterm::style::Color::Magenta;
use crossterm::style::Color::Rgb;
use crossterm::style::Color::Yellow;
use crossterm::style::Stylize;
use indicatif::HumanDuration;
use indicatif::ProgressBar;
use indicatif::ProgressStyle;
use miette::IntoDiagnostic;
use miette::miette;
use minimo::header;
use minimo::success;
use owo_colors::OwoColorize;
use owo_colors::style;
use ratatui::prelude::*;
use ratatui::widgets::Block;
use ratatui::widgets::Borders;
use ratatui::widgets::Paragraph;
use sea_orm::ActiveModelTrait;
use sea_orm::ActiveValue;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QueryOrder;
use sea_orm::QuerySelect;
use sea_orm_migration::IntoSchemaManagerConnection;
use serde::Deserialize;
use serde::Serialize;
use std::borrow::Cow;
use std::cmp::Ordering;
use std::collections::BTreeMap;
use std::collections::HashMap;
use std::fmt::Debug;
use std::fmt::Display;
use std::fmt::Formatter;
use std::ops::Deref;
use std::range::Range;
use std::str::FromStr;
use tabled::Table;
use tabled::Tabled;
use tabled::builder::Builder;
use tabled::settings::Alignment;
use tabled::settings::Format;
use tabled::settings::Modify;
use tabled::settings::Padding;
use tabled::settings::Style;
use tabled::settings::object::Columns;
use tabled::settings::object::Rows;
use tabled::settings::object::Segment;
use termimad::LineStyle;
use termimad::MadSkin;
use termimad::ROUNDED_TABLE_BORDER_CHARS;
use termimad::gray;
use termimad::rgb;
use textplots::Chart;
use textplots::Plot;
use textplots::Shape;
use thiserror::__private::AsDisplay;
use tracing::Level;
use tracing::event;
use tracing::info;
use tuirealm::props::TextSpan;
use uuid::Uuid;

impl Displayable for crate::ingestion::Ingestion
{
    fn as_pretty(&self) -> String
    {
        let mut output = String::new();

        output.push_str(&format!("\n# Ingestion #{} \n\n", self.id.unwrap()));

        // Create a clean text-based format instead of table with icons
        let mut content = String::new();

        // Display each piece of information on its own line with clear labeling
        content.push_str(&format!("**ID**: {}\n", self.id.unwrap()));
        content.push_str(&format!("**Substance**: {}\n", self.substance_name));

        // Format the dosage with appropriate unit
        let dosage_display = format!("{}", self.dosage);
        content.push_str(&format!("**Dosage**: {}\n", dosage_display));

        // Display route without icon
        content.push_str(&format!("**Route**: {}\n", self.route));

        // Format timestamp with readable notation without clock icon
        let timestamp = self.ingestion_date.format("%Y-%m-%d %H:%M:%S").to_string();
        content.push_str(&format!("**Ingested At**: {}\n", timestamp));

        // Render the content with the Catppuccin skin
        output.push_str(&content.to_string());
        output.push_str("\n");

        // If there are phases, add the phase visualization
        if !self.phases.0.is_empty()
        {
            output.push_str(&{
                let ingestion = self;

                let mut md_text = String::new();
                md_text.push_str("## Timeline\n\n");
                md_text.push_str(
                    "Analysis of ingestion progression based on substance information in \
                     database.\n",
                );
                md_text.push_str("*Note: Estimates may not be accurate.*\n\n");

                // Sort phases by their order in the timeline
                let mut sorted_phases = ingestion.phases.0.clone();
                sorted_phases.sort_by_key(|phase| phase.start_time.start);

                if sorted_phases.is_empty()
                {
                    return md_text + "No phases recorded for this ingestion.\n";
                }

                // More spacious table headers with icon in phase column and no weight column
                md_text.push_str("| Phase | Start Time | End Time | Duration |\n");
                md_text.push_str("|-------|------------|----------|----------|\n");

                for phase in &sorted_phases
                {
                    // Get the icon for this phase
                    let phase_icon = PhaseIcon::from(&phase.classification);

                    // Format start time with more spacing
                    let start_time = format!(
                        "{}  ±{}m",
                        phase.start_time.start.format("%H:%M"),
                        (phase.start_time.end - phase.start_time.start).num_minutes()
                    );

                    // Format end time with more spacing
                    let end_time = format!(
                        "{}  ±{}m",
                        phase.end_time.start.format("%H:%M"),
                        (phase.end_time.end - phase.end_time.start).num_minutes()
                    );

                    // Convert duration to ± format with more spacing
                    let avg_duration_minutes =
                        (phase.duration.start.num_minutes() + phase.duration.end.num_minutes()) / 2;
                    let duration_variance =
                        (phase.duration.end.num_minutes() - phase.duration.start.num_minutes()) / 2;

                    let duration = if avg_duration_minutes >= 60
                    {
                        let hours = avg_duration_minutes / 60;
                        let minutes = avg_duration_minutes % 60;
                        format!("{}h {}m  ±{}m", hours, minutes, duration_variance)
                    }
                    else
                    {
                        format!("{}m  ±{}m", avg_duration_minutes, duration_variance)
                    };

                    // Combine icon and phase name in the same column without styling
                    let phase_with_icon = format!("{} {}", phase_icon.0, phase.classification);

                    md_text.push_str(&format!(
                        "| {} | {} | {} | {} |\n",
                        phase_with_icon, start_time, end_time, duration
                    ));
                }

                if let Some(total_duration) = self.phases.duration_range()
                {
                    md_text.push_str("\n### Timeline Visualization\n\n");
                    let total_duration_minutes = total_duration.start.num_minutes();
                    let projected_end_time =
                        self.ingestion_date + Duration::minutes(total_duration_minutes);

                    // Get current time to show progress
                    let now = chrono::Local::now();

                    // Calculate total duration in hours for display
                    let total_hours = total_duration_minutes as f64 / 60.0;
                    md_text.push_str(&format!("Total Duration: ~{:.1} hours\n", total_hours));

                    // Calculate elapsed time and progress percentage
                    let elapsed = now.signed_duration_since(self.ingestion_date);
                    let elapsed_minutes = elapsed.num_minutes();

                    // Cap progress at 100% if we're past the projected end time
                    let progress_percent = if elapsed_minutes >= total_duration_minutes
                    {
                        100
                    }
                    else
                    {
                        (elapsed_minutes as f64 / total_duration_minutes as f64 * 100.0) as usize
                    };

                    // Create the progress bar
                    let bar_width = 50; // Width of the progress bar
                    let filled_width =
                        (progress_percent as f64 / 100.0 * bar_width as f64) as usize;

                    // Header showing start time, current time and end time
                    md_text.push_str(&format!(
                        "Start: {} | Current: {} | End: {}\n",
                        self.ingestion_date.format("%H:%M"),
                        now.format("%H:%M"),
                        projected_end_time.format("%H:%M")
                    ));

                    // Create the progress bar with current progress
                    let mut progress_bar = String::new();
                    progress_bar.push('[');

                    for i in 0..bar_width
                    {
                        if i < filled_width
                        {
                            progress_bar.push('=');
                        }
                        else if i == filled_width
                        {
                            progress_bar.push('>');
                        }
                        else
                        {
                            progress_bar.push(' ');
                        }
                    }

                    progress_bar.push_str(&format!("] {}%", progress_percent));
                    md_text.push_str(&progress_bar);
                    md_text.push_str("\n");

                    // Show phase markers on a timeline below the progress bar
                    if !sorted_phases.is_empty()
                    {
                        let mut timeline = vec![' '; bar_width];

                        // Place phase markers on the timeline
                        for phase in &sorted_phases
                        {
                            let phase_start_minutes = phase
                                .start_time
                                .start
                                .signed_duration_since(self.ingestion_date)
                                .num_minutes();

                            let marker_pos =
                                ((phase_start_minutes as f64 / total_duration_minutes as f64)
                                    * bar_width as f64) as usize;

                            if marker_pos < bar_width
                            {
                                let phase_icon = PhaseIcon::from(&phase.classification);
                                // Place the first character of the icon
                                timeline[marker_pos] = phase_icon.0.chars().next().unwrap_or('?');
                            }
                        }

                        // Create the timeline with phase markers
                        let mut timeline_str = String::new();
                        timeline_str.push('[');
                        timeline_str.push_str(&timeline.iter().collect::<String>());
                        timeline_str.push(']');
                        md_text.push_str(&timeline_str);
                        md_text.push_str("\n\n");

                        // Add legend for the phase markers
                        md_text.push_str("Legend: ");
                        for phase_type in PHASE_ORDER.iter()
                        {
                            let icon = PhaseIcon::from(phase_type);
                            md_text.push_str(&format!("{} = {}, ", icon.0, phase_type));
                        }
                        // Remove the last comma and space
                        if md_text.ends_with(", ")
                        {
                            md_text.truncate(md_text.len() - 2);
                        }
                        md_text.push('\n');
                    }
                }

                md_text
            });
        }

        THEME.text(&output, None).to_string()
    }
}

#[derive(Debug, Serialize)]
pub struct IngestionList(pub Vec<crate::ingestion::Ingestion>);

impl IngestionList {}

impl Displayable for IngestionList
{
    fn as_pretty(&self) -> String
    {
        if self.0.is_empty()
        {
            return "No ingestions found.".to_string();
        }

        let mut output = String::new();
        let mut table = Table::new(self.0.clone());
        table.with(Style::modern_rounded());
        output.push_str(&table.to_string());
        output
    }
}

#[async_trait]
impl CommandHandler for UpdateIngestion
{
    async fn handle<'a>(&self, ctx: Application<'a>) -> miette::Result<()>
    {
        let existing_ingestion = IngestionEntity::find_by_id(self.ingestion_identifier)
            .one(ctx.database_connection)
            .await
            .into_diagnostic()?;

        if existing_ingestion.is_none()
        {
            return Err(miette!(
                "Ingestion with ID {} not found",
                self.ingestion_identifier
            ));
        }

        let updated_model = ingestion::ActiveModel {
            id: ActiveValue::Set(self.ingestion_identifier),
            substance_name: self
                .substance_name
                .as_ref()
                .map(|name| ActiveValue::Set(name.clone()))
                .unwrap_or(ActiveValue::NotSet),
            dosage: self
                .dosage
                .as_ref()
                .map(|dosage| ActiveValue::Set(dosage.as_base_units() as f32))
                .unwrap_or(ActiveValue::NotSet),
            route_of_administration: self
                .route_of_administration
                .as_ref()
                .map(|roa| ActiveValue::Set(serde_json::to_string(roa).unwrap()))
                .unwrap_or(ActiveValue::NotSet),
            ingested_at: self
                .ingestion_date
                .as_ref()
                .map(|date| ActiveValue::Set(date.to_utc().naive_local()))
                .unwrap_or(ActiveValue::NotSet),
            updated_at: ActiveValue::Set(Local::now().to_utc().naive_local()),
            ..Default::default()
        };

        let updated_record: crate::ingestion::Ingestion = updated_model
            .update(ctx.database_connection)
            .await
            .into_diagnostic()?
            .into();

        info!(
            "Successfully updated ingestion with ID {}.",
            self.ingestion_identifier
        );

        updated_record.display(ctx.stdout_format);

        Ok(())
    }
}


#[async_trait]
impl CommandHandler for ListIngestion
{
    async fn handle<'a>(&self, ctx: Application<'a>) -> miette::Result<()>
    {
        let ingestions = IngestionEntity::find()
            .order_by_desc(ingestion::Column::IngestedAt)
            .limit(Some(self.limit))
            .all(ctx.database_connection)
            .await
            .into_diagnostic()?
            .iter()
            .map(|i| crate::ingestion::Ingestion::from(i.clone()))
            .collect();

        IngestionList(ingestions).display(ctx.stdout_format);

        Ok(())
    }
}


#[async_trait]
impl CommandHandler for DeleteIngestion
{
    async fn handle<'a>(&self, ctx: Application<'a>) -> miette::Result<()>
    {
        let delete_ingestion = IngestionEntity::delete_by_id(self.ingestion_id)
            .exec(ctx.database_connection)
            .await;

        if delete_ingestion.is_err()
        {
            return Err(miette!(
                "Failed to delete ingestion: {}",
                &delete_ingestion.unwrap_err()
            ));
        }

        info!(
            "Successfully deleted ingestion with ID {}.",
            self.ingestion_id
        );

        Ok(())
    }
}

#[derive(Debug, Parser)]
pub struct IngestionCommand
{
    #[command(subcommand)]
    pub(crate) commands: IngestionActions,
}
