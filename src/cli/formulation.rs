use clap::Parser;
use futures::executor::block_on;
use futures::prelude::*;

use crate::formulation::Command as FormulationCommand;

#[derive(Parser)]
pub struct Command
{
	#[command(subcommand)]
	command: FormulationCommand,
}

pub fn handle(command: Command)
{
	block_on(async {
		match command.command {
			| FormulationCommand::Create(_) => {}
			| FormulationCommand::Update(_) => {}
			| FormulationCommand::Delete(_) => {}
			| FormulationCommand::List(_) => {}
			| FormulationCommand::Get(_) => {}
		};
	})
}
