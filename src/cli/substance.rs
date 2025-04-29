use std::ops::Deref;
use std::str::FromStr;

use async_trait::async_trait;
use clap::{Args, Parser, Subcommand};
use crossterm::style::Stylize;
use minimo::Printable;
use owo_colors::OwoColorize;
use sea_orm::{ColumnTrait, EntityTrait, QuerySelect};
use serde::{Deserialize, Serialize};
use tabled::settings::{Panel, Remove, Style};
use tabled::{Table, Tabled};
use crate::Application;
use crate::r#abstract::CommandHandler;
use crate::cli::Displayable;
use crate::database::entities::substance::{Column, Entity as SubstanceEntity};
use crate::database::{ConnectionTrait, DATABASE_CONNECTION};
use crate::substance::Substance;
use crate::substance::error::SubstanceError;
use crate::substance::route_of_administration::Dosages;

impl Displayable for Dosages
{
	fn as_table(&self) -> String
	where Self: Tabled
	{
		todo!()
	}
}

use itertools::Itertools;
use tabled::settings::Alignment;
use tabled::settings::object::Rows;

use crate::ui::theme::MAD_SKIN;
use crate::ui::{DosageIcon, PhaseIcon};

impl Displayable for Substance
{
	fn as_pretty(&self) -> String
	{
		let mut output = String::new();

		if let Some(table) = self.build_routes_table() {
			output.push_str(&table);
		} else {
			output.push_str(&"No route information available.".dimmed().to_string());
		}

		MAD_SKIN.term_text(&output).to_string()
	}

	fn as_table(&self) -> String
	where Self: Tabled
	{
		Table::new(vec![self]).with(Style::psql()).to_string()
	}
}

impl Substance
{
	fn build_routes_table(&self) -> Option<String>
	{
		use itertools::Itertools;

		#[derive(Tabled)]
		struct RouteRow
		{
			#[tabled(rename = "Route")]
			route: String,
			#[tabled(rename = "Dosage")]
			dosage: String,
			#[tabled(rename = "Phases")]
			phases: String,
		}

		let fmt_dur = |secs: u64| {
			if secs >= 86_400 {
				format!("{}d", secs / 86_400)
			} else if secs >= 3_600 {
				format!("{}h", secs / 3_600)
			} else if secs >= 60 {
				format!("{}m", secs / 60)
			} else {
				format!("{}s", secs)
			}
		};

		let mut rows = Vec::new();
		let mut routes: Vec<_> = self.routes_of_administration.values().collect();
		routes.sort_by_key(|r| &r.classification);

		for route in routes {
			let dosage_rows: Vec<_> = route
				.dosages
				.iter()
				.sorted_by_key(|(class, _)| *class)
				.map(|(class, range)| {
					#[derive(Tabled)]
					struct DosageRow
					{
						#[tabled(rename = "Classification")]
						classification: String,
						#[tabled(rename = "Range")]
						range: String,
					}
					let range_str = match (range.start.as_ref(), range.end.as_ref()) {
						| (Some(start), Some(end)) => format!("{}-{}", start, end),
						| (Some(start), None) => format!("≥{}", start),
						| (None, Some(end)) => format!("≤{}", end),
						| _ => "N/A".into(),
					};
					DosageRow {
						classification: format!(
							"{} {}",
							DosageIcon::from(class),
							class.to_string()
						),
						range: range_str,
					}
				})
				.collect();

			let phase_rows: Vec<_> = route
				.phases
				.iter()
				.sorted_by_key(|(phase, _)| *phase)
				.map(|(phase, duration)| {
					#[derive(Tabled)]
					struct PhaseRow
					{
						#[tabled(rename = "Phase")]
						phase: String,
						#[tabled(rename = "Duration")]
						duration: String,
					}
					let start = duration.start.to_std().unwrap().as_secs();
					let end = duration.end.to_std().unwrap().as_secs();
					let duration_str = format!("{}-{}", fmt_dur(start), fmt_dur(end));
					PhaseRow {
						phase: format!("{} {}", PhaseIcon::from(phase), phase),
						duration: duration_str,
					}
				})
				.collect();

			rows.push(RouteRow {
				route: route.classification.to_string(),
				dosage: Table::new(dosage_rows)
					.with(Style::empty())
					.with(Alignment::left())
					.with(Remove::row(Rows::first()))
					.to_string(),
				phases: Table::new(phase_rows)
					.with(Style::empty())
					.with(Alignment::left())
					.with(Remove::row(Rows::first()))
					.to_string(),
			});
		}

		(!rows.is_empty()).then(|| {
			Table::new(rows)
				.with(Style::modern_rounded())
				.with(Alignment::left())
				.with(Panel::header(self.name.to_string()))
				.to_string()
		})
	}
}

#[derive(Debug, Args)]
pub struct GetSubstance
{
	/// The name of the substance to get information about
	#[arg(index = 1, value_parser = possible_substances)]
	pub name: String,
}

/// Returns possible substance names for shell completion
fn possible_substances(partial: &str) -> Result<String, String>
{
	// For shell completion, return all substance names
	if std::env::var("COMP_LINE").is_ok() {
		// Run in a new runtime since we're in a sync context
		let rt = tokio::runtime::Runtime::new().unwrap();
		let names = rt.block_on(get_substance_names());

		// Filter names that match the partial input
		let matches: Vec<String> = names
			.into_iter()
			.filter(|name| name.starts_with(partial))
			.collect();

		return Ok(matches.join("\n"));
	}

	// For immediate validation, accept any input
	Ok(partial.to_string())
}

/// Get a list of all available substance names
pub async fn get_substance_names() -> Vec<String>
{
	let db_connection = DATABASE_CONNECTION.deref();
	SubstanceEntity::find()
		.select_only()
		.column(Column::Name)
		.into_tuple::<String>()
		.all(db_connection)
		.await
		.unwrap_or_default()
}

#[async_trait]
impl CommandHandler<()> for GetSubstance
{
	async fn handle<'a>(&self, ctx: Application<'a>) -> miette::Result<()>
	{
		let substance: Substance =
			crate::substance::repository::get_substance(&self.name, ctx.database_connection)
				.await?
				.unwrap_or_else(|| panic!("{}", SubstanceError::NotFound));

		substance.display(ctx.stdout_format);

		Ok(())
	}
}

#[derive(Debug, Subcommand)]
enum SubstanceCommands
{
	Get(GetSubstance),
}

#[derive(Debug, Parser)]
pub struct SubstanceCommand
{
	#[command(subcommand)]
	commands: SubstanceCommands,
}

#[async_trait]
impl CommandHandler for SubstanceCommand
{
	async fn handle<'a>(&self, ctx: Application<'a>) -> miette::Result<()>
	{
		match &self.commands {
			| SubstanceCommands::Get(command) => command.handle(ctx).await.map(|_| ()),
		}
	}
}

#[derive(Debug, Serialize, Deserialize, Tabled, bon::Builder)]
pub struct ViewModel
{
	pub id: String,
	pub name: String,
	pub common_names: String,
}

impl From<crate::database::entities::substance::Model> for ViewModel
{
	fn from(model: crate::database::entities::substance::Model) -> Self
	{
		ViewModel {
			id: model.id.clone().chars().take(6).collect(),
			name: model.name,
			common_names: model.common_names.clone(),
		}
	}
}
