use ratatui::prelude::*;
use ratatui::text::Line;
use ratatui::text::Span;
use ratatui::widgets::Axis;
use ratatui::widgets::Block;
use ratatui::widgets::Borders;
use ratatui::widgets::Chart;
use ratatui::widgets::Dataset;
use ratatui::widgets::GraphType;

pub mod theme
{
    use ratatui::style::Color;

    pub struct CatppuccinMocha;

    impl CatppuccinMocha
    {
        pub const ROSEWATER: Color = Color::Rgb(245, 224, 220);
        pub const FLAMINGO: Color = Color::Rgb(242, 205, 205);
        pub const PINK: Color = Color::Rgb(245, 194, 231);
        pub const MAUVE: Color = Color::Rgb(203, 166, 247);
        pub const RED: Color = Color::Rgb(243, 139, 168);
        pub const MAROON: Color = Color::Rgb(235, 160, 172);
        pub const PEACH: Color = Color::Rgb(250, 179, 135);
        pub const YELLOW: Color = Color::Rgb(249, 226, 175);
        pub const GREEN: Color = Color::Rgb(166, 227, 161);
        pub const TEAL: Color = Color::Rgb(148, 226, 213);
        pub const SKY: Color = Color::Rgb(137, 220, 235);
        pub const SAPPHIRE: Color = Color::Rgb(116, 199, 236);
        pub const BLUE: Color = Color::Rgb(137, 180, 250);
        pub const LAVENDER: Color = Color::Rgb(180, 190, 254);
        pub const TEXT: Color = Color::Rgb(205, 214, 244);
        pub const SUBTEXT1: Color = Color::Rgb(186, 194, 222);
        pub const SURFACE1: Color = Color::Rgb(69, 71, 90);
        pub const SURFACE0: Color = Color::Rgb(49, 50, 68);
        pub const BASE: Color = Color::Rgb(30, 30, 46);
        pub const MANTLE: Color = Color::Rgb(24, 24, 37);
        pub const CRUST: Color = Color::Rgb(17, 17, 27);

        pub const GRAPH_COLORS: [Color; 8] = [
            Self::BLUE,
            Self::MAUVE,
            Self::GREEN,
            Self::PEACH,
            Self::YELLOW,
            Self::SAPPHIRE,
            Self::LAVENDER,
            Self::TEAL,
        ];
    }
}

use theme::CatppuccinMocha as Theme;

pub fn render_chart(frame: &mut Frame, app: &super::App, area: Rect)
{
    let mut datasets: Vec<Dataset> = app
        .datasets
        .iter()
        .enumerate()
        .map(|(idx, (name, data))| {
            let dataset_name = format!("{}", name);
            Dataset::default()
                .name(dataset_name)
                .marker(symbols::Marker::Braille)
                .graph_type(GraphType::Line)
                .style(Style::default().fg(Theme::GRAPH_COLORS[idx % Theme::GRAPH_COLORS.len()]))
                .data(data)
        })
        .collect();

    datasets.push(
        Dataset::default()
            .name("Now")
            .marker(symbols::Marker::Braille)
            .graph_type(GraphType::Line)
            .style(Style::default().fg(Theme::TEXT))
            .data(&[(0.0, 0.0), (0.0, 100.0)]),
    );

    let x_min = -2.0;
    let x_max = 12.0;
    let x_step = 2.0;
    let x_labels: Vec<String> = (-1..=6)
        .map(|i| {
            let hours = i as f64 * x_step;
            if hours == 0.0
            {
                "now".to_string()
            }
            else if hours > 0.0
            {
                format!("+{}h", hours as i64)
            }
            else
            {
                format!("{}h", hours as i64)
            }
        })
        .collect();

    let legend = app
        .datasets
        .iter()
        .enumerate()
        .take(datasets.len() - 1)
        .flat_map(|(idx, (name, data))| {
            let color = Theme::GRAPH_COLORS[idx % Theme::GRAPH_COLORS.len()];

            let current_intensity = data
                .iter()
                .find(|(x, _)| x.abs() < 0.01)
                .map(|(_, y)| *y)
                .unwrap_or(0.0);

            let intensity_desc = match current_intensity as i32
            {
                | 0..=10 => "threshold",
                | 11..=30 => "mild",
                | 31..=50 => "moderate",
                | 51..=70 => "strong",
                | 71..=90 => "very strong",
                | _ => "extreme",
            };

            vec![
                Span::styled("■ ", Style::default().fg(color)),
                Span::styled(
                    format!("{} ({}: {:.0}%)", name, intensity_desc, current_intensity),
                    Style::default().fg(color),
                ),
                Span::raw("  "),
            ]
        })
        .collect::<Vec<_>>();

    let mut title_spans = vec![
        Span::styled(
            "Substance Intensity Profile (smoothed curves)",
            Style::default().fg(Theme::MAUVE).bold(),
        ),
        Span::raw(" | "),
    ];
    title_spans.extend(legend);
    let title = Line::from(title_spans);

    let chart = Chart::new(datasets)
        .block(
            Block::default()
                .title(title)
                .borders(Borders::ALL)
                .border_style(Style::default().fg(Theme::SURFACE1))
                .style(Style::default().bg(Theme::BASE)),
        )
        .x_axis(
            Axis::default()
                .title(Span::styled("Time", Style::default().fg(Theme::SUBTEXT1)))
                .style(Style::default().fg(Theme::SURFACE1))
                .bounds([x_min, x_max])
                .labels(x_labels.iter().map(String::as_str).collect::<Vec<_>>()),
        )
        .y_axis(
            Axis::default()
                .title(Span::styled(
                    "Relative Intensity (%)",
                    Style::default().fg(Theme::SUBTEXT1),
                ))
                .style(Style::default().fg(Theme::SURFACE1))
                .bounds([0.0, 100.0])
                .labels(vec!["0%", "25%", "50%", "75%", "100%"]),
        )
        .style(Style::default().bg(Theme::BASE));

    frame.render_widget(chart, area);
}
