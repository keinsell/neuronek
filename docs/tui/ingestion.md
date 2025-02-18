# Ingestion Terminal User Interface

## List View


The ingestion list view displays a table of all ingestions with the following columns:

### Columns

1. **ID**: Unique identifier for each ingestion
2. **Substance**: Name of the substance
3. **ROA**: Route of administration
4. **Dosage**: Shows both the numerical value and visual classification
   - Format: `"100 mg ●●●○○"`
   - Filled circles (●) indicate dosage level
   - Empty circles (○) indicate remaining levels
   - More filled circles = higher dosage classification
   - Classification is based on substance-specific dosage ranges

5. **Phase**: Shows both the current phase and progress
   - Phase names: Onset, Comeup, Peak, Comedown, Afterglow
   - Progress bar shows total progress through phases:
     ```
     Onset:     ▰▱▱▱▱ (20% through total duration)
     Comeup:    ▰▰▱▱▱ (40% through total duration)
     Peak:      ▰▰▰▱▱ (60% through total duration)
     Comedown:  ▰▰▰▰▱ (80% through total duration)
     Afterglow: ▰▰▰▰▰ (100% through total duration)
     ```
   - Color coding:
     - Onset: Blue
     - Comeup: Green
     - Peak: Red
     - Comedown: Yellow
     - Afterglow: Light gray
     - Unknown/Completed: Dark gray
   - Progress updates in real-time based on ingestion time and phase durations

6. **Time**: Human-readable time since ingestion (e.g., "2 hours ago")

### Visual States

- **Completed Ingestions**: 
  - Entire row appears dimmed in gray
  - Shows "Completed" in the phase column
  - Progress bar shows all filled blocks (▰▰▰▰▰)
  - Indicates the ingestion has passed through all phases

- **Active Ingestions**:
  - Normal brightness
  - Shows current phase with color-coded progress
  - Progress bar updates in real-time
  - Reflects the current state of the ingestion

- **Selected Row**:
  - Highlighted with dark gray background
  - Bold text
  - Indicates the currently focused ingestion

### Navigation & Controls

- **Keyboard Controls**:
  - `↑/k`: Move selection up
  - `↓/j`: Move selection down
  - `Enter`: View detailed information about selected ingestion
  - `n`: Create new ingestion
  - `q`: Return to previous screen
  - `r`: Refresh ingestion list

- **Selection**:
  - Use arrow keys or vim-style navigation (j/k)
  - Selected ingestion is highlighted
  - Selection wraps around at list boundaries
  - Used for viewing details or performing actions

### Empty State

When no ingestions are present, the view shows:
- "No ingestions found" in gray
- "Press 'n' to create a new ingestion" in dark gray
- Both messages are center-aligned
- Provides clear instruction for adding first ingestion

### Auto-Updates

- List refreshes automatically to show:
  - Real-time phase progression
  - Updated time since ingestion
  - Phase transitions
  - Completion status changes