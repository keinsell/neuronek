# Ingestion Analyzer

The `analyzer` module is a core component of the ingestion tracking system, responsible for **analyzing and interpreting ingestion data** to provide meaningful insights and classifications. It acts as a bridge between the `substance` module (which holds knowledge about substances) and the `ingestion` module (which records individual ingestion events).  The `analyzer` takes raw ingestion data and substance information, processes it, and generates valuable insights, such as dosage classifications, predicted ingestion phases, and time-series intensity curves.

**Features:**

- **Dosage Classification:** Determine the `DosageClassification` (e.g., Light, Common, Strong, Heavy) for a given ingestion, based on:
    *   The ingested `Substance`.
    *   The `RouteOfAdministration`.
    *   The `dosage` amount.
    *   Dosage ranges defined in the `substance` module.

- **Ingestion Phase Analysis and Prediction:**
    *   Calculate and predict the timing and characteristics of ingestion phases (e.g., Onset, Comeup, Peak, Offset, Afterglow).
    *   This prediction utilizes:
        *   Substance-specific pharmacokinetic properties (from the `substance` module).
        *   Route of administration characteristics.
        *   Ingested dosage.
    *   Generate `IngestionPhase` entities to be associated with the `Ingestion` record.

- **Time-Series Intensity Curve Generation:**
    *   Produce time-series data representing the estimated intensity of the substance's effects over time.
    *   This curve is based on the predicted phases and substance-specific pharmacokinetic models.
    *   The curve data can be used for visualization and further analysis.

- **Report Generation:**
    *   Compile the analysis results into an `AnalyzerReport`.
    *   This report summarizes:
        *   The determined `DosageClassification`.
        *   Predicted `IngestionPhase` timings and durations.
        *   Data points for the intensity curve.
        *   Any other relevant insights or warnings based on the analysis.

## Relation to other modules

*   **`substance`:**  The *knowledge base* for substances.  Defines properties, routes, dosages, and pharmacokinetic parameters.  It's *passive*.
*   **`ingestion`:**  The *record keeper* for ingestion events.  Stores individual ingestion records. It's *primarily* about data storage and retrieval.
*   **`analyzer`:** The *interpreter* and *predictor*.  It takes data from `substance` and `ingestion`, performs analysis, and generates insights. It's *active*.