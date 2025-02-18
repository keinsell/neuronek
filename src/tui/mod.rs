#![allow(dead_code)] // TUI module is work in progress
use std::io::Stdout;
use std::io::stdout;
use std::time::Duration;
use std::time::Instant;

use crossterm::event::DisableBracketedPaste;
use crossterm::event::DisableMouseCapture;
use crossterm::event::EnableBracketedPaste;
use crossterm::event::EnableMouseCapture;
use crossterm::event::Event;
use crossterm::event::KeyCode;
use crossterm::event::KeyEventKind;
use crossterm::event::{self};
use crossterm::execute;
use crossterm::terminal::*;
use miette::IntoDiagnostic;
use ratatui::prelude::*;

mod app;
mod ui;

use app::App;

pub type Tui = Terminal<CrosstermBackend<Stdout>>;

pub fn init() -> miette::Result<Tui>
{
    enable_raw_mode().into_diagnostic()?;
    execute!(stdout(), EnterAlternateScreen).into_diagnostic()?;
    execute!(stdout(), EnableMouseCapture).into_diagnostic()?;
    execute!(stdout(), EnableBracketedPaste).into_diagnostic()?;
    let mut terminal = Terminal::new(CrosstermBackend::new(stdout())).into_diagnostic()?;
    terminal.clear().into_diagnostic()?;
    terminal.hide_cursor().into_diagnostic()?;
    Ok(terminal)
}

pub fn restore() -> miette::Result<()>
{
    execute!(stdout(), DisableBracketedPaste).into_diagnostic()?;
    execute!(stdout(), DisableMouseCapture).into_diagnostic()?;
    execute!(stdout(), LeaveAlternateScreen).into_diagnostic()?;
    disable_raw_mode().into_diagnostic()?;
    Ok(())
}

pub fn run() -> miette::Result<()>
{
    let mut terminal = init()?;
    let mut app = App::new();
    let tick_rate = Duration::from_millis(250);
    let mut last_tick = Instant::now();

    while app.running
    {
        terminal
            .draw(|frame| ui::render(frame, &app))
            .into_diagnostic()?;

        let timeout = tick_rate
            .checked_sub(last_tick.elapsed())
            .unwrap_or_else(|| Duration::from_secs(0));

        if event::poll(timeout).into_diagnostic()?
        {
            if let Event::Key(key) = event::read().into_diagnostic()?
            {
                if key.kind == KeyEventKind::Press
                {
                    match key.code
                    {
                        | KeyCode::Char(c) => app.on_key(c),
                        | KeyCode::Esc => app.quit(),
                        | _ =>
                        {}
                    }
                }
            }
        }

        if last_tick.elapsed() >= tick_rate
        {
            app.tick();
            last_tick = Instant::now();
        }
    }

    restore()?;
    Ok(())
}
