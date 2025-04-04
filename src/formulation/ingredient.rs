use clap::{Args, Subcommand};
use nutype::nutype;
use sea_orm::DatabaseTransaction;

use crate::ingestion::model::SubstanceName;
use crate::substance::route_of_administration::dosage::Dosage;

#[nutype(derive(Debug, Clone, Serialize, TryFrom, Into, Eq, Hash))]
pub struct Ingredient(SubstanceName, Dosage);

impl PartialEq<Self> for Ingredient
{
	fn eq(&self, other: &Self) -> bool { self.clone().into_inner() == other.clone().into_inner() }
}

#[derive(Debug, Args)]
pub struct CreateIngredient
{
	#[arg()]
	pub substance_name: String,
	#[arg()]
	pub dosage: Dosage,
}

async fn create_ingredient(
	create_ingredient: &CreateIngredient, database_transaction: &DatabaseTransaction,
) -> miette::Result<Ingredient>
{
	todo!()
}

#[async_std::test]
async fn should_create_ingredient() {}

#[derive(Debug, Args)]
pub struct UpdateIngredient
{
	#[arg()]
	ingredient_id: i32,
	#[arg()]
	pub substance_name: Option<String>,
	#[arg()]
	pub dosage: Option<Dosage>,
}

async fn update_ingredient(
	update_ingredient: &UpdateIngredient, transaction: &DatabaseTransaction,
) -> miette::Result<()>
{
	todo!()
}

#[async_std::test]
async fn should_update_ingredient() {}

#[derive(Debug, Args)]
pub struct DeleteIngredient
{
	#[arg(index = 1, value_name = "INGREDIENT_ID")]
	id: i32,
}

async fn delete_ingredient(
	ingredient_id: i32, transaction: &DatabaseTransaction,
) -> miette::Result<()>
{
	todo!()
}

#[async_std::test]
async fn should_delete_ingredient() {}

#[derive(Debug, Args)]
pub struct GetIngredient
{
	#[arg(index = 1, value_name = "INGREDIENT_ID")]
	id: i32,
}

async fn get_ingredient(
	get_ingredient: &GetIngredient, transaction: &DatabaseTransaction,
) -> miette::Result<Ingredient>
{
	todo!()
}

#[async_std::test]
async fn should_get_ingredient() {}

#[derive(Debug, Args)]
pub struct ListIngredients {}

async fn list_ingredients(
	list_ingredients: &ListIngredients, database_transaction: &DatabaseTransaction,
) -> miette::Result<Vec<Ingredient>>
{
	todo!()
}

#[derive(Debug, Subcommand)]
pub enum Command
{
	Create(CreateIngredient),
	Update(UpdateIngredient),
	Delete(DeleteIngredient),
	Get(GetIngredient),
	List(ListIngredients),
}
