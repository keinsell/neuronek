use std::fmt;
use std::ops::Range;
use std::str::FromStr;

use iso8601_duration::Duration;
use serde::{Deserialize, Serialize};

pub const PHASE_ORDER: [PhaseClassification; 5] = [
	PhaseClassification::Onset,
	PhaseClassification::Comeup,
	PhaseClassification::Peak,
	PhaseClassification::Comedown,
	PhaseClassification::Afterglow,
];

/// PhaseClassification is an enumeration that defines the distinct stages of
/// subjective effects experienced with psychoactive substances. In the
/// product's domain, it categorizes a substance’s impact into specific
/// phases—such as onset, rising intensity, peak, declining intensity, and
/// residual effects—allowing the system to accurately label and analyze
/// different segments of a user's experience. https://psychonautwiki.org/wiki/Duration
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, PartialOrd, Ord)]
pub enum PhaseClassification
{
	/// The onset phase can be defined as the period until the very first
	/// changes in perception (i.e. "first alerts") are able to be detected.
	Onset,
	/// The "come up" phase can be defined as the period between the first
	/// noticeable changes in perception and the point of highest subjective
	/// intensity. This is colloquially known as "coming up."
	Comeup,
	/// The peak phase can be defined as period of time in which the intensity
	/// of the substance's effects are at its height.
	Peak,
	/// The offset phase can be defined as the amount of time in between the
	/// conclusion of the peak and shifting into a sober state. This is
	/// colloquially referred to as "coming down."
	Comedown,
	/// The after effects can be defined as any residual effects which may
	/// remain after the experience has reached its conclusion. After effects
	/// depend on the substance and usage. This is colloquially known as a
	/// "hangover" for negative after effects of substances, such as alcohol,
	/// cocaine, and MDMA or an "afterglow" for describing a typically positive,
	/// pleasant effect, typically found in substances such as cannabis, LSD in
	/// low to high doses, and ketamine.
	Afterglow,
	Unknown,
}

impl FromStr for PhaseClassification
{
	type Err = String;

	fn from_str(s: &str) -> Result<Self, Self::Err>
	{
		match s.to_lowercase().as_str() {
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
		match self {
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
