use clap::Parser;
use derive_more::From;
use futures::executor::block_on;
use futures::prelude::*;
use sea_orm::TransactionTrait;
use serde::Serialize;
use tabled::settings::Style;
use tabled::Table;
use crate::Application;
use crate::cli::Displayable;
use crate::formulation::ingredient::Ingredient;
use crate::formulation::{Command as FormulationCommand, Formulation, create_formulation, delete_formulation, get_formulation, list_formulations};

impl Displayable for Formulation
{
	fn as_pretty(&self) -> String { self.as_table() }
}

#[derive(Serialize, Debug, Clone, From)]

pub struct FormulationList(Vec<Formulation>);

impl Displayable for FormulationList
{
	fn as_pretty(&self) -> String
	{
		let mut table = Table::new(self.0.iter());
		table.with(Style::modern_rounded());
		table.to_string()
	}
}

impl Displayable for Ingredient {}

#[derive(Parser)]
pub struct Command
{
	#[command(subcommand)]
	command: FormulationCommand,
}

pub fn handle(command: Command, application: &Application)
{
	block_on(async {
		let transaction = application.database_connection.begin().await.unwrap();
		match command.command {
			| FormulationCommand::Create(cmd) => {
				let formulation = create_formulation(&cmd, &transaction).await.unwrap();
				formulation.display(application.stdout_format.clone());
			}
			| FormulationCommand::Update(_) => {

			}
			| FormulationCommand::Delete(cmd) => {
				if let Err(err) = delete_formulation(&cmd, &transaction).await {
					eprintln!("Error deleting formulation: {}", err);
					std::process::exit(1);
				}
				println!("Formulation deleted successfully");
			}
			| FormulationCommand::List(cmd) => {
				let formulation = list_formulations(&cmd, &transaction).await.unwrap();
				let formulation_list = FormulationList::from(formulation);
				formulation_list.display(application.stdout_format.clone());
			}
			| FormulationCommand::Get(cmd) => {
				let formulation = get_formulation(&cmd, &transaction).await.unwrap();
				formulation.display(application.stdout_format.clone());
			}
		};

		transaction.commit().await.unwrap()
	})
}
