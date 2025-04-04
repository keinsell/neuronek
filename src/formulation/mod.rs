pub mod ingredient;

use clap::{Args, Subcommand};
use hashbrown::HashSet;
use miette::Result;
use nutype::nutype;
use sea_orm::DatabaseTransaction;

use crate::formulation::ingredient::Ingredient;

#[nutype(
	sanitize(trim, lowercase),
	validate(not_empty),
	derive(Debug, Clone, Serialize, TryFrom, Into, Hash, PartialEq, Eq)
)]
pub struct FormulationName(String);

/// A set of ingredients that make up a formulation. Each ingredient is
/// associated with a dosage.
pub type FormulationIngredients = HashSet<Ingredient>;

/// The Formulation represents a mixture of different substances
/// combined into a specific preparation or product.
///
/// Formulations contain active pharmaceutical ingredients (APIs) and
/// potentially other excipients that serve various purposes such as improving
/// bioavailability, stability, or administration.
///
/// See: https://en.wikipedia.org/wiki/Pharmaceutical_formulation
#[derive(Debug, Clone)]
pub struct Formulation
{
	/// Unique identifier for the formulation, only present for persisted
	/// formulations
	pub id: Option<i32>,
	/// Name of the formulation
	pub name: FormulationName,
	/// Optional descriptive text about the formulation
	pub description: Option<String>,
	/// List of substances that make up this formulation, each with their own
	/// dosage
	pub ingredients: FormulationIngredients,
}

#[derive(Debug, Args)]
pub struct CreateFormulation
{
    #[arg(short, long)]
    name: String,
    #[arg(short, long)]
    description: Option<String>,
}

async fn create_formulation(
    create_formulation: &CreateFormulation, database_transaction: &DatabaseTransaction,
) -> miette::Result<Formulation>
{
    todo!()
}

#[async_std::test]
async fn should_create_formulation() { todo!() }

#[derive(Debug, Args)]
pub struct UpdateFormulation
{
    #[arg(short, long)]
    name: Option<String>,
    #[arg(short, long)]
    description: Option<String>,
}

async fn update_formulation(
    update_formulation: &crate::formulation::UpdateFormulation,
    database_transaction: &DatabaseTransaction,
) -> miette::Result<Formulation>
{
    todo!()
}
#[async_std::test]
async fn should_update_formulation() { todo!() }

#[derive(Debug, Args)]
pub struct DeleteFormulation
{
	#[arg(index = 1, value_name = "FORMULATION_ID")]
	id: i32,
}

async fn delete_formulation(
	delete_formulation: &crate::formulation::DeleteFormulation, transaction: &DatabaseTransaction,
) -> miette::Result<()>
{
	todo!()
}
#[async_std::test]
async fn should_delete_formulation() { todo!() }

#[derive(Debug, Args)]
pub struct ListFormulations
{
    /// Filter formulations by name (contains search)
    #[arg(long)]
    pub name: Option<String>,

    /// Filter formulations that contain specific ingredient IDs
    #[arg(long, value_delimiter = ',')]
    pub with_ingredient_ids: Option<Vec<i32>>,

    /// Limit the number of results
    #[arg(long, default_value = "50")]
    pub limit: u32,
}

async fn list_formulations(
    dto: &ListFormulations, transaction: &DatabaseTransaction,
) -> Result<Vec<Formulation>>
{
    todo!()
}

#[async_std::test]
async fn should_list_formulations() { todo!() }

#[derive(Debug, Args)]
pub struct GetFormulation
{
    #[arg(index = 1, value_name = "FORMULATION_ID")]
    id: i32,
}


async fn get_formulation(
    get_formulation: &crate::formulation::GetFormulation, transaction: &DatabaseTransaction,
) -> miette::Result<Formulation>
{
    todo!()
}


#[async_std::test]
async fn should_get_formulation() { todo!() }

#[derive(Debug, Subcommand)]
pub enum Command
{
    /// Create a new formulation
    Create(CreateFormulation),

    /// Update an existing formulation
    Update(UpdateFormulation),

    /// Delete a formulation
    Delete(DeleteFormulation),

    /// List formulations with optional filters
    List(ListFormulations),

    /// Get a specific formulation by ID
    Get(GetFormulation),
}