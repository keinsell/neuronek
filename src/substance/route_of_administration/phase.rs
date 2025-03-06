use iso8601_duration::Duration;
use serde::Deserialize;
use serde::Serialize;
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

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, PartialOrd, Ord)]
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

#[derive(Clone, Debug)]
#[allow(dead_code)]
pub struct PhaseIcon(pub String);

impl From<&PhaseClassification> for PhaseIcon
{
    fn from(value: &PhaseClassification) -> Self
    {
        let icon = match value
        {
            | PhaseClassification::Comeup => "△".to_string(),
            | PhaseClassification::Onset => "▲".to_string(),
            | PhaseClassification::Peak => "◆".to_string(),
            | PhaseClassification::Comedown => "▽".to_string(),
            | PhaseClassification::Afterglow => "○".to_string(),
            | _ => "".to_string(),
        };

        PhaseIcon(icon)
    }
}
