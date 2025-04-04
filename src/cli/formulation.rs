use clap::Parser;
use derive_more::From;
use futures::executor::block_on;
use futures::prelude::*;
use sea_orm::TransactionTrait;
use serde::Serialize;

use crate::cli::Displayable;
use crate::formulation::ingredient::Ingredient;
use crate::formulation::{create_formulation, Command as FormulationCommand, Formulation};
use crate::Application;

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
		let table = tabled::Table::new(self.0.clone());
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
			| FormulationCommand::Update(_) => {}
			| FormulationCommand::Delete(_) => {}
			| FormulationCommand::List(_) => {}
			| FormulationCommand::Get(_) => {}
		};

		transaction.commit().await.unwrap()
	})
}
