# Technical Specification

## System Overview
The system is designed to manage and process ingestion data related to substances, including their routes of administration, dosages, and phases. The primary purpose is to provide a comprehensive framework for ingesting, analyzing, and visualizing substance-related data. The system comprises several main components:
- **Frontend Components**: Text User Interface (TUI) for user interaction.
- **Backend Services**: Rust-based services handling data ingestion, analysis, and storage.
- **Databases**: SQL database for storing ingestion and substance data.
- **External APIs**: None directly integrated, but the system is designed to be extensible for future API integrations.

## Core Functionality
### Data Ingestion
- **Ingestion Module**: Located in `src/ingestion`, this module handles the ingestion of substance data. Key files include:
  - `src/ingestion/command.rs`: Defines commands for ingesting data.
  - `src/ingestion/model.rs`: Models the data structures for ingestion.
  - `src/ingestion/service.rs`: Provides services for ingesting data into the system.
- **Ingestion Phases**: Managed in `src/ingestion/phase`, this sub-module deals with different phases of ingestion:
  - `src/ingestion/phase/model.rs`: Models the phases of ingestion.

### Substance Management
- **Substance Module**: Located in `src/substance`, this module manages substance-related data:
  - `src/substance/mod.rs`: Main module file.
  - `src/substance/repository.rs`: Repository pattern for accessing substance data.
  - `src/substance/route_of_administration`: Sub-module handling routes of administration:
    - `src/substance/route_of_administration/dosage.rs`: Manages dosage-related data.
    - `src/substance/route_of_administration/phase.rs`: Manages phases related to routes of administration.

### CLI Tools
- **CLI Module**: Located in `src/cli`, this module provides command-line interface tools for interacting with the system:
  - `src/cli/formatter.rs`: Formats CLI output.
  - `src/cli/ingestion.rs`: Handles CLI commands related to ingestion.
  - `src/cli/parser.rs`: Parses CLI arguments.

### Database Management
- **Database Module**: Located in `src/database`, this module handles database interactions:
  - `src/database/migrator.rs`: Manages database migrations.
  - `src/database/schema.sql`: Defines the database schema.
  - Migration files in `src/database/migrations`: Specific migration scripts for schema changes.

### Core Utilities
- **Core Module**: Located in `src/core`, this module provides essential utilities:
  - `src/core/config.rs`: Manages configuration settings.
  - `src/core/error_handling.rs`: Handles error management.
  - `src/core/logging.rs`: Provides logging functionality.

### Text User Interface (TUI)
- **TUI Module**: Located in `src/tui`, this module provides a text-based user interface:
  - `src/tui/app.rs`: Main application logic for TUI.
  - `src/tui/ui.rs`: Defines the UI components.

## Architecture
The system follows a modular architecture where each component is responsible for a specific aspect of the functionality. Data flows from the CLI or TUI into the ingestion module, where it is processed and stored in the database. The core module provides utilities like configuration, error handling, and logging that are used across the system. The database module ensures data persistence and integrity through well-defined migrations and schema definitions.

### Data Flow
1. **Ingestion**: Data is ingested via CLI commands defined in `src/cli/ingestion.rs`.
2. **Processing**: The ingestion data is processed by services in `src/ingestion/service.rs`.
3. **Storage**: Processed data is stored in the database, managed by `src/database/migrator.rs`.
4. **Retrieval and Display**: Data can be retrieved and displayed via the TUI, defined in `src/tui/app.rs` and `src/tui/ui.rs`.