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
│  ID:         5               ┆  — Onset      23:37       →  23:42±5m     │
│  Substance:  Caffeine        ┆  ↑ Comeup     23:42±5m    →  23:52±25m    │
│  Dosage:     80.0 mg         ┆  ≡ Peak       23:52±25m   →  00:37±1.2h   │
│  Route:      Oral            ┆  ↓ Comedown   00:37±1.2h  →  01:37±2.2h   │
│  Ingested:   23:37 01/04/25  ┆  ≈ Afterglow  01:37±2.2h  →  05:37±10.2h  │
╰──────────────────────────────┴───────────────────────────────────────────╯
```

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
│  ID:         1               ┆  — Onset      23:31       →  23:36±5m     │
│  Substance:  Caffeine        ┆  ↑ Comeup     23:36±5m    →  23:46±25m    │
│  Dosage:     90.0 mg         ┆  ≡ Peak       23:46±25m   →  00:31±1.2h   │
│  Route:      Oral            ┆  ↓ Comedown   00:31±1.2h  →  01:31±2.2h   │
│  Ingested:   23:31 01/04/25  ┆  ≈ Afterglow  01:31±2.2h  →  05:31±10.2h  │
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
│ 5  │ Caffeine  │ 80.0 mg │ Oral  │ 2025-04-01 23:37:25.784650159 +02:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 4  │ Caffeine  │ 80.0 mg │ Oral  │ 2025-04-01 23:37:16.643817564 +02:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 3  │ Caffeine  │ 80.0 mg │ Oral  │ 2025-04-01 23:34:23.206667961 +02:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 2  │ Caffeine  │ 80.0 mg │ Oral  │ 2025-04-01 23:31:32.943824675 +02:00 │
├────┼───────────┼─────────┼───────┼──────────────────────────────────────┤
│ 1  │ Caffeine  │ 90.0 mg │ Oral  │ 2025-04-01 23:31:17.733842540 +02:00 │
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
│  Ingested:   23:31 01/04/25  ┆                                        │
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

```present cargo run -- -f pretty substance get caffeine
╭─────────────┬──────────────────────────────────┬────────────────────────╮
│ Caffeine                                                                │
├─────────────┼──────────────────────────────────┼────────────────────────┤
│ Route       │ Dosage                           │ Phases                 │
├─────────────┼──────────────────────────────────┼────────────────────────┤
│ Insufflated │  (±) Threshold  ≤2.50 mg         │  — Onset      30s-2m   │
│             │  (+) Light      10.0 mg-25.0 mg  │  ↑ Comeup     30s-2m   │
│             │  (++) Common    25.0 mg-40.0 mg  │  ≡ Peak       30m-1h   │
│             │  (+++) Strong   40.0 mg-80.0 mg  │  ↓ Comedown   6h-10h   │
│             │  (++++) Heavy   ≥80.0 mg         │  ≈ Afterglow  6h-1d    │
├─────────────┼──────────────────────────────────┼────────────────────────┤
│ Oral        │  (±) Threshold  ≤10.0 mg         │  — Onset      5m-10m   │
│             │  (+) Light      20.0 mg-50.0 mg  │  ↑ Comeup     10m-30m  │
│             │  (++) Common    50.0 mg-150 mg   │  ≡ Peak       45m-1h   │
│             │  (+++) Strong   150 mg-500 mg    │  ↓ Comedown   1h-2h    │
│             │  (++++) Heavy   ≥500 mg          │  ≈ Afterglow  4h-12h   │
╰─────────────┴──────────────────────────────────┴────────────────────────╯
```

### Statistics

#### View Statistics

## Contributing

The Project does not expect any external contribution. If you want to contribute, please contact me directly
via [keinsell@protonmail.com,]() and we can discuss the project together and move code to
organization out of my profile.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

Read the [LICENSE](LICENSE) file for more information.
