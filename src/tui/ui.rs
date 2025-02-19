use ratatui::Frame;
use ratatui::layout::Constraint;
use ratatui::layout::Direction;
use ratatui::layout::Layout;
use ratatui::layout::Rect;
use ratatui::style::Color;
use ratatui::style::Style;
use ratatui::text::Line;
use ratatui::text::Span;
use ratatui::widgets::Block;
use ratatui::widgets::Borders;
use ratatui::widgets::Paragraph;
use ratatui::widgets::Tabs;

use super::app::App;

pub fn render(frame: &mut Frame, app: &App)
{
    // Create the main layout
    let main_layout = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(3), // Header
            Constraint::Min(0),    // Body
            Constraint::Length(3), // Footer
        ])
        .split(frame.area());

    // Create the body layout with sidebar
    let body_layout = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Percentage(20), // Sidebar
            Constraint::Percentage(80), // Main content
        ])
        .split(main_layout[1]);

    render_header(frame, app, main_layout[0]);
    render_sidebar(frame, app, body_layout[0]);
    render_main(frame, app, body_layout[1]);
    render_footer(frame, app, main_layout[2]);
}

fn render_header(frame: &mut Frame, app: &App, area: Rect)
{
    let titles = ["Home", "Substances", "Stats", "Settings"]
        .iter()
        .map(|t| Line::from(Span::styled(*t, Style::default().fg(Color::White))))
        .collect::<Vec<_>>();

    let tabs = Tabs::new(titles)
        .block(Block::default().borders(Borders::ALL).title("Neuronek"))
        .select(app.selected_tab)
        .style(Style::default().fg(Color::White))
        .highlight_style(Style::default().fg(Color::Yellow));

    frame.render_widget(tabs, area);
}

fn render_sidebar(frame: &mut Frame, _app: &App, area: Rect)
{
    let sidebar = Block::default().title("Navigation").borders(Borders::ALL);
    frame.render_widget(sidebar, area);
}

fn render_main(frame: &mut Frame, _app: &App, area: Rect)
{
    let main = Block::default().title("Content").borders(Borders::ALL);
    frame.render_widget(main, area);
}

fn render_footer(frame: &mut Frame, _app: &App, area: Rect)
{
    let footer = Paragraph::new("Press 'q' to quit | Use 1-4 to switch tabs")
        .block(Block::default().borders(Borders::ALL));
    frame.render_widget(footer, area);
}
