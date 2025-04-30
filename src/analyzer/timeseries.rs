use chrono::{DateTime, Utc};
use rust_decimal::Decimal;

pub struct Observation(pub DateTime<Utc>, pub Decimal);

pub struct TimeSeries
{
	pub timestamps: Vec<DateTime<Utc>>,
	pub values: Vec<Decimal>,
	pub label: Option<String>,
}
