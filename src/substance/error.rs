use miette::Diagnostic;
use thiserror::Error;

#[derive(Error, Diagnostic, Debug, PartialEq, Clone)]

pub enum SubstanceError
{
	#[error("substance not found")]
	NotFound,
}
