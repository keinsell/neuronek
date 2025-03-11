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

use comfy_table::ContentArrangement;
use comfy_table::Table as ComfyTable;
use comfy_table::Width;
use comfy_table::modifiers::UTF8_ROUND_CORNERS;
use comfy_table::presets::UTF8_BORDERS_ONLY;
use comfy_table::presets::UTF8_FULL;

impl Displayable for crate::ingestion::Ingestion
{
    fn as_pretty(&self) -> String
    {
        let mut output = String::new();
        let mut sorted_phases = self.phases.0.clone();
        sorted_phases.sort_by_key(|phase| phase.start_time.start);

        let mut dual_column_table = ComfyTable::new();
        dual_column_table
            .load_preset(UTF8_FULL)
            .apply_modifier(UTF8_ROUND_CORNERS)
            .set_content_arrangement(ContentArrangement::Dynamic)
            .set_width(80);

        let left_pane = {
            let id_label = "ID:".to_owned();
            let id_value = self.id.unwrap().to_string();
            let ingestion = self.clone();
            let substance_label = "Substance:".to_owned();
            let substance_value = ingestion.substance_name.clone();
            let dosage_label = "Dosage:".to_owned();
            let dosage_value = ingestion.dosage.clone().to_string();
            let route_label = "Route:".to_owned();
            let route_value = ingestion.route.clone().to_string();
            let ingested_label = "Ingested:".to_owned();
            let ingested_value = ingestion
                .ingestion_date
                .format("%H:%M %d/%m/%y")
                .to_string();


            let data = vec![
                vec![id_label, id_value],
                vec![substance_label, substance_value],
                vec![dosage_label, dosage_value],
                vec![route_label, route_value],
                vec![ingested_label, ingested_value],
            ];

            Table::from_iter(data)
                .with(Style::empty())
                .with(Modify::new(Rows::new(..)).with(Alignment::left()))
                .with(Modify::new(Columns::new(..)).with(Alignment::left()))
                .to_string()
        };
        let right_pane = {
            if !sorted_phases.is_empty()
            {
                let mut phase_info = String::new();

                for phase in &sorted_phases
                {
                    let phase_icon = PhaseIcon::from(&phase.classification);

                    let start_time = format!(
                        "{}±{}m",
                        phase.start_time.start.format("%H:%M"),
                        (phase.start_time.end - phase.start_time.start).num_minutes()
                    );

                    let end_time = format!(
                        "{}±{}m",
                        phase.end_time.start.format("%H:%M"),
                        (phase.end_time.end - phase.end_time.start).num_minutes()
                    );

                    let avg_duration_minutes =
                        (phase.duration.start.num_minutes() + phase.duration.end.num_minutes()) / 2;

                    let duration = if avg_duration_minutes >= 60
                    {
                        let hours = avg_duration_minutes / 60;
                        let minutes = avg_duration_minutes % 60;
                        if minutes > 0
                        {
                            format!("{}h{}m", hours, minutes)
                        }
                        else
                        {
                            format!("{}h", hours)
                        }
                    }
                    else
                    {
                        format!("{}m", avg_duration_minutes)
                    };

                    phase_info.push_str(&format!(
                        "{} {}: {} → {} ({})\n",
                        phase_icon.0, phase.classification, start_time, end_time, duration
                    ));
                }

                phase_info.trim_end().to_string()
            }
            else
            {
                "No phases recorded for this ingestion.".to_string()
            }
        };

        dual_column_table.add_row(vec![left_pane, right_pane]);
        output.push_str(&dual_column_table.to_string());

        // Add a progress status row to the table if phases exist
        // if let Some(total_duration) = self.phases.duration_range()
        // {
        //     let total_duration_minutes = total_duration.start.num_minutes();
        //     let projected_end_time =
        //         self.ingestion_date + Duration::minutes(total_duration_minutes);
        //     let now = chrono::Local::now();
        //     let total_hours = (total_duration_minutes / 60) as f64;
        //     let total_minutes = total_duration_minutes % 60;
        //     let elapsed = now.signed_duration_since(self.ingestion_date);
        //     let elapsed_minutes = elapsed.num_minutes();
        //     let progress_percent = if elapsed_minutes >= total_duration_minutes
        //     {
        //         100
        //     }
        //     else
        //     {
        //         (elapsed_minutes as f64 / total_duration_minutes as f64 * 100.0) as
        // usize     };
        //
        //     // Find current phase - look for the phase that contains the current time
        //     let current_phase = sorted_phases.iter().find(|&phase| {
        //         let phase_start = phase.start_time.start;
        //         let phase_end = phase.end_time.end;
        //         now >= phase_start && now <= phase_end
        //     });
        //
        //     // If no phase directly contains current time but ingestion is in
        // progress,     // use the next upcoming phase or the most recently
        // completed phase     let current_phase =
        //         if current_phase.is_none() && now > self.ingestion_date &&
        // progress_percent < 100         {
        //             // Try to find the next phase
        //             let next_phase = sorted_phases
        //                 .iter()
        //                 .find(|&phase| now < phase.start_time.start);
        //
        //             // If no next phase, find the most recent phase
        //             if next_phase.is_none()
        //             {
        //                 sorted_phases
        //                     .iter()
        //                     .rev()
        //                     .find(|&phase| now > phase.end_time.end)
        //             }
        //             else
        //             {
        //                 next_phase
        //             }
        //         }
        //         else
        //         {
        //             current_phase
        //         };
        //
        //     // Build progress bar
        //     let progress_bar_width = 30;
        //     let filled_chars =
        //         (progress_percent as f64 * progress_bar_width as f64 / 100.0).round()
        // as usize;     let empty_chars = progress_bar_width - filled_chars;
        //
        //     let progress_bar = format!("[{}{}]", "▓".repeat(filled_chars),
        // "░".repeat(empty_chars));
        //
        //     // Calculate remaining time in current phase if available
        //     let current_phase_text = if let Some(phase) = current_phase
        //     {
        //         let remaining = phase.end_time.start.signed_duration_since(now);
        //         let remaining_hours = remaining.num_hours();
        //         let remaining_minutes = remaining.num_minutes() % 60;
        //
        //         let remaining_text = if remaining_hours > 0
        //         {
        //             format!("{}h{}m", remaining_hours, remaining_minutes)
        //         }
        //         else if remaining_minutes >= 0
        //         {
        //             format!("{}m", remaining_minutes)
        //         }
        //         else
        //         {
        //             "finishing".to_string()
        //         };
        //
        //         format!(
        //             "{} {}\n({})",
        //             PhaseIcon::from(&phase.classification).0,
        //             phase.classification,
        //             remaining_text + " remaining"
        //         )
        //     }
        //     else if now < self.ingestion_date
        //     {
        //         // Calculate time until start
        //         let until_start = self.ingestion_date.signed_duration_since(now);
        //         let until_start_mins = until_start.num_minutes();
        //
        //         if until_start_mins < 60
        //         {
        //             format!("Scheduled (in {}m)", until_start_mins)
        //         }
        //         else
        //         {
        //             format!(
        //                 "Scheduled (in {}h{}m)",
        //                 until_start_mins / 60,
        //                 until_start_mins % 60
        //             )
        //         }
        //     }
        //     else
        //     {
        //         "Complete".to_string()
        //     };
        //
        //     // Format the total duration nicely
        //     let total_duration_text = if total_hours >= 1.0
        //     {
        //         if total_minutes > 0
        //         {
        //             format!("~{}h{}m", total_hours as i64, total_minutes)
        //         }
        //         else
        //         {
        //             format!("~{}h", total_hours as i64)
        //         }
        //     }
        //     else
        //     {
        //         format!("~{}m", total_duration_minutes)
        //     };
        //
        //     // Create a progress info table
        //     let mut progress_table = ComfyTable::new();
        //     progress_table
        //         .load_preset(UTF8_FULL)
        //         .apply_modifier(UTF8_ROUND_CORNERS)
        //         .set_content_arrangement(ContentArrangement::Dynamic)
        //         .set_width(80);
        //
        //     if now < self.ingestion_date
        //     {
        //         // Show scheduled info
        //         progress_table.add_row(vec![
        //             format!("Status: {}", current_phase_text),
        //             format!("Total Duration: {}", total_duration_text),
        //             format!(
        //                 "Scheduled Start: {}",
        //                 self.ingestion_date.format("%H:%M %d/%m").to_string()
        //             ),
        //         ]);
        //     }
        //     else if progress_percent >= 100
        //     {
        //         // Show completed info
        //         progress_table.add_row(vec![
        //             "Status: Complete".to_string(),
        //             format!("Total Duration: {}", total_duration_text),
        //             format!(
        //                 "Started: {}",
        //                 self.ingestion_date.format("%H:%M %d/%m").to_string()
        //             ),
        //         ]);
        //     }
        //     else
        //     {
        //         // Show active progress
        //         progress_table.add_row(vec![
        //             format!("Progress: {} {}%", progress_bar, progress_percent),
        //             format!("Current: {}", current_phase_text),
        //         ]);
        //         progress_table.add_row(vec![
        //             format!("Total Duration: {}", total_duration_text),
        //             format!(
        //                 "Started: {}",
        //                 self.ingestion_date.format("%H:%M").to_string()
        //             ),
        //             format!(
        //                 "Est. End: {}",
        //                 projected_end_time.format("%H:%M").to_string()
        //             ),
        //         ]);
        //     }
        //
        //     output.push_str("\n\n");
        //     output.push_str(&progress_table.to_string());
        // }

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
        output.push_str("# INGESTION LIST\n\n");

        // Create a table with enhanced formatting
        let mut builder = Builder::default();

        // Add header row
        builder.push_record(vec![
            "ID",
            "SUBSTANCE",
            "DOSAGE",
            "ROUTE",
            "INGESTED AT",
            "STATUS",
        ]);

        // Add data rows
        for ingestion in &self.0
        {
            let now = chrono::Local::now();
            let elapsed = now.signed_duration_since(ingestion.ingestion_date);

            // Calculate status indicator
            let mut status = String::from("Unknown");

            if let Some(total_duration) = ingestion.phases.duration_range()
            {
                let total_duration_minutes = total_duration.start.num_minutes();
                let progress_percent = if elapsed.num_minutes() >= total_duration_minutes
                {
                    100
                }
                else
                {
                    (elapsed.num_minutes() as f64 / total_duration_minutes as f64 * 100.0) as usize
                };

                // Find current phase
                let mut sorted_phases = ingestion.phases.0.clone();
                sorted_phases.sort_by_key(|phase| phase.start_time.start);

                let current_phase = sorted_phases.iter().find(|&phase| {
                    let phase_start = phase.start_time.start;
                    let phase_end = phase.end_time.end;
                    now >= phase_start && now <= phase_end
                });

                // If no phase directly contains current time but ingestion is in progress,
                // use the next upcoming phase or the most recently completed phase
                let current_phase = if current_phase.is_none()
                    && now > ingestion.ingestion_date
                    && progress_percent < 100
                {
                    // Try to find the next phase
                    let next_phase = sorted_phases
                        .iter()
                        .find(|&phase| now < phase.start_time.start);

                    // If no next phase, find the most recent phase
                    if next_phase.is_none()
                    {
                        sorted_phases
                            .iter()
                            .rev()
                            .find(|&phase| now > phase.end_time.end)
                    }
                    else
                    {
                        next_phase
                    }
                }
                else
                {
                    current_phase
                };

                if now < ingestion.ingestion_date
                {
                    // Calculate time until start
                    let until_start = ingestion.ingestion_date.signed_duration_since(now);
                    let until_start_mins = until_start.num_minutes();

                    if until_start_mins < 60
                    {
                        status = format!("Scheduled (in {}m)", until_start_mins);
                    }
                    else
                    {
                        status = format!(
                            "Scheduled (in {}h{}m)",
                            until_start_mins / 60,
                            until_start_mins % 60
                        );
                    }
                }
                else if progress_percent >= 100
                {
                    status = "Complete".to_string();
                }
                else if let Some(phase) = current_phase
                {
                    let phase_icon = PhaseIcon::from(&phase.classification).0;

                    // Add compact progress bar for active phases
                    let bar_width = 5;
                    let filled =
                        (progress_percent as f64 * bar_width as f64 / 100.0).round() as usize;
                    let empty = bar_width - filled;
                    let progress_bar = format!("[{}{}]", "█".repeat(filled), "░".repeat(empty));

                    status = format!(
                        "{} {} {} {}%",
                        phase_icon, phase.classification, progress_bar, progress_percent
                    );
                }
            }

            builder.push_record(vec![
                &ingestion.id.unwrap().to_string(),
                &ingestion.substance_name,
                &ingestion.dosage.to_string(),
                &ingestion.route.to_string(),
                &ingestion
                    .ingestion_date
                    .format("%H:%M %d/%m/%y")
                    .to_string(),
                &status,
            ]);
        }

        // Build table with styling
        let table = builder
            .build()
            .with(Style::modern_rounded())
            .with(Modify::new(Rows::first()).with(Alignment::center()))
            .with(Padding::new(1, 1, 0, 0))
            .to_string();

        output.push_str(&table);
        THEME.text(&output, None).to_string()
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
