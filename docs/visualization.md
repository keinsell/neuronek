# Visualizations 

## Phase Visualization

Phase visualization should be a chart showing timeline and intensity of ingestion.

```
Dosage Classification: Strong (200mg)
Thresholds: [Light:50mg] [Moderate:100mg] [Strong:200mg]

████████████████████▒░░░░░░░░░░░░░░
▲ ▲      ▲         ▲
│ │      │         └─ Comedown
│ │      └─ Peak  
│ └─ Comeup
└─ Onset
```

## Ingestion Summary

Ingestion should contain base information such as: ID, substane name, humanized dosage, humanized date of administration, route of administration and notes.

```
```

## Ingestion Progression

Ingestion progression should be something like progress bar showing total time of activeness of substance.

## Developer Notes

- [`termplot`](https://github.com/xavierhamel/termplot)
- [`barchart`](https://github.com/jake-low/barchart)
- https://crates.io/crates/lowcharts
- https://crates.io/crates/textcanvas

- https://crates.io/crates/pandrs