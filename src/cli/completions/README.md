# Shell Completions Module

This module implements a cache-based shell completion system for command-line interface that provides dynamic autocompletion for substance names and routes of administration across multiple shells (Bash, Zsh, Fish).

## Architecture

The implementation follows a cache-based approach with the following components:

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ Shell Tab Press │────▶│ Completion Script│────▶│ Cache File   │
└─────────────────┘     └──────────────────┘     │ ~/.cache/    │
                                  │                 │ neuronek/    │
                                  │                 │ completions/ │
                                  ▼                 └──────────────┘
                          ┌──────────────────┐              ▲
                          │ neuronek         │              │
                          │ completion cache │──────────────┘
                          │ get-cached       │
                          └──────────────────┘
                                  │
                                  ▼
                          ┌──────────────────┐
                          │    Database      │
                          └──────────────────┘
```

## Implementation Details

### 1. CLI Command Structure

The completion system extends the existing CLI with new subcommands:

```
neuronek completion
├── generate <shell>      # Generate completion script
└── cache
    ├── refresh-cache    # Refresh all completion caches
    └── get-cached <type> # Get cached values for completion
```

## Shell Integration Details

### Bash Integration

The generated Bash completion script includes:

- `_neuronek_substance_names()` - Fetches substance names with auto-refresh
- `_neuronek_route_names()` - Fetches route names
- Context-aware completion for `--substance` and `--roa` arguments
- Background cache refresh mechanism

### Zsh Integration

- Native `_describe` integration for better completion UX
- Automatic cache staleness detection
- Clean integration with Zsh's completion system

### Fish Integration

- Custom functions `__neuronek_substance_names` and `__neuronek_route_names`
- Automatic cache refresh checking
- Native Fish completion syntax

## Module Structure

```
src/cli/
├── completions/           # Main completion module
│   ├── mod.rs            # Module exports and public API
│   ├── cache.rs          # Cache implementation and management
│   ├── shell.rs          # Shell-specific completion generators
│   └── README.md         # This documentation
└── mod.rs                # CLI command definitions

~/.cache/neuronek/completions/
├── substances            # Cached substance names
└── routes               # Cached route names
```
