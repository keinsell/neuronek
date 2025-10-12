use std::io;

use crossterm::event::{self, Event, KeyCode};
use crossterm::execute;
use crossterm::terminal::{
	disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen,
};
use miette::{IntoDiagnostic, Result};
use ratatui::prelude::*;
use ratatui::widgets::{Block, Borders, Paragraph};

use super::dashboard::Dashboard;
use crate::database::DatabaseConnection;

pub struct App<'a> {
	db: &'a DatabaseConnection,
	dashboard: Dashboard<'a>,
}

impl<'a> App<'a> {
	pub fn new(db: &'a DatabaseConnection) -> Self {
		Self {
			db,
			dashboard: Dashboard::new(db),
		}
	}

	pub async fn run(&mut self) -> Result<()> {
		let mut terminal = setup_terminal()?;

		loop {
			self.dashboard.update().await;
			if let Err(err) = terminal.draw(|f| self.ui(f)) {
				eprintln!("Error drawing UI: {:?}", err);
				break;
			}

			if event::poll(std::time::Duration::from_millis(250))
				.expect("event poll failed")
			{
				if let Event::Key(key) = event::read().expect("event read failed") {
					if KeyCode::Char('q') == key.code {
						break;
					}
				}
			}
		}

		restore_terminal()
	}

	fn ui(&self, frame: &mut Frame) {
		let main_layout = Layout::default()
			.direction(Direction::Vertical)
			.constraints([Constraint::Percentage(100)])
			.split(frame.size());

		self.dashboard.render(frame, main_layout[0]);
	}
}

fn setup_terminal() -> Result<Terminal<impl Backend>> {
	let mut stdout = io::stdout();
	enable_raw_mode().into_diagnostic()?;
	execute!(stdout, EnterAlternateScreen).into_diagnostic()?;
	Terminal::new(CrosstermBackend::new(stdout)).into_diagnostic()
}

fn restore_terminal() -> Result<()> {
	disable_raw_mode().into_diagnostic()?;
	execute!(io::stdout(), LeaveAlternateScreen).into_diagnostic()?;
	Ok(())
}