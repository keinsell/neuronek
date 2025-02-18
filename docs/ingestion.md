# Ingestion

The **Ingestion** entity represents a single record of consuming a specific [substance](./substance.md). It captures
details such as the substance name, dosage, route of administration, and the date/time at which the ingestion occurred.
The entity also supports optional classification of the dosage and calculation of various time-based phases (e.g.,
onset, peak) related to the ingestion experience.

## Data Model

- Is uniuqely identified.
- Must contain minimal amount of data to identify substance.
- Must contain minimal amount of data about dosage.
  - Might support dosage ranges and unknown dosages.
- Must contain time when was ingested
  - Could support ranges and unknowns probably.
- Can contain dosage classification
- Can contain reference to substance in database
- Can contain multiple `IngestionPhase` entities which define calendar entries of specific phases of ingestion, it's
  created when ingestion analysis was possible and application had enough infomration.

## Flow

1. **Create/Update**
   When a new ingestion is recorded, the application stores the substance details, dosage, and route. If dosage
   information matches known reference ranges, a dosage_classification can be assigned. Any known phases for this
   ingestion are also stored.
2. **Retrieval**
   When retrieving an ingestion, relevant ingestion-phase records are also fetched, providing a comprehensive view of
   both the ingestion event and its associated timeline of effects.
3. **Analysis**
   Systems or modules that analyze ingestion data (e.g., generating reports, running calculations) can use the dosage,
   route, and phase data to present meaningful insights to end users.
4. **Intended Usage**
   This data structure is intended to help track ingestions reliably while linking them to known durations and
   intensities, and to assist in historical lookups or analytics across ingestion events.

## Presentation

### Ingestion Phases

```
1.0 ─                  ┌──────┐
0.7 ─           ┌─────┘      └─────┐
0.3 ─      ┌────┘                  └────┐
0.0 ─ ─────┘                            └─────
    0h    2h    4h    6h    8h    10h   12h
```

### Ingestion Timeline

#### Horizontal Timeline with Proportional Scaling

```
▲────△──────────◆──────────────────────▽────────────○────────────────────
│    │          │                      │            │                    
01:06 01:11    01:21                 02:06        03:06                07:06
```

#### Vertical Flow Diagram

```
▲ Onset (5m)
│
├─01:11
△ Comeup (10m)
│
├─01:21
◆ Peak (45m)
│
├─02:06
▽ Comedown (1h)
│
├─03:06
○ Afterglow (4h)
│
└─07:06
```