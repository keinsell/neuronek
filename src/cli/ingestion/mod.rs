use std::borrow::Cow;
use std::cmp::Ordering;
use std::collections::{BTreeMap, HashMap};
use std::fmt::{Debug, Display, Formatter};
use std::ops::Deref;
use std::range::Range;
use std::str::FromStr;

use async_std::task;
use async_trait::async_trait;
use chrono::naive::serde::ts_microseconds::serialize;
use chrono::{DateTime, Duration, Local, NaiveDateTime, TimeZone, Utc};
use chrono_humanize::{Accuracy, HumanTime, Humanize, Tense};
use clap::{Parser, Subcommand};
use comfy_table::modifiers::UTF8_ROUND_CORNERS;
use comfy_table::presets::{UTF8_BORDERS_ONLY, UTF8_FULL};
use comfy_table::{ContentArrangement, Table as ComfyTable, Width};
use crossterm::style::Color::{AnsiValue, Magenta, Rgb, Yellow};
use crossterm::style::Stylize;
use indicatif::{HumanDuration, ProgressBar, ProgressStyle};
use miette::{IntoDiagnostic, miette};
use minimo::{Printable, header, success};
use owo_colors::{OwoColorize, style};
use ratatui::prelude::*;
use ratatui::widgets::{Block, Borders, Paragraph};
use sea_orm::{
	ActiveModelTrait,
	ActiveValue,
	ColumnTrait,
	EntityTrait,
	QueryFilter,
	QueryOrder,
	QuerySelect,
};
use sea_orm_migration::IntoSchemaManagerConnection;
use serde::{Deserialize, Serialize};
use tabled::builder::Builder;
use tabled::settings::object::{Columns, Rows, Segment};
use tabled::settings::{Alignment, Format, Modify, Padding, Style};
use tabled::{Table, Tabled, col, row};
use termimad::{LineStyle, MadSkin, ROUNDED_TABLE_BORDER_CHARS, gray, rgb};
use textplots::{Chart, Plot, Shape};
use thiserror::__private::AsDisplay;
use tracing::{Level, event, info};
use tuirealm::props::TextSpan;
use uuid::Uuid;

use crate::Exception::{DestructiveOperationNotConfirmed, EntityNotFound};
use crate::cli::{Displayable, MessageFormat};
use crate::database::entities::ingestion::{
	Entity as IngestionEntity,
	Model as IngestionModel,
	{self},
};
use crate::database::entities::ingestion_phase::{
	Entity as IngestionPhaseEntity,
	{self},
};
use crate::database::{DATABASE_CONNECTION, Ingestion};
use crate::ingestion::IngestionActions;
use crate::ingestion::action::{
	DeleteIngestion,
	ListIngestion,
	LogIngestion,
	UpdateIngestion,
	ViewIngestion,
};
use crate::ingestion::model::AnalyzeIngestion;
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::phase::{PHASE_ORDER, PhaseClassification};
use crate::ui::PhaseIcon;
use crate::ui::theme::MAD_SKIN;
use crate::{application::Application, Exception, database};
use crate::ingestion::service::list_ingestion;

impl Displayable for crate::ingestion::Ingestion
{
	/**
	╭──────────────────────────────┬───────────────────────────────────────────╮
	│  ID:         1               ┆  — Onset      12:56       →  13:01±5m     │
	│  Substance:  Caffeine        ┆  ↑ Comeup     13:01±5m    →  13:11±25m    │
	│  Dosage:     80.0 mg         ┆  ≡ Peak       13:11±25m   →  13:56±1.2h   │
	│  Route:      Oral            ┆  ↓ Comedown   13:56±1.2h  →  14:56±2.2h   │
    │  Ingested:   12:56 10/04/25  ┆  ≈ Afterglow  14:56±2.2h  →  18:56±10.2h  │
	╰──────────────────────────────┴───────────────────────────────────────────╯
	*/
	fn as_pretty(&self) -> String
	{
		let mut sorted_phases = self.phases.0.clone();
		sorted_phases.sort_by_key(|p| p.start_time.start);

		/**
		╭──────────────────────────────╮
		│  ID:         1               ┆
		│  Substance:  Caffeine        ┆
		│  Dosage:     80.0 mg         ┆
		│  Route:      Oral            ┆
		│  Ingested:   12:56 10/04/25  ┆
		╰──────────────────────────────╯
		*/
		let ingestion_information_pane_content = {
			// Ingestion #1
			// 25/04/10 12:56
			// 80mg Oral Caffeine
			// ...
			Table::from_iter(vec![
				vec!["ID:", &*self.id.unwrap().to_string()],
				vec!["Substance:", &*self.substance_name.to_string()],
				vec!["Dosage:", &*self.dosage.to_string()],
				vec!["Route:", &*self.route.to_string()],
				vec![
					"Ingested:",
					&*self.ingestion_date.format("%H:%M %d/%m/%y").to_string(),
				],
			])
				.with(Style::empty())
				.with(Modify::new(Rows::new(..)).with(Alignment::left()))
				.with(Modify::new(Columns::new(..)).with(Alignment::left()))
				.to_string()
		};

		/**
		╭─────────────────────────────────────────────╮
		│    — Onset      12:56       →  13:01±5m     │
		│    ↑ Comeup     13:01±5m    →  13:11±25m    │
		│    ≡ Peak       13:11±25m   →  13:56±1.2h   │
		│    ↓ Comedown   13:56±1.2h  →  14:56±2.2h   │
		│    ≈ Afterglow  14:56±2.2h  →  18:56±10.2h  │
		╰─────────────────────────────────────────────╯
		*/
		let phase_information_pane_content = {
			if !sorted_phases.is_empty() {
				let phase_data: Vec<Vec<_>> = sorted_phases
					.iter()
					.map(|phase| {
						let icon = PhaseIcon::from(&phase.classification).0;

						let start_uncertainty_duration = phase.start_time.end - phase.start_time.start;
						let end_uncertainty_duration = phase.end_time.end - phase.end_time.start;

						let start = format!(
							"{}{}",
							phase.start_time.start.format("%H:%M"),
							display_duration_as_uncertainty(start_uncertainty_duration)
						);
						let end = format!(
							"{}{}",
							phase.end_time.start.format("%H:%M"),
							display_duration_as_uncertainty(end_uncertainty_duration)
						);

						vec![
							format!("{} {}", icon, phase.classification),
							start,
							"→".to_owned(),
							end,
						]
					})
					.collect();

				let mut builder = Builder::default();
				phase_data
					.into_iter()
					.for_each(|row| builder.push_record(row));
				builder
					.build()
					.with(Style::empty())
					.with(Modify::new(Rows::new(..)).with(Alignment::left()))
					.with(Modify::new(Columns::new(..)).with(Alignment::left()))
					.to_string()
			} else {
				"PHASE INFORMATION UNAVAILABLE".to_string()
			}
		};

		let mut out: String = String::new();

		let mut table = ComfyTable::new();
		table
			.load_preset(UTF8_FULL)
			.apply_modifier(UTF8_ROUND_CORNERS)
			.set_content_arrangement(ContentArrangement::Dynamic)
			.set_width(80)
			.add_row(vec![ingestion_information_pane_content, phase_information_pane_content]);

		out.push_str("\n");
		out.push_str(&table.to_string());

		MAD_SKIN.text(&out.to_string(), None).to_string()
	}
}

fn display_duration_as_uncertainty(duration: Duration) -> String
{
	let total_minutes = duration.num_minutes();

	if total_minutes == 0 {
		// Return empty string when there's no uncertainty
		String::new()
	} else if total_minutes < 60 {
		// For durations less than an hour, show minutes
		format!("±{}m", total_minutes)
	} else {
		// For durations of an hour or more, show decimal hours
		format!("±{:.1}h", total_minutes as f64 / 60.0)
	}
}

#[derive(Debug, Serialize)]
pub struct IngestionList(pub Vec<crate::ingestion::Ingestion>);

impl Displayable for IngestionList
{
	fn as_pretty(&self) -> String
	{
		if self.0.is_empty() {
			return "No ingestions found.".to_string();
		}

		let mut output = String::new();

		let table = tabled::Table::new(&self.0)
			.with(Style::modern_rounded())
			.with(Modify::new(Rows::first()).with(Alignment::center()))
			.with(Padding::new(1, 1, 0, 0))
			.to_string();

		output.push_str(&table);
		MAD_SKIN.text(&output, None).to_string()
	}
}

#[async_trait]
impl crate::cli::Executable<crate::ingestion::Ingestion> for UpdateIngestion {
	async fn execute(self, ctx: &super::Session) -> miette::Result<crate::ingestion::Ingestion> {
		let existing_ingestion = IngestionEntity::find_by_id(self.ingestion_identifier)
			.one(ctx.database_connection)
			.await
			.into_diagnostic()?;

		if existing_ingestion.is_none() {
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

		Ok(updated_record)
	}
}

#[async_trait]
impl crate::cli::Executable<IngestionList> for ListIngestion {
	async fn execute(self, ctx: &super::Session) -> miette::Result<IngestionList> {
		let ingestions = list_ingestion(&self).await.unwrap();
		Ok(IngestionList(ingestions))
	}
}

#[derive(Debug, Serialize)]
pub struct DeleteResult;

impl Displayable for DeleteResult {
	fn as_pretty(&self) -> String {
		"Ingestion deleted".to_string()
	}
}

#[async_trait]
impl crate::cli::Executable<DeleteResult> for DeleteIngestion {
	async fn execute(self, ctx: &super::Session) -> miette::Result<DeleteResult> {
		let mut is_confirmed = self.confirmation.unwrap_or(false);
		let ingestion = IngestionEntity::find_by_id(self.ingestion_id)
			.one(ctx.database_connection)
			.await
			.into_diagnostic()?;

		if ingestion.is_none() {
			Err(miette!(EntityNotFound))?
		}

		if !is_confirmed && self.interactive {
			use dialoguer::Confirm;

			is_confirmed = Confirm::new()
				.with_prompt("Operation will be irreversible, are you sure?")
				.default(false)
				.interact()
				.map_err(|e| miette!("Failed to get confirmation: {}", e))?;
		}

		if !is_confirmed {
			return Err(miette!(Exception::DestructiveOperationNotConfirmed));
		}

		IngestionEntity::delete_by_id(self.ingestion_id)
			.exec(ctx.database_connection)
			.await
			.map_err(|err| {
				eprintln!("{}", err.to_string());
				err
			})
			.into_diagnostic()?;

		info!(ingestion_id = ingestion.unwrap().id, "Ingestion Deleted");

		Ok(DeleteResult)
	}
}

#[derive(Debug, Parser)]
pub struct IngestionCommand
{
	#[command(subcommand)]
	pub(crate) commands: IngestionActions,
}
