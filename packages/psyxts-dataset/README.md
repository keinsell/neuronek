# PsychonautWiki x Tripsit Dataset (`psyxts`)

> This package was based on previous repository at https://github.com/TripSit/merge-psychonautwiki-tripsit-data initally made by https://github.com/NoahSaso/merge-psychonautwiki-tripsit-data. In Neuronek we decided to give it a try and merge these data in our format (if this will have any sense). Package was edited to be able used by `npm` as typed dataset. This repository seems to be abandoned, so I have no willing to contribute to it as same this is intended to be done with `osiris` but with more detailed data model.

Script to merge data from PsychonautWiki API + pages and TripSit factsheets into one standardized format

Now with Typescript!

# Python

## Installation

1.  Install virtualenv
    ```
    python3 -m pip install --user virtualenv
    ```
2.  Create virtual environment
    ```
    python3 -m venv env
    ```
3.  Activate virtual environment
    ```
    source env/scripts/activate
    ```
4.  Install packages
    ```
    python3 -m pip install -r requirements.txt
    ```

## Usage

```
python scrape.py [-h] [output]

Scrape PsychonautWiki and TripSit data into unified dataset

positional arguments:
  output      Optional output file

optional arguments:
  -h, --help  show this help message and exit
```

# NodeJS

The NodeJS version utilizes eslint for linting and prettier for formatting. It also uses typescript for type checking.
Types have been created by online converters and hand, I am not an expert at typescript, would welcome improvements!

## Installation

1.  Install packages
    ```
    npm install
    ```

## Usage

```
npm run start
```

## Development

Dev script will do a lint, bump the version of thispacakge, and then start Nodemon.
Nodemon will watch for changes and restart the script when changes are detected, making development easier.
Please run the lint script before a PR to ensure code is formatted correctly!

```
npm run dev
```

# Output Schema

| Property                  | Type                     | Description                                                                    | Source                                                                                |
| ------------------------- | ------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `url`                     | `string`                 | Substance page URL                                                             | PsychonautWiki if exists, TripSit factsheet otherwise                                 |
| `experiencesUrl`          | `null` \| `string`       | Erowid Experience Vault page URL                                               | TripSit                                                                               |
| `name`                    | `string`                 | Substance Name                                                                 | shortest display name of PsychonautWiki page header and TripSit API's `pretty_name`   |
| `aliases`                 | `string[]`               | List of aliases (lowercase)                                                    | Both                                                                                  |
| `aliasesStr`              | `string`                 | Comma-separated list of aliases (for fuzzy searching)                          | Both                                                                                  |
| `summary`                 | `string`                 | Substance summary                                                              | TripSit                                                                               |
| `reagents`                | `null` \| `string`       | Reagent test kit reactions                                                     | TripSit                                                                               |
| `classes`                 | `null` \| `Dictionary`   | Substance classifications                                                      | PsychonautWiki                                                                        |
| `classes.chemical`        | `string[]`               | Chemical classifications                                                       | PsychonautWiki                                                                        |
| `classes.psychoactive`    | `string[]`               | Psychoactive classifications                                                   | PsychonautWiki                                                                        |
| `toxicity`                | `null` \| `string[]`     | List of toxicity characteristics                                               | PsychonautWiki                                                                        |
| `addictionPotential`      | `null` \| `string`       | Description of potential for addiction                                         | PsychonautWiki                                                                        |
| `tolerance`               | `null` \| `Dictionary`   | Tolerance information                                                          | PsychonautWiki                                                                        |
| `tolerance.full`          | `null` \| `string`       | When full tolerance activates                                                  | PsychonautWiki                                                                        |
| `tolerance.half`          | `null` \| `string`       | When tolerance is reduced by half                                              | PsychonautWiki                                                                        |
| `tolerance.zero`          | `null` \| `string`       | When tolerance is back to zero                                                 | PsychonautWiki                                                                        |
| `crossTolerances`         | `null` \| `string[]`     | Other substances or classes with cross tolerance                               | PsychonautWiki                                                                        |
| `roas`                    | `Dictionary[]`           | Routes of administration                                                       | Both (Note: PsychonautWiki ROAs are prioritized, and TripSit factsheets fill in gaps) |
| `roas[].name`             | `string`                 | Name of ROA (e.g. 'Oral', 'Smoked')                                            | Both                                                                                  |
| `roas[].bioavailability`  | `Optional<string>`       | Substance's bioavailability for ROA                                            | Both                                                                                  |
| `roas[].dosage`           | `null` \| `Dictionary[]` | Dosage information for ROA                                                     | Both                                                                                  |
| `roas[].dosage[].name`    | `string`                 | Name of dosage level for ROA (e.g. 'Threshold', 'Strong')                      | Both                                                                                  |
| `roas[].dosage[].value`   | `string`                 | Typical dosage for given level of ROA (e.g. '10 - 25 mg', '100 mg +')          | Both                                                                                  |
| `roas[].dosage[].note`    | `Optional<string>`       | Additional note                                                                | PsychonautWiki                                                                        |
| `roas[].duration`         | `null` \| `Dictionary[]` | Duration information for ROA                                                   | Both                                                                                  |
| `roas[].duration[].name`  | `string`                 | Name of duration item for ROA (e.g. 'Onset', 'Peak')                           | Both                                                                                  |
| `roas[].duration[].value` | `string`                 | Typical duration for given item of ROA (e.g. '30 - 60 minutes', '2 - 4 hours') | Both                                                                                  |
| `roas[].duration[].note`  | `Optional<string>`       | Additional note                                                                | PsychonautWiki                                                                        |
| `interactions`            | `null \| Dictionary[]`   | Interactions with other substances or classes                                  | TripSit                                                                               |
| `interactions[].name`     | `string`                 | Name of other substance or class                                               | TripSit                                                                               |
| `interactions[].status`   | `string`                 | Interaction status from TripSit combos                                         | TripSit                                                                               |
| `interactions[].note`     | `Optional<string>`       | Additional note                                                                | TripSit                                                                               |
