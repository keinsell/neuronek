# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Building and Development
```bash
# Build the project
just build
# or directly with cargo
cargo build

# Run the application
just run [args]
# or
cargo run -- [args]

# Watch for changes during development
just watch
```

### Testing
```bash
# Run tests using nextest
just test
# or
cargo nextest r
```

### Code Quality
```bash
# Run all linting checks
just lint

# Format code
just format

# Fix code issues automatically
just fix

# Check code without building
just check
```

## Architecture Overview

Neuronek is a Rust CLI application for tracking supplement and psychoactive substance ingestion. The codebase follows a modular architecture:

### Core Modules

- **`src/main.rs`**: Entry point handling CLI parsing and command routing
- **`src/cli/`**: Command-line interface definitions using clap v4
- **`src/database/`**: Sea-ORM based SQLite database layer with migrations
- **`src/ingestion/`**: Core ingestion tracking functionality (log, view, list, update, delete)
- **`src/substance/`**: Substance database and information management
- **`src/application/`**: Application session and lifecycle management

### Key Technologies

- **Database**: Sea-ORM with SQLite, migrations in `src/database/migrations/`
- **CLI Framework**: Clap v4 with derive macros
- **Async Runtime**: async-std
- **Error Handling**: miette for diagnostic errors
- **Serialization**: serde with JSON support

### Important Configuration

- Uses Rust nightly toolchain (see `rust-toolchain.toml`)
- Cranelift codegen backend enabled for faster debug builds
- Python tooling available for Jupyter notebooks in `analysis/`

### Database Schema

The application uses a complex relational schema including:
- `ingestion`: Core tracking records
- `substance`: Pre-populated psychoactive substance database
- `ingestion_phase`: Pharmacokinetic phase tracking
- `formulation`: Custom compound formulations
- Supporting junction tables for many-to-many relationships

When modifying database models, ensure to:
1. Update the Sea-ORM entities in `src/database/entities/`
2. Create appropriate migrations in `src/database/migrations/`
3. Run migrations before testing changes

## CLI Command Structure

### Main Commands

- **`neuronek ingestion`**: Core ingestion tracking commands
  - `log`: Log a new substance ingestion with dosage
  - `view <id>`: View detailed information about a specific ingestion
  - `list`: List all ingestions with basic information
  - `update <id>`: Update an existing ingestion's dosage
  - `delete <id>`: Remove an ingestion record
  - `analyze`: Analyze ingestion with phase calculations

- **`neuronek substance`**: Query substance database
  - `get <name>`: Get detailed substance information including routes and dosages
  - `--list-names`: List all available substance names (used for shell completions)

- **`neuronek completion <shell>`**: Generate shell completion scripts
  - Supports: bash, zsh, fish, powershell, elvish, nushell

### Display Formats

- **`--format pretty`** (default): Human-readable tables and formatted output
- **`--format json`**: Machine-readable JSON output

## Code Patterns and Conventions

### Error Handling
- Uses `miette` for diagnostic error reporting
- Custom `Exception` enum for domain-specific errors
- All async functions return `miette::Result<T>`

### Database Access
- Global `DATABASE_CONNECTION` static reference
- Sea-ORM entities in `src/database/entities/`
- Migrations use SQL files with atlas schema tracking

### CLI Implementation
- Commands implement `Executable` trait with async execute method
- Display formatting via `Displayable` trait
- Custom shell completions in `src/cli/custom_completions.rs`

### Ingestion Analysis
The analyzer calculates pharmacokinetic phases based on:
- Substance route of administration data
- Dosage classification (threshold, light, common, strong, heavy)
- Phase duration ranges from substance database
- Phase weight calculations based on dosage

### Configuration
- Database location varies by environment:
  - Test/Debug: `:memory:` or temp directory
  - Production: `~/.local/share/neuronek/journal.db`
- Configuration managed via `lazy_static` globals

### Testing
- Integration tests in `tests/` directory
- Test files use `.t.md` extension for markdown-based testing
- Tests use in-memory database via `NEURONEK_TEST` env var

## Development Workflow

1. **Adding New Features**:
   - Update CLI command structure in `src/cli/`
   - Implement business logic in appropriate module
   - Add database entities/migrations if needed
   - Update shell completions if adding new commands

2. **Database Changes**:
   - Create migration in `src/database/migrations/`
   - Update Sea-ORM entities
   - Run `just build` to ensure compilation
   - Test with in-memory database first

3. **UI/Display Updates**:
   - Use `Displayable` trait for consistent formatting
   - Support both pretty and JSON output formats
   - Use theme colors from `src/ui/theme.rs`

## Data Models and Domain Logic

### Ingestion Model
- Core tracking entity with fields: id, substance_name, dosage, route, ingestion_date
- Associated with `IngestionPhase` records for pharmacokinetic tracking
- Supports analysis to calculate phase timings based on substance data
- Custom types: `SubstanceName` (sanitized/validated string), `Dosage` (Mass wrapper)

### Substance System
- Pre-populated database from PsychonautWiki data
- Hierarchical structure: Substance → Routes → Dosages/Phases
- Route classifications: oral, sublingual, insufflated, etc.
- Dosage classifications: threshold, light, common, strong, heavy
- Phase classifications: onset, comeup, peak, comedown, afterglow

### Formulation Feature
- Custom compound definitions with multiple ingredients
- Each formulation has: name, summary, labeller, form, route
- Ingredient tracking via junction table with dosages
- Currently not fully integrated into CLI commands

### Application Architecture
- Phased execution model: Startup → Analyze → Execute → Shutdown
- `ApplicationSession` trait for extensible session handling
- Global database connection via `lazy_static`
- Support for parallel task execution in Execute phase

## Advanced Features

### Ingestion Analysis
- Calculates pharmacokinetic phases with uncertainty ranges
- Phase weight calculations based on dosage intensity
- Duration estimates with min/max bounds
- Visual timeline representation in pretty output

### Custom Shell Completions
- Dynamic substance name completion from database
- Context-aware command completions
- Support for all major shells (bash, zsh, fish, etc.)

### Display System
- `Displayable` trait for consistent formatting
- Pretty tables using `comfy-table` and `tabled`
- JSON serialization for all display types
- Theme system with ANSI color support
- Markdown rendering via `termimad`

### Type Safety
- `nutype` for validated domain types (SubstanceName, IngestionProgress)
- Custom parsing implementations for CLI arguments
- Measurement units via `measurements` crate
- Comprehensive error types with `miette` diagnostics

## Release and Deployment

### Versioning
- Uses cargo-release with alpha/beta/rc support
- Version format: `0.0.1-alpha.X`
- Consolidated commits and automatic tagging

### Build Profiles
- Debug: Uses Cranelift backend for faster compilation
- Release: Full optimizations with LTO and stripping
- Platform-specific profiles (wasm, android, server)

### Distribution
- Windows installer via WiX toolset
- Pre-built binaries for GitHub releases
- Future plans for package managers (homebrew, apt, etc.)

## Development Tips

### Working with Phases
When implementing new features involving substance effects:
1. Check existing phase data in substance database
2. Use the analyzer to calculate timings
3. Consider uncertainty ranges in calculations
4. Display both start/end times with uncertainties

### Database Migrations
- Use atlas for schema management
- SQL migrations in `src/database/migrations/`
- Always update Sea-ORM entities after schema changes
- Test with both in-memory and file databases

### CLI Command Patterns
- Commands should implement `Executable` trait
- Use `bon::Builder` for complex argument structures
- Support both pretty and JSON output formats
- Add shell completion support for new commands

### Testing Strategies
- Integration tests use markdown format (`.t.md`)
- Set `NEURONEK_TEST` env var for test database
- Use `assert_cmd` for CLI testing
- Mock substance data for predictable tests

## Implementation Details

### Service Layer Pattern
The ingestion service (`src/ingestion/service.rs`) implements:
- `log_ingestion`: Creates ingestion with automatic phase calculation
- `get_ingestion`: Retrieves single ingestion with associated phases
- `list_ingestion`: Fetches multiple ingestions with eager phase loading
- Automatic UUID generation for phase records
- Transaction-like behavior with phase creation after ingestion

### Database Connection Management
- Global `DATABASE_CONNECTION` using `LazyLock` for thread-safe initialization
- Automatic database file creation if missing
- Migration runs on connection establishment
- Support for both file-based and in-memory databases
- Connection string format: `sqlite:///path/to/db` or `sqlite::memory:`

### Phase Calculation System
Phase weight calculation uses:
- Dosage factor: `ingestion_dosage / common_dosage`
- Phase intensity factors: Peak=1.0, Comeup=0.5, Comedown=0.3, etc.
- Weight formula: `dosage_factor * phase_factor`
- Stored as `Decimal` for precision

### Shell Completion Architecture
Dynamic completions implemented via:
- Base completion generation with `clap_complete`
- Custom functions appended for substance name lookup
- Shell-specific implementations (bash, zsh, fish)
- Runtime substance list via `--list-names` flag
- Completion hooks for specific argument positions

### Command Aliases and Parsing
- Extensive command aliases for user convenience
- Custom value parsers for complex types:
  - `DateTime<Local>`: Supports natural language ("yesterday 3pm")
  - `Dosage`: Parses measurement strings ("100mg", "2.5g")
  - `RouteOfAdministration`: Enum-based validation
- Default values with context awareness

### Display Formatting
Pretty output features:
- Two-pane layout for ingestion details
- Phase timeline with uncertainty indicators (±5m, ±1.2h)
- Icon representation for phase types
- Table generation with `comfy-table` and `tabled`
- Markdown support via `termimad`

### Error Handling Patterns
- `miette::Result<T>` for all public APIs
- Custom `Exception` enum for domain errors
- Diagnostic hints in error messages
- Graceful degradation for missing data
- Interactive confirmation for destructive operations

## Key Dependencies and Their Usage

### Core Dependencies
- **sea-orm**: ORM with async support, migration system
- **clap**: CLI parsing with derive macros, completion generation
- **chrono**: Date/time handling with timezone support
- **serde**: JSON serialization for all data types
- **miette**: Rich error diagnostics with source tracking

### Data Processing
- **measurements**: Type-safe unit conversions (Mass, etc.)
- **rust_decimal**: Precise decimal arithmetic for weights
- **nutype**: Validated newtypes with sanitization
- **iso8601-duration**: ISO duration parsing for phases

### UI/Display
- **comfy-table/tabled**: Table formatting with Unicode borders
- **termimad**: Markdown rendering in terminal
- **owo-colors**: ANSI color styling
- **indicatif**: Progress indicators for migrations

### Utilities
- **lazy_static/once_cell**: Global state management
- **uuid**: Unique ID generation for phase records
- **itertools**: Collection manipulation helpers
- **dialoguer**: Interactive prompts for confirmations

## Testing Approach

### Test Database Strategy
- Uses in-memory SQLite for tests
- `NEURONEK_TEST` env var triggers test mode
- Automatic migration on test startup
- Isolated test instances prevent conflicts

### Integration Test Structure
- Markdown-based test files (`.t.md`)
- Command simulation with `assert_cmd`
- Output validation with `predicates`
- Example test patterns in `tests/` directory

### Test Data Patterns
- Minimal fixture data for predictability
- Test-specific substance entries
- Normalized string comparisons (lowercase)
- Timestamp handling for reproducibility