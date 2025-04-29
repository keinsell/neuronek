# neuronek Knowledge

## Project Overview

- **neuronek** is a Rust-based CLI tool for recording, analyzing, and viewing ingestion events and related data on various substances and formulations.
- Uses SQLite as the embedded database—no need to run a separate database server.
- The main entrypoint is `src/main.rs`. All migrations are handled on startup.
- Most workflows are run interactively or through the command line—there are no servers or persistent background processes required for day-to-day development.

## Development Tips

- Standard dev workflow: build and run with `cargo run`, or test with `cargo test`.
- Database is auto-initialized/migrated at runtime if it does not exist.
- Migrations are located in `src/database/migrations`.

## Configuration

- No additional background processes are required for regular development.
- If adding server features in the future, update both this file and `codebuff.json` accordingly.

---
For any broad rules or recurring tips, update this file as you go!