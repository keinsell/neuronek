# Ingestion Analyzer

The `analyzer` module is a core component of the ingestion tracking system, responsible for **analyzing and interpreting
ingestion data** to provide meaningful insights and classifications. It acts as a bridge between the `substance`
module (which holds knowledge about substances) and the `ingestion` module (which records individual ingestion events).
The `analyzer` takes raw ingestion data and substance information, processes it, and generates valuable insights, such
as dosage classifications, predicted ingestion phases, and time-series intensity curves.

**Features:**

- **Dosage Classification:** Determine the `DosageClassification` (e.g., Light, Common, Strong, Heavy) for a given
  ingestion, based on:
    - The ingested `Substance`.
    - The `RouteOfAdministration`.
    - The `dosage` amount.
    - Dosage ranges defined in the `substance` module.

- **Ingestion Phase Analysis and Prediction:**
    - Calculate and predict the timing and characteristics of ingestion phases (e.g., Onset, Comeup, Peak, Offset,
      Afterglow).
    - This prediction utilizes:
        - Substance-specific pharmacokinetic properties (from the `substance` module).
        - Route of administration characteristics.
        - Ingested dosage.
    - Generate `IngestionPhase` entities to be associated with the `Ingestion` record.

- **Time-Series Intensity Curve Generation:**
    - Produce time-series data representing the estimated intensity of the substance's effects over time.
    - This curve is based on the predicted phases and substance-specific pharmacokinetic models.
    - The curve data can be used for visualization and further analysis.

- **Report Generation:**
    - Compile the analysis results into an `AnalyzerReport`.
    - This report summarizes:
        - The determined `DosageClassification`.
        - Predicted `IngestionPhase` timings and durations.
        - Data points for the intensity curve.
        - Any other relevant insights or warnings based on the analysis.

## Relation to Other Modules

- **`substance`:** The *knowledge base* for substances. Defines properties, routes, dosages, and pharmacokinetic
  parameters. It's *passive*.
- **`ingestion`:** The *record keeper* for ingestion events. Stores individual ingestion records. It's *primarily* about
  data storage and retrieval.
- **`analyzer`:** The *interpreter* and *predictor*. It takes data from `substance` and `ingestion`, performs analysis,
  and generates insights. It's *active*.

---

## Roadmap for Extracting Insights from Current Database Information

### Available Information

Based on the current codebase, the following information is available in the database for analysis:

- **Substance Data:**
    - Substance names and canonical identifiers.
    - Routes of administration (`RouteOfAdministrationClassification`) with specific characteristics.
    - Dosage ranges for each route, including:
        - `DosageClassification` levels (e.g., Threshold, Light, Common, Strong, Heavy).
        - Specific dosage amounts and units (`Dosage` struct).
    - Pharmacokinetic properties per substance and route, such as:
        - Onset time ranges.
        - Peak effects duration.
        - Total duration of effects.
        - Afterglow periods.
    - Phase classification factors (`PhaseClassificationFactor`) for timing predictions.

- **Ingestion Records:**
    - Unique ingestion IDs.
    - Substance name ingested.
    - Dosage amount and units.
    - Route of administration.
    - Ingestion date and time.
    - Optional `dosage_classification`.
    - Associated `IngestionPhase` entities (e.g., Onset, Peak).

### Analyzer Capabilities with Current Data

Using the available information, the `analyzer` can perform the following analyses:

1. **Dosage Classification:**

    - **Process:**
        - Retrieve the substance's dosage ranges for the specified route.
        - Compare the ingested dosage against these ranges.
        - Classify the dosage (e.g., Light, Common, Strong).
    - **Output:**
        - Update the ingestion record with the `dosage_classification`.
        - Provide insights into the expected intensity based on the classification.

2. **Ingestion Phase Prediction:**

    - **Process:**
        - Utilize pharmacokinetic properties to estimate phase timings.
        - Calculate expected start and end times for each phase relative to the ingestion time.
        - Consider individual factors if available (e.g., metabolism rate).
    - **Output:**
        - Generate `IngestionPhase` entities with timestamps.
        - Map out a timeline of the experience phases.

3. **Intensity Curve Generation:**

    - **Process:**
        - Create a time-series model representing effect intensity over time.
        - Use mathematical models (e.g., Gaussian curves) based on pharmacokinetics.
    - **Output:**
        - Data points for the intensity curve.
        - Visual representations of the expected experience.

4. **Customized Reports (`AnalyzerReport`):**

    - **Process:**
        - Compile all analysis results into a coherent report.
        - Include dosage classification, phase predictions, and intensity curves.
        - Highlight any anomalies or warnings (e.g., unusually high dosage).
    - **Output:**
        - An `AnalyzerReport` object summarizing the findings.
        - Actionable insights for users or stakeholders.

### Implementation Roadmap

1. **Enhance Dosage Classification Logic:**

    - **Short-Term Goal:**
        - Implement functions to compare ingested dosage against substance-specific ranges.
        - Handle edge cases where dosage is unknown or falls outside known ranges.

    - **Code References:**
        - `src/analyzer/mod.rs` lines 78–88: Accessing route-specific dosages.
        - `src/substance/route_of_administration/dosage.rs`: Definitions of `DosageClassification`.

2. **Develop Ingestion Phase Analysis:**

    - **Short-Term Goal:**
        - Use phase classification factors to predict phase timings.
        - Generate `IngestionPhase` entities with calculated start and end times.

    - **Code References:**
        - `src/analyzer/mod.rs` lines 45–85: Framework for analysis.
        - `src/substance/route_of_administration/phase.rs`: Phase classification logic.

3. **Implement Intensity Curve Modeling:**

    - **Mid-Term Goal:**
        - Apply pharmacokinetic models to simulate intensity over time.
        - Incorporate dosage and individual variability factors.

    - **Approach:**
        - Use mathematical functions to model absorption and elimination rates.
        - Validate models with empirical data if available.

4. **Generate Comprehensive Reports:**

    - **Mid-Term Goal:**
        - Create the `AnalyzerReport` struct to encapsulate all analysis results.
        - Include recommendations or alerts based on analysis.

    - **Code References:**
        - `src/analyzer/model.rs`: Define the report structure.

5. **Error Handling and Data Validation:**

    - **Ongoing Goal:**
        - Implement robust error handling for missing or inconsistent data.
        - Validate inputs and provide meaningful error messages.

    - **Code References:**
        - `src/analyzer/query.rs` lines 81–85: Handling missing routes.
        - `src/ingestion/service.rs` lines 97–127: Logging and error events during ingestion.

6. **User Interface and Visualization:**

    - **Long-Term Goal:**
        - Develop frontend components to display intensity curves and phase timelines.
        - Allow users to interact with the analysis reports.

    - **Approach:**
        - Integrate with visualization libraries.
        - Ensure data is presented clearly and accessibly.

### Future Enhancements

- **Substance Interaction Analysis:**

    - Analyze potential interactions when multiple substances are ingested.

- **Personalization and Learning:**

    - Adjust predictions based on user history and feedback.
    - Implement machine learning algorithms to refine models over time.

- **Integration with External Data Sources:**

    - Pull in additional pharmacokinetic data from scientific databases.
    - Update substance information dynamically.

---

## Conclusion

With the current data available in the database, the `analyzer` module can perform comprehensive analyses of ingestion
events. By leveraging detailed substance information and robust ingestion records, it can classify dosages, predict the
progression of experiences, and generate insightful reports. This roadmap outlines the steps needed to fully realize
these capabilities and provides a foundation for future enhancements.
