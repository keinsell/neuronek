use clap::{Parser, Subcommand};
use hashbrown::HashMap;
use nutype::nutype;
use crate::ingestion::model::SubstanceName;
use crate::substance::route_of_administration::dosage::Dosage;

#[nutype(
	sanitize(trim, lowercase),
	validate(not_empty),
	derive(Debug, Clone, Serialize, TryFrom, Into, Hash, PartialEq, Eq)
)]
pub struct FormulationName(String);

/// The Formulation represents a mixture of different substances
/// combined into a specific preparation or product.
///
/// Formulations contain active pharmaceutical ingredients (APIs) and potentially
/// other excipients that serve various purposes such as improving bioavailability,
/// stability, or administration.
///
/// See: https://en.wikipedia.org/wiki/Pharmaceutical_formulation
#[derive(Debug, Clone)]
pub struct Formulation
{
	/// Unique identifier for the formulation, only present for persisted formulations
	pub id: Option<uuid::Uuid>,
	/// Name of the formulation
	pub name: FormulationName,
	/// Optional descriptive text about the formulation
	pub description: Option<String>,
	/// List of substances that make up this formulation, each with their own dosage
	pub ingredients: FormulationIngredients,
}

#[derive(Clone, Debug)]
pub struct FormulationIngredients(HashMap<SubstanceName, Dosage>);

pub struct FormulationIngredient
{
	id: Option<uuid::Uuid>,
	substance_name: SubstanceName,
	substance_dosage: Dosage,
}

#[derive(Debug, Parser)]
pub struct CreateFormulation
{
	#[clap(short, long)]
	name: String,
	#[clap(short, long)]
	description: Option<String>,
}

#[derive(Debug, Parser)]
pub struct UpdateFormulation
{
	name: Option<String>,
	description: Option<String>,
}

#[derive(Debug, Parser)]
pub struct DeleteFormulation
{
	id: uuid::Uuid,
}

#[derive(Debug, Subcommand)]
pub enum Command {
	Create(CreateFormulation),
	Update(UpdateFormulation),
	Delete(DeleteFormulation),
}

pub fn create_formulation(create_formulation: &CreateFormulation) {
	dbg!("Creating formulation: {:?}", create_formulation);
}

pub fn update_formulation() { todo!() }

pub fn delete_formulation() { todo!() }

pub fn add_formulation_ingredient() { todo!() }

pub fn remove_formulation_ingredient() { todo!() }

pub fn update_formulation_ingredient() { todo!() }

pub fn ingest_formulation() { todo!() }
