# Substance Intensity Time-Series Analysis

## Overview
This document outlines approaches for generating time-series data representing substance intensity over time.

## Key Concepts

### 1. Phase-Based Intensity Curves
Each substance ingestion phase (onset, peak, offset) has distinct intensity characteristics:
- Onset: Exponential increase
- Peak: Plateau with slight variations
- Offset: Logarithmic decay

### 2. Interpolation Methods
For accurate intensity curves, we can use:
- Linear interpolation for simple approximations
- Cubic splines for smooth transitions
- Bezier curves for natural-looking intensity changes

### 3. Data Point Generation
Key points to consider:
- Sample rate: More points = smoother curve but higher memory usage
- Phase transitions: Need special handling at phase boundaries
- Time granularity: Minutes for short-acting, hours for long-acting substances

## Implementation Approach

### 1. Base Structure
```rust
struct IntensityPoint {
    timestamp: DateTime<Local>,
    intensity: f64,  // 0.0 to 1.0
}
```

### 2. Phase Intensity Functions
Each phase type needs a specific intensity function:
- Onset: `f(t) = 1 - e^(-kt)`
- Peak: `f(t) = 1.0 + sin(t) * 0.1`  // Small variations
- Offset: `f(t) = e^(-kt)`

### 3. Sampling Strategy
- Generate points every N minutes where N depends on total duration
- More frequent sampling during rapid changes (onset/offset)
- Less frequent sampling during stable periods (peak)

## Time-Series Generation Algorithm

1. For each phase:
   - Calculate phase duration
   - Determine appropriate sampling rate
   - Generate intensity points using phase-specific function
   - Add transition smoothing between phases

2. Combine phase data:
   - Normalize intensities across phases
   - Ensure continuous transitions
   - Apply substance-specific scaling factors

## Code Implementation Example

```rust
impl IngestionPhase {
    fn intensity_at_time(&self, t: DateTime<Local>) -> f64 {
        match self.class {
            PhaseClassification::Onset => self.onset_intensity(t),
            PhaseClassification::Peak => self.peak_intensity(t),
            PhaseClassification::Offset => self.offset_intensity(t),
        }
    }

    fn generate_time_series(&self, points: usize) -> Vec<(DateTime<Local>, f64)> {
        let duration = self.duration.end - self.duration.start;
        let step = duration / (points as i32);
        
        (0..points)
            .map(|i| {
                let t = self.start_time.start + (step * i as i32);
                (t, self.intensity_at_time(t))
            })
            .collect()
    }
}
```

## Future Improvements

1. **Accuracy Enhancements**
   - Add substance-specific metabolism factors
   - Include tolerance calculations
   - Account for user-specific variables

2. **Performance Optimization**
   - Implement adaptive sampling rates
   - Cache commonly used curves
   - Optimize memory usage for long durations

3. **Validation**
   - Compare against known pharmacokinetic models
   - Validate with real-world data
   - Add confidence intervals

## References

1. Pharmacokinetics and phase transition models
2. Curve fitting and interpolation techniques
3. Time-series optimization patterns
