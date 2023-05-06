## Substance Aggregate

The Substance aggregate represents a psychoactive substance, including its properties and characteristics.

### Properties

- `id` (string): A unique identifier for the substance.
- `name` (string): The name of the substance.
- `description` (string): A description of the substance, including its effects, dosages, and potential risks.
- `psychoactive_class` (`PsychoactiveClass`): The psychoactive class that the substance belongs to (e.g. stimulant, depressant, hallucinogen, etc.). This field could be a reference to a separate `PsychoactiveClass` value object.
- `chemical_class` (`ChemicalClass`): The chemical class that the substance belongs to (e.g. benzodiazepine, tryptamine, etc.). This field could be a reference to a separate `ChemicalClass` value object.
- `routes_of_administration` (`RouteOfAdministration[]`): An array of routes of administration for the substance (e.g. oral, intravenous, inhalation, etc.). Each route of administration could be represented by a separate `RouteOfAdministration` aggregate.
- `source` (`Source`): The source of the information about the substance (e.g. scientific studies, anecdotal reports, etc.). This field could be a reference to a separate `Source` value object.
- `legal_status` (`LegalStatus`): The legal status of the substance (e.g. legal, illegal, controlled substance, etc.). This field could be a reference to a separate `LegalStatus` value object.
- `half_life` (string): The half-life of the substance, or the amount of time it takes for half of the substance to be eliminated from the body.

### Relationships

- `interactions` (`Interaction[]`): An array of potential interactions between the substance and other substances or medications. Each interaction could be represented by a separate `Interaction` aggregate.

### Timestamps

- `created_at` (timestamp): The date and time when the substance was added to the database.
- `updated_at` (timestamp): The date and time when the substance was last updated in the database.

By using the Substance aggregate, you can create a comprehensive database of psychoactive substances that includes information about their properties, characteristics, and potential risks. You can also use this information to provide personalized dosing recommendations and insights into usage patterns for users of the Neuronek application.
