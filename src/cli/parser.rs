use serde::{Deserialize, Serialize};
use tabled::{Table, Tabled};
use crate::cli::MessageFormat;

pub trait Parser<'a>: Deserialize<'a> {
    type Output;
    type Error: std::error::Error;

    /// Parse a string input into the target type
    fn parse(input: &'a str) -> Result<Self::Output, Self::Error>;
}