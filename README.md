# Neuronek

🧬 Intelligent dosage tracker application for monitoring supplements, nootropics and psychoactive substances along with
their long-term influence on one's mind and body.

![preview](docs/assets/log_ingestion_preview.png)

## About

Neuronek is an intelligent dosage tracking application designed to monitor and log the use of supplements, nootropics,
and
psychoactive substances. By recording and analyzing ingestion, it helps users better understand the long-term effects
of these compounds on their physical and mental health.

Features offered by application include:

- **Ingestion journaling** with a set of commands which allows for inserting, updating, retrieving and deleting all the
  data stored as `Ingestion` model.

## Installation

To install the application, please visit the [GitHub Releases Page](https://github.com/keinsell/neuronek/releases) for
pre-built binaries and installation instructions for your platform. Alternatively, you can install the application from
supported package managers or build it from source.

#### Using a package manager (recommended)

> [!WARNING]
> Application is in early stage of development and to avoid polluting package managers with application that can be
> potentially dead in few months I do recommend installing from source or using available pre-build binaries.
> Application will be available for `homebrew`, `pacman`, `nix`, `scoop`, `dnf` and `apt` when it would be considered
> production-ready.

#### Installation from source (Advanced)

Application can be installed with `cargo` and providing url to this repository,
this may be the most conformable way for users which are looking for the latest version of application, proceed only if
you have development experience as application might require manual fixes from your side by this release channel.

```
cargo install --git https://github.com/keinsell/neuronek
```

**Note:** This method might be best for users who always want the absolute newest version of the application. However,
it may be less stable than the pre-built binaries.

```bash
❯ neuronek --help
```

## Usage

### Ingestion Journaling

Ingestions are the cornerstone of the Neuronek tracking system, representing each instance when a user consumes a chemical compound. Each ingestion record captures critical pharmacological data: the specific substance consumed, the route of administration, precise dosage, and timestamp of consumption. The application provides a comprehensive yet intuitive command-line interface that enables users to create, retrieve, update, and delete these records with minimal friction. This structured approach to substance tracking allows for detailed analysis of consumption patterns, pharmacokinetics, and subjective effects over time, facilitating improved understanding of how various compounds affect individual physiology and psychology.

#### Log Ingestion

*Logs the ingestion of a specified substance with the given dosage.*

```bash
neuronek ingestion log -s caffeine -d 80mg
```

```present cargo run -- -f pretty ingestion log -s caffeine -d 80mg

╭──────────────────────────────┬───────────────────────────────────────────╮
│  ID:         6               ┆  — Onset      08:25       →  08:30±5m     │
│  Substance:  Caffeine        ┆  ↑ Comeup     08:30±5m    →  08:40±25m    │
│  Dosage:     80.0 mg         ┆  ≡ Peak       08:40±25m   →  09:25±1.2h   │
│  Route:      Oral            ┆  ↓ Comedown   09:25±1.2h  →  10:25±2.2h   │
│  Ingested:   08:25 31/03/25  ┆  ≈ Afterglow  10:25±2.2h  →  14:25±10.2h  │
╰──────────────────────────────┴───────────────────────────────────────────╯

```

</details>

#### View Ingestion

*Displays detailed information about a specific ingestion identified by its ID.*

> ![WARNING]
> Ingestion viewing user interface is a subject to change to one that would be compact yet will contain most important
> information, please share your feedback and expectations in revelant github issues.

```bash
neuronek ingestion view <INGESTION_ID>
```

```present cargo run -- -f pretty ingestion view 1

╭──────────────────────────────┬───────────────────────────────────────────╮
│  ID:         1               ┆  — Onset      08:24       →  08:29±5m     │
│  Substance:  Caffeine        ┆  ↑ Comeup     08:29±5m    →  08:39±25m    │
│  Dosage:     90.0 mg         ┆  ≡ Peak       08:39±25m   →  09:24±1.2h   │
│  Route:      Oral            ┆  ↓ Comedown   09:24±1.2h  →  10:24±2.2h   │
│  Ingested:   08:24 31/03/25  ┆  ≈ Afterglow  10:24±2.2h  →  14:24±10.2h  │
╰──────────────────────────────┴───────────────────────────────────────────╯

```

#### List Ingestions

*Lists all recorded ingestions along with their details such as ID, substance, route of administration, dosage, and
ingestion date.*

```bash
neuronek ingestion list
```

```present cargo run -- -f pretty ingestion ls
╭────┬───────────┬─────────┬───────┬──────────────────────────────────────╮
│ ID │ Substance │ Dosage  │ Route │             Ingested At              │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 6  │ Caffeine  │ 80.0 mg │ Oral  │ 2025-03-31 08:25:59.720793355 +02:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 5  │ Caffeine  │ 80.0 mg │ Oral  │ 2025-03-31 08:25:40.652991085 +02:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 4  │ Caffeine  │ 80.0 mg │ Oral  │ 2025-03-31 08:25:39.344601911 +02:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 3  │ Caffeine  │ 80.0 mg │ Oral  │ 2025-03-31 08:25:28.860212134 +02:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 2  │ Caffeine  │ 80.0 mg │ Oral  │ 2025-03-31 08:25:28.027645413 +02:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 1  │ Caffeine  │ 90.0 mg │ Oral  │ 2025-03-31 08:24:54.055982344 +02:00 │
╰────┴───────────┴─────────┴───────┴──────────────────────────────────────╯

```

#### Update Ingestion

*Updates the dosage of a specific ingestion identified by its ID.*

```bash
neuronek ingestion update 1 -d 90mg
```

```present cargo run -- -f pretty ingestion update 1 -d 90mg

╭──────────────────────────────┬────────────────────────────────────────╮
│  ID:         1               ┆ No phases recorded for this ingestion. │
│  Substance:  Caffeine        ┆                                        │
│  Dosage:     90.0 mg         ┆                                        │
│  Route:      Oral            ┆                                        │
│  Ingested:   08:24 31/03/25  ┆                                        │
╰──────────────────────────────┴────────────────────────────────────────╯

```

#### Delete Ingestion

*Deletes a specific ingestion identified by its ID from the records.*

```bash
neuronek ingestion delete 14
```

<details>
<summary>Output</summary>

```
Ingestion #14 has been successfully deleted.
```

</details>

### Substances

Application comes with a pre-bundled database of psychoactive substances built on top
of [PsychonautWiki](https://psychonautwiki.org), such information is easily queryable through CLI and is foundation
for further analysis of user's ingestions to provide insight on harm-reduction and predicting subjective effects.

#### Get Substance [Under Development]

Application can preview information about compounds from initially provided dataset, however, due to the highly nested
nature
of information the clean and human-friendly interface is needed to be designed and developed and implementation of such
to this application by its nature is questionable.

```bash
neuronek substance get caffeine
```

<details>
<summary>---</summary>

```json
{
  "name": "Caffeine",
  "common_names": "",
  "routes_of_administration": [
    {
      "name": "Insufflated",
      "dosages": [
        {
          "classification": "Heavy",
          "dosage_min": "80.0 mg",
          "dosage_max": "N/A"
        },
        {
          "classification": "Strong",
          "dosage_min": "40.0 mg",
          "dosage_max": "80.0 mg"
        },
        {
          "classification": "Light",
          "dosage_min": "10.0 mg",
          "dosage_max": "25.0 mg"
        },
        {
          "classification": "Threshold",
          "dosage_min": "N/A",
          "dosage_max": "2.50 mg"
        },
        {
          "classification": "Medium",
          "dosage_min": "25.0 mg",
          "dosage_max": "40.0 mg"
        }
      ],
      "phases": [
        {
          "name": "Onset",
          "duration_min": "PT30S",
          "duration_max": "PT2M"
        },
        {
          "name": "Afterglow",
          "duration_min": "PT6H",
          "duration_max": "P1D"
        },
        {
          "name": "Comeup",
          "duration_min": "PT30S",
          "duration_max": "PT2M"
        },
        {
          "name": "Comedown",
          "duration_min": "PT6H",
          "duration_max": "PT10H"
        },
        {
          "name": "Peak",
          "duration_min": "PT30M",
          "duration_max": "PT1H"
        }
      ]
    },
    {
      "name": "Oral",
      "dosages": [
        {
          "classification": "Medium",
          "dosage_min": "50.0 mg",
          "dosage_max": "150 mg"
        },
        {
          "classification": "Heavy",
          "dosage_min": "500 mg",
          "dosage_max": "N/A"
        },
        {
          "classification": "Threshold",
          "dosage_min": "N/A",
          "dosage_max": "10.0 mg"
        },
        {
          "classification": "Strong",
          "dosage_min": "150 mg",
          "dosage_max": "500 mg"
        },
        {
          "classification": "Light",
          "dosage_min": "20.0 mg",
          "dosage_max": "50.0 mg"
        }
      ],
      "phases": [
        {
          "name": "Comeup",
          "duration_min": "PT10M",
          "duration_max": "PT30M"
        },
        {
          "name": "Comedown",
          "duration_min": "PT1H",
          "duration_max": "PT2H"
        },
        {
          "name": "Afterglow",
          "duration_min": "PT4H",
          "duration_max": "PT12H"
        },
        {
          "name": "Peak",
          "duration_min": "PT45M",
          "duration_max": "PT1H30M"
        },
        {
          "name": "Onset",
          "duration_min": "PT5M",
          "duration_max": "PT10M"
        }
      ]
    }
  ]
}

```

</details>

### Statistics

#### View Statistics

## Contributing

The Project does not expect any external contribution. If you want to contribute, please contact me directly
via [keinsell@protonmail.com,]() and we can discuss the project together and move code to
organization out of my profile.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

Read the [LICENSE](LICENSE) file for more information.
