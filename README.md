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

Ingestions are a fundamental area of application, they represent human interaction with the chemical compound of choice.
Ingestion explains what compound was ingested, how it was ingested and when it was ingested. Applications expose a
simple,
scriptable interface which allows for storage and retrieval of structured data.

#### Log Ingestion

*Logs the ingestion of a specified substance with the given dosage.*

```bash
neuronek ingestion log -s caffeine -d 80mg
```

<details>
<summary>---</summary>

```
╭──────────────────────────────┬────────────────────────────────────────────╮
│  ID:         1               ┆ ▲ Onset: 13:00±0m → 13:05±5m (7m)          │
│  Substance:  caffeine        ┆ △ Comeup: 13:05±5m → 13:15±25m (20m)       │
│  Dosage:     150 mg          ┆ ◆ Peak: 13:15±25m → 14:00±70m (1h7m)       │
│  Route:      Oral            ┆ ▽ Comedown: 14:00±70m → 15:00±130m (1h30m) │
│  Ingested:   13:00 11/03/25  ┆ ○ Afterglow: 15:00±130m → 19:00±610m (8h)  │
╰──────────────────────────────┴────────────────────────────────────────────╯

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

<details>
<summary>---</summary>

```
╭──────────────────────────────┬────────────────────────────────────────────╮
│  ID:         1               ┆ ▲ Onset: 13:00±0m → 13:05±5m (7m)          │
│  Substance:  caffeine        ┆ △ Comeup: 13:05±5m → 13:15±25m (20m)       │
│  Dosage:     150 mg          ┆ ◆ Peak: 13:15±25m → 14:00±70m (1h7m)       │
│  Route:      Oral            ┆ ▽ Comedown: 14:00±70m → 15:00±130m (1h30m) │
│  Ingested:   13:00 11/03/25  ┆ ○ Afterglow: 15:00±130m → 19:00±610m (8h)  │
╰──────────────────────────────┴────────────────────────────────────────────╯
```

</details>

#### List Ingestions

*Lists all recorded ingestions along with their details such as ID, substance, route of administration, dosage, and
ingestion date.*

```bash
neuronek ingestion list
```

<details>
<summary>---</summary>

```
╭────┬───────────┬─────────┬───────┬──────────────────────────────────────╮
│ ID │ Substance │ Dosage  │ Route │ Ingested At                          │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 33 │ caffeine  │ 80.0 mg │ Oral  │ 2025-03-06 06:40:04.705901008 +01:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 32 │ caffeine  │ 80.0 mg │ Oral  │ 2025-03-06 06:30:43.702279077 +01:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 31 │ caffeine  │ 80.0 mg │ Oral  │ 2025-03-06 06:29:44.948833745 +01:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 30 │ caffeine  │ 80.0 mg │ Oral  │ 2025-03-06 06:29:38.685091465 +01:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 29 │ caffeine  │ 80.0 mg │ Oral  │ 2025-03-06 06:24:43.550999449 +01:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 28 │ caffeine  │ 80.0 mg │ Oral  │ 2025-03-06 06:17:41.020152562 +01:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 27 │ caffeine  │ 80.0 mg │ Oral  │ 2025-03-06 06:15:57.546015179 +01:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 26 │ caffeine  │ 80.0 mg │ Oral  │ 2025-03-06 06:10:23.044092301 +01:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 25 │ caffeine  │ 80.0 mg │ Oral  │ 2025-03-06 06:09:47.632702987 +01:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 24 │ caffeine  │ 80.0 mg │ Oral  │ 2025-03-06 06:08:58.809500208 +01:00 │
╰────┴───────────┴─────────┴───────┴──────────────────────────────────────╯
```

</details>

#### Update Ingestion

*Updates the dosage of a specific ingestion identified by its ID.*

```bash
neuronek ingestion update 14 -d 90mg
```

<details>
<summary>---</summary>

```
╭──────────────────────────────┬────────────────────────────────────────────╮
│  ID:         1               ┆ ▲ Onset: 13:00±0m → 13:05±5m (7m)          │
│  Substance:  caffeine        ┆ △ Comeup: 13:05±5m → 13:15±25m (20m)       │
│  Dosage:     150 mg          ┆ ◆ Peak: 13:15±25m → 14:00±70m (1h7m)       │
│  Route:      Oral            ┆ ▽ Comedown: 14:00±70m → 15:00±130m (1h30m) │
│  Ingested:   13:00 11/03/25  ┆ ○ Afterglow: 15:00±130m → 19:00±610m (8h)  │
╰──────────────────────────────┴────────────────────────────────────────────╯
```

</details>

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

### Monitor Command

*Launch an interactive Terminal User Interface (TUI) to visualize and monitor substance effects in real-time.*

```bash
neuronek monitor
```

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
