use ratatui::prelude::*;
use ratatui::widgets::*;

use super::chart::render_chart;
use super::chart::theme::CatppuccinMocha as Theme;

pub fn ui(frame: &mut Frame, app: &super::App)
{
	let size = frame.size();

	// Create the layout
	let chunks = Layout::default()
		.direction(Direction::Vertical)
		.constraints([
			Constraint::Length(3), // Title
			Constraint::Min(0),    // Chart
			Constraint::Length(3), // Footer
		])
		.split(size);

	// Render title
	let substances = if app.datasets.is_empty() {
		"No Data".to_string()
	} else {
		app.datasets
			.iter()
			.map(|(name, _)| name.as_str())
			.collect::<Vec<_>>()
			.join(", ")
	};

	let title = Paragraph::new("Neuronek Monitor (alpha-preview)")
		.style(Style::default().fg(Theme::MAUVE).bold())
		.alignment(Alignment::Center)
		.block(
			Block::default()
				.borders(Borders::ALL)
				.border_style(Style::default().fg(Theme::SURFACE1))
				.style(Style::default().bg(Theme::BASE)),
		);
	frame.render_widget(title, chunks[0]);

	// Render chart
	render_chart(frame, app, chunks[1]);

	// Render footer with time range and current time
	let time_range = format!(
		"-2h ({}) <-> now ({}) <-> +22h ({}) | Press 'q' to quit",
		app.time_range.0.format("%H:%M"),
		app.current_time.format("%H:%M"),
		app.time_range.1.format("%H:%M")
	);

	let footer = Paragraph::new(time_range)
		.style(Style::default().fg(Theme::SUBTEXT1))
		.alignment(Alignment::Center)
		.block(
			Block::default()
				.borders(Borders::ALL)
				.border_style(Style::default().fg(Theme::SURFACE1))
				.style(Style::default().bg(Theme::BASE)),
		);
	frame.render_widget(footer, chunks[2]);
}
