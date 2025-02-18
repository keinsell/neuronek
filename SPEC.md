# Technical Specification

## System Overview
The system is a Rust-based intelligent dosage tracker application designed to log and analyze substance ingestions over time. The primary purpose is to provide users with a tool to track their substance intake, analyze patterns, and visualize data through a terminal user interface (TUI). The main components include a command-line interface (CLI) for user interaction, a database for storing ingestion data, and a TUI for data visualization.

### Main Components and Their Roles
- **CLI**: Handled by `clap` and defined in `src/cli/mod.rs`. It allows users to interact with the application through commands like logging ingestions, viewing journals, and managing substances.
- **Database**: Managed by `sea-orm` and defined in `src/database/mod.rs`. It stores ingestion data, substance information, and related entities.
- **Ingestion Logging**: Core functionality for logging ingestions is implemented in `src/ingestion/command.rs` and `src/ingestion/service.rs`.
- **Configuration**: Managed in `src/core/config.rs`.
- **Error Handling and Logging**: Configured in `src/core/error_handling.rs` and `src/core/logging.rs`.
- **CI/CD**: Defined in `.github/workflows/main.yaml`.
- **Build System**: Configured using `justfile` and `flake.nix`.
- **Dependency Management**: Configured using `deny.toml`.

## Core Functionality
### Primary Features and Their Implementation
1. **CLI Handling**
   - **File**: `src/cli/mod.rs`
   - **Description**: Defines `ApplicationCommands` enum for CLI subcommands and implements `CommandHandler` trait for handling CLI commands.
   - **Core Functions**: 
     - `handle_command`: Executes the appropriate command based on user input.

2. **Database Operations**
   - **File**: `src/database/mod.rs`
   - **Description**: Manages database connections and migrations. Re-exports entities and migrator.
   - **Core Functions**: 
     - `migrations`: Returns a list of migrations (defined in `src/database/migrator.rs`).

3. **Ingestion Logging**
   - **File**: `src/ingestion/command.rs` and `src/ingestion/service.rs`
   - **Description**: Core functionality for logging new ingestions and retrieving ingestion data.
   - **Core Functions**: 
     - `log`: Logs a new ingestion (defined in `src/ingestion/service.rs`).
     - `get_ingestion_intensity_over_time`: Retrieves ingestion intensity data over time (defined in `src/ingestion/service.rs`).

4. **Configuration Management**
   - **File**: `src/core/config.rs`
   - **Description**: Defines configuration paths and the `Config` struct for application configuration.
   - **Core Functions**: 
     - None directly, but critical for setting up application configuration.

5. **Error Handling and Logging**
   - **File**: `src/core/error_handling.rs` and `src/core/logging.rs`
   - **Description**: Sets up diagnostic panic hooks and application logger.
   - **Core Functions**: 
     - `setup_diagnostics`: Sets up diagnostic panic hooks (defined in `src/core/error_handling.rs`).
     - `setup_logger`: Sets up the application logger (defined in `src/core/logging.rs`).

### Complex Algorithms and Business Logic
- **Ingestion Intensity Calculation**: 
  - Calculates the intensity of substance ingestions over time, used for visualization in the TUI.
  - Implemented in `src/ingestion/service.rs`.

## Architecture
### System Structure and Component Interaction
The system is structured into several key modules, each responsible for specific functionality:
- **CLI Module**: Handles user commands and interactions.
- **Database Module**: Manages database connections, migrations, and entity definitions.
- **Ingestion Module**: Logs and retrieves ingestion data.
- **Core Module**: Manages configuration, error handling, and logging.
- **TUI Module**: Provides a terminal-based user interface for data visualization.

### Data Flow
1. **Input**: User inputs commands via the CLI.
2. **Processing**: 
   - CLI parses commands using `clap`.
   - Commands are handled by appropriate modules (e.g., `src/ingestion/command.rs` for logging ingestions).
   - Database operations are performed using `sea-orm`.
3. **Storage**: Ingestion data is stored in the database.
4. **Output**: 
   - Data is retrieved from the database and displayed in the TUI using `ratatui`.
   - Error messages and logs are handled by the core module.

## Time-Series Data Generation
A helper in `IngestionPhase` computes discrete intensity points, which `Ingestion` aggregates into a unified time-series.