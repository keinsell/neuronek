use ratatui::layout::{Constraint, Direction, Layout, Rect};
use ratatui::style::{Color, Style, Stylize};
use ratatui::widgets::{Block, Borders, Cell, Paragraph, Row, Table};
use ratatui::Frame;

use crate::database::DatabaseConnection;
use crate::ingestion::action::ListIngestion;
use crate::ingestion::model::Ingestion;
use crate::ingestion::service::list_ingestion;

pub struct Dashboard<'a> {
	db: &'a DatabaseConnection,
	ingestions: Vec<Ingestion>,
}

impl<'a> Dashboard<'a> {
	pub fn new(db: &'a DatabaseConnection) -> Self {
		Self {
			db,
			ingestions: Vec::new(),
		}
	}

	pub async fn update(&mut self) {
		self.ingestions = list_ingestion(&ListIngestion { limit: 10 })
			.await
			.unwrap_or_default();
	}

	pub fn render(&self, frame: &mut Frame, area: Rect) {
		let layout = Layout::default()
			.direction(Direction::Vertical)
			.constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
			.split(area);

		self.render_ingestions_table(frame, layout[0]);
		self.render_ingestion_graph(frame, layout[1]);
	}

	fn render_ingestions_table(&self, frame: &mut Frame, area: Rect) {
		let header_cells = ["Substance", "Dosage", "Date"]
			.iter()
			.map(|h| Cell::from(*h).style(Style::default().fg(Color::White).bold()));
		let header = Row::new(header_cells).height(1).bottom_margin(1);

		let rows = self.ingestions.iter().map(|ingestion| {
			let date_str = ingestion.ingestion_date.to_string();
			let date_parts: Vec<&str> = date_str.splitn(2, ' ').collect();
			let date_part = date_parts.get(0).cloned().unwrap_or("Invalid date");
			let dosage_str = format!("{} {}", ingestion.dosage, ingestion.route.to_string());
			let item = vec![
				ingestion.substance_name.to_string(),
				dosage_str,
				date_part.to_string(),
			];
			Row::new(item.into_iter().map(Cell::from))
		});

		let table = Table::new(
			rows,
			&[
				Constraint::Percentage(33),
				Constraint::Percentage(33),
				Constraint::Percentage(33),
			],
		)
		.header(header)
		.block(
			Block::default()
				.borders(Borders::ALL)
				.title("Ingestions"),
		);

		frame.render_widget(table, area);
	}

	fn render_ingestion_graph(&self, frame: &mut Frame, area: Rect) {
		let ingestions_for_graph: Vec<(f64, f64)> = self
			.ingestions
			.iter()
			.map(|ingestion| {
				(
					ingestion.ingestion_date.timestamp() as f64,
					ingestion.dosage.as_base_units(),
				)
			})
			.collect();

		let x_labels = [
			self.ingestions
				.first()
				.map(|i| i.ingestion_date.format("%Y-%m-%d").to_string())
				.unwrap_or_default(),
			self.ingestions
				.last()
				.map(|i| i.ingestion_date.format("%Y-%m-%d").to_string())
				.unwrap_or_default(),
		];

		let max_dosage = self
			.ingestions
			.iter()
			.map(|i| i.dosage.as_base_units())
			.max_by(|a, b| a.partial_cmp(b).unwrap())
			.unwrap_or(0.0);

		let y_labels = [
			"0".to_string(),
			format!("{:.2}", max_dosage),
		];

		let datasets = vec![ratatui::widgets::Dataset::default()
			.name("Ingestions")
			.marker(ratatui::symbols::Marker::Dot)
			.style(Style::default().fg(Color::Cyan))
			.data(&ingestions_for_graph)];

		let chart = ratatui::widgets::Chart::new(datasets)
			.block(
				Block::default()
					.title("Ingestion Graph")
					.borders(Borders::ALL),
			)
			.x_axis(
				ratatui::widgets::Axis::default()
					.title("Date")
					.style(Style::default().fg(Color::Gray))
					.bounds([
						self.ingestions
							.first()
							.map(|i| i.ingestion_date.timestamp() as f64)
							.unwrap_or(0.0),
						self.ingestions
							.last()
							.map(|i| i.ingestion_date.timestamp() as f64)
							.unwrap_or(0.0),
					])
					.labels(
						x_labels
							.iter()
							.cloned()
							.map(ratatui::text::Span::from)
							.collect(),
					),
			)
			.y_axis(
				ratatui::widgets::Axis::default()
					.title("Dosage")
					.style(Style::default().fg(Color::Gray))
					.bounds([0.0, max_dosage])
					.labels(
						y_labels
							.iter()
							.cloned()
							.map(ratatui::text::Span::from)
							.collect(),
					),
			);

		frame.render_widget(chart, area);
	}
}