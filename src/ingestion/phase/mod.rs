mod model;

use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::phase::PhaseClassification;
use chrono::DateTime;
use chrono::Duration;
use chrono::Local;
use chrono::TimeZone;
use derive_more::Deref;
use derive_more::Display;
use derive_more::From;
use derive_more::Into;
use derive_new::new;
use hashbrown::HashMap;
use once_cell::sync::Lazy;
use rust_decimal::Decimal;
use rust_decimal::prelude::FromPrimitive;
use rust_decimal_macros::dec;
use serde::Serialize;
use std::ops::Range;
use std::str::FromStr;
use tabled::Tabled;

/// New-type dedicated for encapsulating logic and representation of "weight"
/// associated to a given phase which is combination of common dosage associated
/// with ingestion's substance and phase classification factors used to add
/// intensity to the phase.
#[derive(Debug, Clone, Serialize, From, Into, new)]
pub struct PhaseWeight(pub(crate) Decimal);


impl PhaseWeight
{
    pub fn calculate(
        ingestion_dosage: Dosage,
        ingestion_phase_classification: PhaseClassification,
        common_dosage_of_substance: Dosage,
    ) -> Self
    {
        let dosage_factor =
            ingestion_dosage.as_base_units() / common_dosage_of_substance.as_base_units();
        let phase_factor = PhaseClassificationFactor::from(ingestion_phase_classification).0;
        let weight = Decimal::from_f64(dosage_factor).unwrap() * phase_factor;
        PhaseWeight(weight)
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IngestionPhase
{
    /// Unique identifier for the ingestion phase.
    /// This is optional and may be `None` if the phase has not been persisted
    /// to a database.
    pub id: Option<String>,

    /// The ingestion ID associated with this phase.
    /// This is an optional field that may be `None` if the phase has not been
    /// associated with an ingestion.
    pub ingestion_id: Option<i32>,

    /// Classification of the phase, indicating the type or nature of the phase.
    /// This is typically an enum value that categorizes the phase.
    pub classification: PhaseClassification,

    /// The time range during which the phase starts.
    /// This is a range of `DateTime<Local>` values, representing the minimum
    /// and maximum start times.
    #[serde(serialize_with = "serialize_datetime_range")]
    pub start_time: std::ops::Range<DateTime<Local>>,

    /// The time range during which the phase ends.
    /// This is a range of `DateTime<Local>` values, representing the minimum
    /// and maximum end times.
    #[serde(serialize_with = "serialize_datetime_range")]
    pub end_time: std::ops::Range<DateTime<Local>>,

    /// The duration range of the phase.
    /// This is a range of `Duration` values, representing the minimum and
    /// maximum durations.
    #[serde(serialize_with = "serialize_duration_range")]
    pub duration: std::ops::Range<Duration>,

    /// The weight associated with the phase.
    /// This is a `Decimal` value that may represent the significance or impact
    /// of the phase.
    pub weight: PhaseWeight,

    /// The name of the substance associated with this ingestion phase.
    /// This is a string value representing the substance name.
    pub substance_name: String,
}

fn serialize_datetime_range<S>(
    range: &Range<DateTime<Local>>,
    serializer: S,
) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    use serde::Serializer;
    use serde::ser::SerializeStruct;
    let mut state = serializer.serialize_struct("DateTimeRange", 2)?;
    state.serialize_field("start", &range.start.to_rfc3339())?;
    state.serialize_field("end", &range.end.to_rfc3339())?;
    state.end()
}

fn serialize_duration_range<S>(range: &Range<Duration>, serializer: S) -> Result<S::Ok, S::Error>
where S: serde::Serializer
{
    use serde::Serializer;
    use serde::ser::SerializeStruct;
    let mut state = serializer.serialize_struct("DurationRange", 2)?;
    state.serialize_field("start", &range.start.num_seconds())?;
    state.serialize_field("end", &range.end.num_seconds())?;
    state.end()
}

/// Newtype wrapper for `Decimal` to represent the factor of a phase
/// classification, it's a value between 0.0 and 1.0 that represents the
/// intensity of the phase - it was introduced to build a plot of intensity
/// over time.
#[derive(Debug, Clone, From, Into, Deref, Display)]
pub struct PhaseClassificationFactor(pub Decimal);

impl PhaseClassificationFactor
{
    pub fn new(value: Decimal) -> Result<Self, String>
    {
        if value >= Decimal::ZERO && value <= Decimal::ONE
        {
            Ok(Self(value))
        }
        else
        {
            Err("Value must be between 0.0 and 1.0".to_string())
        }
    }
}

impl From<PhaseClassification> for PhaseClassificationFactor
{
    fn from(class: PhaseClassification) -> Self
    {
        Self::new(*PHASE_INTENSIVITY_FACTOR_MAP.get(&class).unwrap()).unwrap()
    }
}

pub static PHASE_INTENSIVITY_FACTOR_MAP: Lazy<HashMap<PhaseClassification, Decimal>> =
    Lazy::new(|| {
        let mut map = HashMap::new();
        map.insert(PhaseClassification::Onset, dec!(0.0));
        map.insert(PhaseClassification::Comeup, dec!(0.5));
        map.insert(PhaseClassification::Peak, dec!(1.0));
        map.insert(PhaseClassification::Comedown, dec!(0.3));
        map.insert(PhaseClassification::Afterglow, dec!(0.0));
        map.insert(PhaseClassification::Unknown, dec!(0.0));
        map
    });
