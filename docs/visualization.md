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
- [`textplots`](https://lib.rs/crates/textplots), have a problem in rendering multiple lines.
- https://crates.io/crates/lowcharts
- https://crates.io/crates/textcanvas
- https://crates.io/crates/pinax
- https://crates.io/crates/pandrs
- https://lib.rs/crates/asciibar
- https://github.com/orhanbalci/rasciigraph
- https://github.com/RyanBluth/term-table-rs