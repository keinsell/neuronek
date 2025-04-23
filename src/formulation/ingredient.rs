use std::hash::Hash;
use std::str::FromStr;
use std::ops::Deref;

use clap::{Args, Subcommand};
use derive_more::Into;
use miette::IntoDiagnostic;
use rust_decimal::Decimal;
use rust_decimal::prelude::ToPrimitive;
// use nutype::nutype; // Temporarily commented out
use sea_orm::{ColumnTrait, DatabaseTransaction, EntityTrait, IntoActiveValue, QueryFilter, TransactionTrait};
use serde::{Deserialize, Serialize};
use crate::ingestion::model::SubstanceName;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::database::DATABASE_CONNECTION;
use crate::database::entities::formulation_ingredient;
use crate::formulation::create_formulation;
use crate::formulation::CreateFormulation;
use crate::database::entities::formulation;

// Temporarily remove nutype to unblock implementation
// #[nutype(derive(Debug, Clone, Serialize, TryFrom, Into, Hash, Eq, PartialEq))]
// TODO: Re-add nutype validation for Ingredient once construction pattern is clear
#[derive(Debug, Clone, Serialize, Deserialize, Into, PartialEq, Eq)]
pub struct Ingredient(pub SubstanceName, pub Dosage);

impl Hash for Ingredient {
	fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
		self.0.hash(state);
	}
}

#[derive(Debug, Args, Clone)]
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
	create_ingredient: &CreateIngredient, database_transaction: &DatabaseTransaction,
) -> miette::Result<Ingredient>
{
	// First, ensure the formulation exists
	let formulation = formulation::Entity::find()
		.filter(formulation::Column::Name.eq(&create_ingredient.formulation_name))
		.one(database_transaction)
		.await
		.map_err(|e| miette::miette!("Database error while finding formulation: {}", e))?
		.ok_or_else(|| miette::miette!("Formulation '{}' not found", &create_ingredient.formulation_name))?;
	
	let substance_name = SubstanceName::try_new(create_ingredient.substance_name.clone()).into_diagnostic()?;
	let ingredient = Ingredient(substance_name, create_ingredient.dosage.clone());
	let ingredient = crate::database::entities::formulation_ingredient::Entity::insert(
		crate::database::entities::formulation_ingredient::ActiveModel {
			id: Default::default(),
			formulation_id: sea_orm::ActiveValue::Set(formulation.id),
			substance_name: ingredient.0.into_inner().into_active_value(),
			dosage: Decimal::from_f64_retain(ingredient.1.as_base_units()).unwrap().into_active_value(),
			..Default::default()
		}
	).exec_with_returning(database_transaction).await.map_err(|e| miette::miette!("Database error while creating ingredient: {}", e))?;
	
	let ingredient = Ingredient(
		SubstanceName::try_from(ingredient.substance_name).into_diagnostic()?,
		Dosage::from_base_units(ingredient.dosage.to_f64().unwrap()),
	);

	Ok(ingredient)
}

#[async_std::test]
async fn should_create_ingredient() {
	let db_connection = DATABASE_CONNECTION.deref();
	let tx = db_connection.begin().await.unwrap();

	// First, create the formulation this ingredient will belong to
	let formulation = create_formulation(
		&CreateFormulation {
			name: "test formulation".into(),
			description: None,
		},
		&tx,
	)
	.await
	.unwrap();

	// Now create the ingredient
	let create = CreateIngredient {
		formulation_name: "test formulation".to_string(),
		substance_name: "Caffeine".to_string(),
		dosage: Dosage::from_str("100 mg").unwrap(),
	};

	let ingredient = create_ingredient(&create, &tx).await.unwrap();

	// Query the DB to check it was persisted
	let db_ingredient = formulation_ingredient::Entity::find()
		.filter(formulation_ingredient::Column::FormulationId.eq(formulation.id.unwrap()))
		.filter(formulation_ingredient::Column::SubstanceName.eq("caffeine"))
		.one(&tx)
		.await
		.unwrap()
		.unwrap();

	assert_eq!(db_ingredient.formulation_id, formulation.id.unwrap());
	assert_eq!(db_ingredient.substance_name, "caffeine");
	assert_eq!(db_ingredient.dosage.to_f64().unwrap(), 100.0);
	assert_eq!(ingredient.0.to_string(), "Caffeine");
	assert_eq!(ingredient.1, Dosage::from_str("100 mg").unwrap());

	tx.rollback().await.unwrap();
}

#[derive(Debug, Args, Clone)]
pub struct UpdateIngredient
{
	#[arg()]
	ingredient_id: i32,
	#[arg()]
	pub substance_name: Option<String>,
	#[arg()]
	pub dosage: Option<Dosage>,
}

pub(crate) async fn update_ingredient(
	update_ingredient: &UpdateIngredient, transaction: &DatabaseTransaction,
) -> miette::Result<()>
{
	todo!()
}

#[async_std::test]
async fn should_update_ingredient() {}

#[derive(Debug, Args, Copy, Clone)]
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

#[derive(Debug, Args, Copy, Clone)]
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

#[derive(Debug, Args, Copy, Clone)]
pub struct ListIngredients {}

async fn list_ingredients(
	list_ingredients: &ListIngredients, database_transaction: &DatabaseTransaction,
) -> miette::Result<Vec<Ingredient>>
{
	todo!()
}

#[derive(Debug, Subcommand, Clone)]
pub enum Command
{
	Create(CreateIngredient),
	Update(UpdateIngredient),
	Delete(DeleteIngredient),
	Get(GetIngredient),
	List(ListIngredients),
}

#[derive(Debug, Args, Clone)]
pub struct Entrypoint {
	#[command(subcommand)]
	pub command: Command,
}