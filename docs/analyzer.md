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

Here are some deeper, high-value metrics you can derive from exactly the fields in your ingestion table. They go beyond
“how much/how often” and aim to surface patterns, risks or personalized insights that users will really care about.

1. Tolerance & Escalation Trends  
   • Dose-escalation slope: fit a linear (or piecewise) trend to dosage vs. time to see whether they’re steadily
   increasing.  
   • Step-change detection: flag when average dose jumps by more than, say, 20% week-over-week.

2. Pharmacokinetic “Active Load” (if you know or estimate half-lives)  
   • Estimated active concentration curve: for each event, decay prior doses by half-life to compute a running “blood
   level” estimate.  
   • Time above X threshold: total hours per day their estimated concentration exceeds a comfort or safety threshold.

3. Inter-Dose Hazard & Predictive Timing  
   • Survival curve of inter-dose times: what’s the probability they’ll dose again within 1h/3h/6h?  
   • Next-dose forecast: based on recent inter-dose distribution, predict when their next event is likely.

4. Behavioral Seasonality & Contextual Patterns  
   • Circadian profile: cluster ingestions into “morning/afternoon/evening/night” and measure their preferred windows.  
   • Day-type archetypes: use k-means on each day’s feature
   vector ([#events, total dose, first dose time, last dose time]) to identify “light,” “binge,” “steady” days.

5. Consistency & Adherence to Intent  
   • “On-plan” vs “off-plan” days: if users set target windows or max doses, compute % compliance.  
   • Habit‐strength index: days-in-a-row they hit at least one target event vs. breaks.

6. Poly-substance Interactions  
   • Co-ingestion frequency: how often caffeine is taken within X minutes of another stimulant.  
   • Cross-correlation of substances: whether taking substance A tends to follow (or precede) B within 24 hrs.

7. Risk & Alert Signals  
   • High-risk clusters: probability of ≥N high-dose events in 24 hrs.  
   • Unusual gap or burst: flag when inter-dose gap is in the top or bottom 5 percentile of their own history.

8. Personalized Baseline & Z-Scores  
   • Dosage Z-score: today’s total dose expressed in standard deviations above/below their 30-day mean.  
   • Rolling percentile rank: e.g. “you’re in your top 10% highest-dose days since you started.”

9. Efficiency & Pulse Metrics  
   • Dose per event vs. events per dose: how “heavy” each hit is and how often they come back for another—an efficiency
   or reliance gauge.  
   • Cluster intensity: average #events in a 2-hour sliding window, highlighting binge periods.

10. Diversity & Entropy  
    • Substance entropy: Shannon entropy over substance_name shares in a period—measures how varied their use is.  
    • Route-variability index: count or entropy of different administration routes used per week.

By surfacing these deeper insights—escalation trends, pharmacokinetic load, risk clusters, personalized baselines—you
give users not just “what happened” but “what it means” for their habits, safety, and goals.