Brainstorm and research potential ways to display given information in CLI environment in pretty way that would be
user-friendly and strightforward in terms of reading information, it's also important you should take attention to look
and styling so interface would not be so boring.

#[derive(Debug, Serialize, Tabled, bon::Builder)]
struct IngestionViewModel
{
#[tabled(rename = "ID")]
pub id: i32,
#[tabled(rename = "Substance")]
pub substance_name: String,
#[tabled(rename = "ROA")]
pub route: String,
#[tabled(rename = "Dosage")]
pub dosage: String,
#[tabled(rename = "Ingestion Date")]
#[tabled(display_with = "display_date")]
pub ingested_at: DateTime<Local>,
#[tabled(rename = "Dosage Classification")]
pub dosage_classification: String,
#[tabled(skip)]
pub phases: Vec<Phase>,
}

#[derive(Debug, Serialize, bon::Builder, Clone)]
struct Phase
{
pub classification: PhaseClassification,
pub start_time: DateRange,
pub end_time: DateRange,
pub duration: DurationRange,
}
#[derive(Debug, Serialize, bon::Builder, Clone)]
pub struct DateRange
{
min: DateTime<Local>,
max: DateTime<Local>,
}
#[derive(Debug, Serialize, bon::Builder, Clone)]
pub struct DurationRange
{
start: Duration,
end: Duration,
}

impl Formatter for IngestionViewModel
{
fn pretty(&self) -> String
{
let skin = MadSkin::default();
let mut md = String::new();

        md.push_str(&format!("# Ingestion #{}\n\n", self.id));
        md.push_str(&format!("**Substance**: {}\n", self.substance_name));
        md.push_str(&format!("**Route**: {}\n", self.route));
        md.push_str(&format!(
            "**Dosage**: {} _{}_\n",
            self.dosage,
            if self.dosage_classification != "n/a"
            {
                format!("({})", self.dosage_classification)
            }
            else
            {
                String::new()
            }
        ));

        let time_since = HumanTime::from(self.ingested_at);

        md.push_str(&format!(
            "**Ingested**: {} _{}_\n\n",
            self.ingested_at.format("%Y-%m-%d %H:%M:%S"),
            time_since
        ));

        skin.text(&md, None).to_string()
    }

}

impl From<Model> for IngestionViewModel
{
fn from(model: Model) -> Self
{
let dosage = Dosage::from_base_units(model.dosage.into());
let route_enum: RouteOfAdministrationClassification =
model.route_of_administration.parse().unwrap_or_default();
let local_ingestion_date = Local::from_utc_datetime(&Local, &model.ingested_at);

        Self::builder()
            .id(model.id)
            .substance_name(model.substance_name)
            .route(RouteOfAdministrationClassification::to_string(&route_enum))
            .dosage(dosage.to_string())
            .ingested_at(local_ingestion_date)
            .dosage_classification(
                model
                    .dosage_classification
                    .map_or("n/a".to_string(), |c| c.to_string()),
            )
            .phases(vec![])
            .build()
    }

}

impl From<crate::ingestion::model::Ingestion> for IngestionViewModel
{
fn from(model: crate::ingestion::model::Ingestion) -> Self
{
let dosage = model.dosage;
let route_enum = model.route;

        let phases = model
            .phases
            .into_iter()
            .map(|phase| {
                Phase::builder()
                    .classification(phase.class)
                    .start_time(
                        DateRange::builder()
                            .min(phase.start_time.start)
                            .max(phase.start_time.end)
                            .build(),
                    )
                    .end_time(
                        DateRange::builder()
                            .min(phase.end_time.start)
                            .max(phase.end_time.end)
                            .build(),
                    )
                    .duration(
                        DurationRange::builder()
                            .start(phase.duration.start)
                            .end(phase.duration.end)
                            .build(),
                    )
                    .build()
            })
            .collect::<Vec<_>>();

        Self::builder()
            .id(model.id.unwrap_or(0))
            .substance_name(model.substance_name)
            .route(RouteOfAdministrationClassification::to_string(&route_enum))
            .dosage(dosage.to_string())
            .ingested_at(model.ingestion_date)
            .dosage_classification(
                model
                    .dosage_classification
                    .map_or("n/a".to_string(), |c| c.to_string()),
            )
            .phases(phases)
            .build()
    }

}

Certainly! Here are some ideas and approaches to display your ingestion information in a CLI environment in a
user-friendly and visually appealing way:

---

### **1. Color-Coded Output**

Utilize colors to highlight important information, making it easier to read and more engaging.

- **ANSI Escape Codes**: Use ANSI codes to add colors, boldness, or underlines.
  ```rust
  println!("\x1b[1;32mSubstance\x1b[0m: {}", self.substance_name);
  ```
- **Semantic Coloring**: Assign specific colors to different classifications.
    - **Dosage Levels**: Green for low, yellow for medium, red for high dosage.
    - **Phase Status**: Different colors for each phase (onset, peak, comedown).

### **2. Structured Formatting with Tables**

Present data in neatly formatted tables for better readability.

- **ASCII Tables**: Use crates like [`tabled`](https://crates.io/crates/tabled) or [
  `prettytable-rs`](https://crates.io/crates/prettytable-rs).

  ```plaintext
  +------------------+---------------------------+
  | ID               | 123                       |
  +------------------+---------------------------+
  | Substance        | LSD                       |
  +------------------+---------------------------+
  | Route            | Oral                      |
  +------------------+---------------------------+
  | Dosage           | 100 μg (Medium)           |
  +------------------+---------------------------+
  | Ingestion Date   | 2023-10-05 14:30:00       |
  +------------------+---------------------------+
  ```

- **Alignment and Padding**: Ensure text is properly aligned and spaced.

### **3. Enhanced Markdown Rendering**

Since you're already using `MadSkin` for Markdown rendering, you can leverage it further.

- **Headers and Emphasis**: Use Markdown syntax for headings and emphasis.
  ```markdown
  # Ingestion #123

  **Substance**: LSD
  **Route**: Oral
  **Dosage**: 100 μg *(Medium)*
  **Ingested At**: 2023-10-05 14:30:00 *(2 hours ago)*
  ```
- **Lists and Bullet Points**: Organize phases or effects.
  ```markdown
  ## Phases
  - **Onset**: 15 mins after ingestion
  - **Peak**: 2 hours duration
  - **Comedown**: 1 hour duration
  ```

### **4. Visual Timelines and Progress Bars**

Represent durations and phases visually.

- **ASCII Timelines**:
  ```plaintext
  Ingestion Timeline:
  [Onset   ]--------[Peak     ]-----------------[Comedown ]
       0min       15min      2h15min           3h15min
  ```
- **Progress Bars**: Use crates like [`indicatif`](https://crates.io/crates/indicatif) for progress bars.

### **5. Interactive Elements**

Make use of interactive CLI features to enhance user experience.

- **Menu Selection**: Use crates like [`inquire`](https://crates.io/crates/inquire) or [
  `dialoguer`](https://crates.io/crates/dialoguer).
  ```plaintext
  Select an ingestion record:
  > Ingestion #123 - LSD
    Ingestion #122 - MDMA
    Ingestion #121 - Cannabis
  ```
- **Search and Filter**: Allow users to search or filter records.

### **6. ASCII Art and Icons**

Incorporate simple ASCII art or symbols to add personality.

- **Phase Indicators**:
  ```plaintext
  Phases:
  🌅 Onset
  🚀 Peak
  🌄 Comedown
  ```
- **Symbols for Classifications**: Use symbols to represent dosage levels or warnings.

### **7. Thematic Styling**

Apply consistent themes to your CLI output.

- **Dark and Light Modes**: Provide options for different color schemes.
- **Custom Skins**: Allow users to select from predefined skins that change the look and feel.

### **8. Data Grouping and Sections**

Organize information into clear, distinct sections.

- **Headers and Separators**:
  ```plaintext
  ==============================
        Ingestion Details
  ==============================
  ```
- **Whitespace Usage**: Use spacing to separate different pieces of information.

### **9. Conditional Formatting**

Change the appearance of text based on its value.

- **Warnings**: Highlight critical information.
  ```plaintext
  ⚠️  Dosage Classification: High
  ```
- **Color Coding Based on Values**: For example, red text for high dosages.

### **10. User Customization**

Let users tailor the interface to their preferences.

- **Configuration Files**: Read settings from a config file.
- **Command-Line Options**: Provide flags to adjust verbosity or output style.

  ```plaintext
  $ ingestion_viewer --theme dark --verbose
  ```

### **11. Accessibility Considerations**

Ensure your interface is usable by everyone.

- **High Contrast Options**: For users with visual impairments.
- **Avoid Over-reliance on Color**: Use symbols or text in addition to color.

### **12. Multilingual Support**

Provide options for different languages.

- **Localization**: Use libraries to support multiple languages.
- **Date and Time Formatting**: Format dates according to user locale.

### **13. Real-Time Updates**

If applicable, display live data updates.

- **Dynamic Refresh**: Automatically update information in the CLI as it changes.
- **Status Indicators**: Show live status or countdown timers.

### **14. Integration with Other Tools**

Enhance functionality by integrating with other command-line tools.

- **Piping and Redirection**: Allow output to be piped or redirected.
  ```plaintext
  $ ingestion_viewer --output json | jq '.'
  ```
- **Export Options**: Support exporting data to different formats (JSON, CSV).

### **15. Error Handling and Feedback**

Provide clear messages when something goes wrong.

- **Consistent Error Messages**: Use a standard format.
  ```plaintext
  [ERROR] Failed to load ingestion data: File not found.
  ```
- **Success Messages**: Acknowledge successful operations.
  ```plaintext
  [SUCCESS] Ingestion record saved successfully.
  ```

---

### **Practical Examples**

**Example 1: Colored Output with ANSI Codes**

```plaintext
┌──────────────────────────────────────────────────┐
│ \x1b[1;34mIngestion #123\x1b[0m                              │
├──────────────────────────────────────────────────┤
│ \x1b[1mSubstance       \x1b[0m: \x1b[32mLSD\x1b[0m                         │
│ \x1b[1mRoute           \x1b[0m: Oral                         │
│ \x1b[1mDosage          \x1b[0m: 100 μg (\x1b[33mMedium\x1b[0m)            │
│ \x1b[1mIngested At     \x1b[0m: 2023-10-05 14:30:00          │
├──────────────────────────────────────────────────┤
│ \x1b[1;34mPhases\x1b[0m                                       │
│   \x1b[1mOnset   \x1b[0m: 14:45 - 15:15 (30 mins)            │
│   \x1b[1mPeak    \x1b[0m: 15:15 - 18:15 (3 hours)            │
│   \x1b[1mComedown\x1b[0m: 18:15 - 20:15 (2 hours)            │
└──────────────────────────────────────────────────┘
```

**Example 2: Interactive Phase Progress**

```plaintext
Phases Progress:

[Onset    ] █████████████░░░░░░░░░░░░ 30%
[Peak     ] ████████████████████░░░░░ 75%
[Comedown ] ███░░░░░░░░░░░░░░


