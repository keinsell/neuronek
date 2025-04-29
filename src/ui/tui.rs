use color_eyre::eyre::Result;
use crossterm::event::{self, Event, KeyEvent, KeyCode};
use ratatui::{Frame, Terminal};
use ratatui::backend::CrosstermBackend;
use ratatui::widgets::{Block, Borders, Paragraph};
use ratatui::layout::{Layout, Constraint, Direction};
use std::io::stdout;

/// AppState represents the main state for the TUI menus.
pub struct AppState {
    pub menu: Menu,
}

pub enum Menu {
    Root,
    Ingestions,
}

impl Default for AppState {
    fn default() -> Self {
        Self { menu: Menu::Root }
    }
}

/// Show the Ratatui-based TUI interactive menu.
pub fn run_tui() -> Result<()> {
    let mut terminal = Terminal::new(CrosstermBackend::new(stdout()))?;
    terminal.clear()?;

    let mut state = AppState::default();

    loop {
        terminal.draw(|frame| render(frame, &state))?;

        if let Event::Key(KeyEvent { code, .. }) = event::read()? {
            match state.menu {
                Menu::Root => match code {
                    KeyCode::Char('q') => break,
                    KeyCode::Char('1') => state.menu = Menu::Ingestions,
                    _ => {}
                },
                Menu::Ingestions => match code {
                    KeyCode::Char('q') => break,
                    KeyCode::Esc => state.menu = Menu::Root,
                    _ => {}
                },
            }
        }
    }

    // Restore terminal
    terminal.clear()?;
    Ok(())
}

/// Handles drawing the TUI based on app state.
fn render(frame: &mut Frame, state: &AppState) {
    let area = frame.size();

    match state.menu {
        Menu::Root => {
            let block = Block::default()
                .title("neuronek ▸ main menu")
                .borders(Borders::ALL);

            let paragraph = Paragraph::new("1. Ingestions\nq. Quit")
                .block(block);

            frame.render_widget(paragraph, area);
        }
        Menu::Ingestions => {
            let block = Block::default()
                .title("neuronek ▸ ingestions")
                .borders(Borders::ALL);

            let paragraph = Paragraph::new("TODO: List, Create, View, Update, Analyze\nESC to go back, q to Quit")
                .block(block);

            frame.render_widget(paragraph, area);
        }
    }
}