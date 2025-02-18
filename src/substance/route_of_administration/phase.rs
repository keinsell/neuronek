use iso8601_duration::Duration;
use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use serde::Deserialize;
use serde::Serialize;
use std::f64;
use std::fmt;
use std::ops::Range;
use std::str::FromStr;

pub const PHASE_ORDER: [PhaseClassification; 5] = [
    PhaseClassification::Onset,
    PhaseClassification::Comeup,
    PhaseClassification::Peak,
    PhaseClassification::Comedown,
    PhaseClassification::Afterglow,
];

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum PhaseClassification
{
    Onset,
    Comeup,
    Peak,
    Comedown,
    Afterglow,
    Unknown,
}

impl FromStr for PhaseClassification
{
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err>
    {
        match s.to_lowercase().as_str()
        {
            | "onset" => Ok(Self::Onset),
            | "comeup" => Ok(Self::Comeup),
            | "peak" => Ok(Self::Peak),
            | "comedown" => Ok(Self::Comedown),
            | "offset" => Ok(Self::Comedown),
            | "afterglow" => Ok(Self::Afterglow),
            | _ => Err(format!("Unknown phase classification: {}", s)),
        }
    }
}

impl fmt::Display for PhaseClassification
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result
    {
        match self
        {
            | PhaseClassification::Onset => write!(f, "Onset"),
            | PhaseClassification::Comeup => write!(f, "Comeup"),
            | PhaseClassification::Peak => write!(f, "Peak"),
            | PhaseClassification::Comedown => write!(f, "Comedown"),
            | PhaseClassification::Afterglow => write!(f, "Afterglow"),
            | PhaseClassification::Unknown => write!(f, "Unknown"),
        }
    }
}

impl Default for PhaseClassification
{
    fn default() -> Self { Self::Unknown }
}

pub type DurationRange = Range<Duration>;

pub struct PhaseClassificationFactor(pub Decimal);

impl From<PhaseClassification> for PhaseClassificationFactor
{
    fn from(class: PhaseClassification) -> Self
    {
        match class
        {
            | PhaseClassification::Onset => Self(dec!(0.0)),
            | PhaseClassification::Comeup => Self(dec!(0.5)),
            | PhaseClassification::Peak => Self(dec!(1)),
            | PhaseClassification::Comedown => Self(dec!(0.3)),
            | PhaseClassification::Afterglow => Self(dec!(0.0)),
            | PhaseClassification::Unknown => Self(dec!(0.0)),
        }
    }
}
