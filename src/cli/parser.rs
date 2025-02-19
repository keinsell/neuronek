use crate::cli::MessageFormat;
use serde::Deserialize;
use serde::Serialize;
use tabled::Table;
use tabled::Tabled;

pub trait Parser<'a>: Deserialize<'a>
{
    type Output;
    type Error: std::error::Error;

    /// Parse a string input into the target type
    fn parse(input: &'a str) -> Result<Self::Output, Self::Error>;
}
