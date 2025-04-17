use std::hash::{Hash, Hasher};
use clap::{Args, Subcommand};
use derive_more::{Into, TryFrom};
use nutype::nutype;
use rust_decimal::Decimal;
use sea_orm::DatabaseTransaction;
use rust_decimal::prelude::{FromPrimitive, ToPrimitive};
use serde::Serialize;
use crate::ingestion::model::SubstanceName;
use crate::substance::route_of_administration::dosage::Dosage;

#[derive(Debug, Clone, Serialize, Into, Eq, PartialEq)]
pub struct Ingredient(SubstanceName, Dosage);

impl Hash for Ingredient {
	fn hash<H: Hasher>(&self, state: &mut H) {
		self.0.hash(state);
	}
}

#[derive(Debug, Args)]
pub struct CreateIngredient
{
	#[arg()]
	pub formulation_name: String,
	#[arg()]
	pub substance_name: String,
	#[arg()]
	pub dosage: Dosage,
}

pub async fn create_ingredient(
	create_ingredient: &CreateIngredient,
	database_transaction: &DatabaseTransaction,
) -> miette::Result<Ingredient>
{
	use sea_orm::{ActiveModelTrait, Set};
	use crate::database::entities::formulation_ingredient;

	let active_model = formulation_ingredient::ActiveModel {
		id: Set(0), // Let DB autoincrement
		formulation_name: Set(create_ingredient.formulation_name.clone()),
		substance_name: Set(create_ingredient.substance_name.clone()),
		dosage: Set(Decimal::from_f64(create_ingredient.dosage.as_base_units()).unwrap()),
	};

	let model = active_model
		.insert(database_transaction)
		.await
		.map_err(|e| miette::miette!("Failed to insert ingredient: {e}"))?;

	let dosage = Dosage::from_base_units(
		model.dosage.to_f64().unwrap()
	);
	
	Ok(Ingredient(
		model.substance_name.try_into().map_err(|e| miette::miette!("Invalid substance name: {e}"))?,
		dosage
	))
}

#[async_std::test]
async fn should_create_ingredient() {
	use crate::database::DATABASE_CONNECTION;
	use crate::formulation::create_formulation;
	use crate::formulation::CreateFormulation;
	use crate::substance::route_of_administration::dosage::Dosage;
	use sea_orm::TransactionTrait;
	use std::ops::Deref;

	let db_connection = &DATABASE_CONNECTION;
	let tx = db_connection.deref().begin().await.unwrap();

	// Use a unique formulation name for this test
	let formulation_name = format!("test formulation for ingredient should_create_ingredient");
	// Create a test formulation
	let formulation = create_formulation(
		&CreateFormulation {
			name: formulation_name.clone(),
			description: Some("desc".to_string()),
		},
		&tx,
	)
	.await
	.unwrap();
	let formulation_name = formulation.name.to_string();
	
	// Prepare ingredient
	let ingredient_args = CreateIngredient {
		formulation_name: formulation_name.clone(),
		substance_name: "caffeine".to_string(),
		dosage: Dosage::from_milligrams(100.0),
	};

	// Call create_ingredient
	let ingredient = create_ingredient(&ingredient_args, &tx)
		.await
		.unwrap();

	// Compare display value (capitalized) to match SubstanceName Display impl
	assert_eq!(ingredient.0.to_string(), "Caffeine");
	assert!((ingredient.1.as_base_units() - ingredient_args.dosage.as_base_units()).abs() < 1e-6);

	// Rollback to keep DB clean
	tx.rollback().await.unwrap();
}

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
