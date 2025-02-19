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
this may be the most conformable way for users which are looking for the latest version of application, proceed only if you have development experience as application might require manual fixes from your side by this release channel.

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
<summary>Output</summary>

```
caffeine #2

The ingestion of caffeine occurred via the Oral route, with a dosage of 80.0 mg _(Common)_, and was ingested on 2025-02-19 07:32:36 _now_.

Details

Route: Oral
Dosage: 80.0 mg _(Common)_
Ingested: 2025-02-19 07:32:36 _now_

Progress

[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%

Phases

╭─────────────┬────────────────────┬─────────────┬──────────────╮
│    Phase    │      Duration      │ Start Time  │   End Time   │
├─────────────┼────────────────────┼─────────────┼──────────────┤
│   ▲ Onset   │  in 7 minutes ±2m  │    07:32    │  07:37 ±5m   │
│  △ Comeup   │ in 20 minutes ±10m │  07:37 ±5m  │  07:47 ±25m  │
│   ◆ Peak    │  in an hour ±0.4h  │ 07:47 ±25m  │ 08:32 ±1.2h  │
│ ▽ Comedown  │  in an hour ±0.5h  │ 08:32 ±1.2h │ 09:32 ±2.2h  │
│ ○ Afterglow │  in 8 hours ±4.0h  │ 09:32 ±2.2h │ 13:32 ±10.2h │
╰─────────────┴────────────────────┴─────────────┴──────────────╯
```
</details>

#### View Ingestion (Experimental)

*Displays detailed information about a specific ingestion identified by its ID.*
```bash
neuronek ingestion view <INGESTION_ID>
```

<details>
<summary>Output</summary>

```
Ingestion #296

Substance: caffeine
Route: Oral
Dosage: 80.0 mg _(Common)_
Ingested: 2025-02-15 22:55:39 _now_

Current Phase

Peak
- Time elapsed: _in 20 minutes_
- Time remaining: _in an hour_

┌─────────────┬──────────────────┬────────────┬──────────┐
│ Phase       │ Average Duration │ Start Time │ End Time │
├─────────────┼──────────────────┼────────────┼──────────┤
│ ▲ Onset     │ 5m               │ 21:55      │ 22:05    │
├─────────────┼──────────────────┼────────────┼──────────┤
│ △ Comeup    │ 10m              │ 22:05      │ 22:35    │
├─────────────┼──────────────────┼────────────┼──────────┤
│ ◆ Peak      │ 45m              │ 22:35      │ 00:05    │
├─────────────┼──────────────────┼────────────┼──────────┤
│ ▽ Comedown  │ 1h               │ 00:05      │ 02:05    │
├─────────────┼──────────────────┼────────────┼──────────┤
│ ○ Afterglow │ 4h               │ 02:05      │ 14:05    │
└─────────────┴──────────────────┴────────────┴──────────┘
```
</details>

#### List Ingestions

*Lists all recorded ingestions along with their details such as ID, substance, route of administration, dosage, and ingestion date.*
```bash
neuronek ingestion list
```

<details>
<summary>Output</summary>

```
┌────┬─────────────────────┬──────┬─────────┬────────────────┐
│ ID │ Substance           │ ROA  │ Dosage  │ Ingestion Date │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 14 │ caffeine            │ Oral │ 80.0 mg │ 20 seconds ago │
├────┼─────────────────────┼──────┼─────────┼────────────────┤
│ 13 │ caffeine            │ Oral │ 10.0 mg │ 2 hours ago    │
└────┴─────────────────────┴──────┴─────────┴────────────────┘
```
</details>

#### Update Ingestion

*Updates the dosage of a specific ingestion identified by its ID.*
```bash
neuronek ingestion update 14 -d 90mg
```

<details>
<summary>Output</summary>

```
╭────┬───────────┬──────┬─────────┬────────────────╮
│ ID │ Substance │ ROA  │ Dosage  │ Ingestion Date │
├────┼───────────┼──────┼─────────┼────────────────┤
│ 14 │ caffeine  │ Oral │ 90.0 mg │      now       │
╰────┴───────────┴──────┴─────────┴────────────────╯
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

## Contributing

The Project does not expect any external contribution. If you want to contribute, please contact me directly
via [keinsell@protonmail.com,]() and we can discuss the project together and move code to
organization out of my profile.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

Read the [LICENSE](LICENSE) file for more information.
