use std::hash::Hash;
use std::ops::Deref;
use std::str::FromStr;

use crate::database::entities::formulation;
use crate::database::entities::formulation_ingredient;
use crate::database::DATABASE_CONNECTION;
use crate::formulation::CreateFormulation;
use crate::formulation::{create_formulation, FormulationName};
use crate::ingestion::model::SubstanceName;
use crate::substance::route_of_administration::dosage::Dosage;
use clap::{Args, Subcommand};
use derive_more::Into;
use miette::IntoDiagnostic;
use rust_decimal::prelude::ToPrimitive;
use rust_decimal::Decimal;
use sea_orm::{ColumnTrait, DatabaseTransaction, EntityTrait, IntoActiveValue, QueryFilter, TransactionTrait};
use serde::{Deserialize, Serialize};
use tabled::Tabled;

#[derive(Debug, Clone, Serialize, Deserialize, Into, PartialEq, Eq, Tabled)]
#[tabled(rename_all = "PascalCase")]
pub struct Ingredient {
	#[tabled(rename = "#")]
	pub id: i32,
	#[tabled(rename = "Substance")]
	pub substance_name: SubstanceName,
	#[tabled(rename = "Dosage")]
	pub dosage: Dosage,
	#[tabled(rename = "Formulation")]
	pub formulation_name: FormulationName,
}

impl Hash for Ingredient {
	fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
		self.substance_name.hash(state);
	}
}

#[derive(Debug, Args, Clone)]
pub struct CreateIngredient {
	/// Name of the formulation to which the ingredient belongs.
	#[arg(
		short = 'f',
		long = "formulation",
		help = "Specifies the formulation name for which the ingredient is being created",
		value_name = "FORMULATION_NAME"
	)]
	pub formulation_name: String,

	/// Name of the substance to be added.
	#[arg(
		short = 's',
		long = "substance",
		help = "Specifies the substance name for the ingredient",
		value_name = "SUBSTANCE_NAME"
	)]
	pub substance_name: String,

	/// Dosage details for the ingredient (e.g., "100 mg").
	#[arg(
        short = 'd',
        long = "dosage",
        help = "Specifies the dosage details (with unit) for the ingredient",
        value_name = "DOSAGE",
        value_parser = Dosage::from_str
	)]
	pub dosage: Dosage,
}

pub async fn create_ingredient(
	create_ingredient: &CreateIngredient, database_transaction: &DatabaseTransaction,
) -> miette::Result<Ingredient>
{
	let formulation = formulation::Entity::find()
		.filter(formulation::Column::Name.eq(&create_ingredient.formulation_name))
		.one(database_transaction)
		.await
		.map_err(|e| miette::miette!("Database error while finding formulation: {}", e))?
		.ok_or_else(|| miette::miette!("Formulation '{}' not found", &create_ingredient.formulation_name))?;
	
	let substance_name = SubstanceName::try_new(create_ingredient.substance_name.clone()).into_diagnostic()?;
	let ingredient = Ingredient {
		id: Default::default(),
		substance_name: substance_name.clone(),
		formulation_name: FormulationName::try_new(create_ingredient.clone().formulation_name).into_diagnostic()?,
		dosage: create_ingredient.dosage.clone(),
	};

    let db_model = crate::database::entities::formulation_ingredient::Entity::insert(
        crate::database::entities::formulation_ingredient::ActiveModel {
            id: Default::default(),
            formulation_id: sea_orm::ActiveValue::Set(formulation.id),
			substance_name: ingredient.substance_name.into_inner().into_active_value(),
			dosage: Decimal::from_f64_retain(ingredient.dosage.as_base_units())
                .unwrap()
                .into_active_value(),
            ..Default::default()
        }
    )
    .exec_with_returning(database_transaction)
    .await
    .map_err(|e| miette::miette!("Database error while creating ingredient: {}", e))?;

	let ingredient = Ingredient {
		id: db_model.id,
		substance_name,
		formulation_name: FormulationName::try_new(create_ingredient.clone().formulation_name).into_diagnostic()?,
		dosage: Dosage::from_base_units(db_model.dosage.to_f64().unwrap()),
	};

	Ok(ingredient)
}

#[async_std::test]
async fn should_create_ingredient() {
	let db_connection = DATABASE_CONNECTION.deref();
    let tx = db_connection.begin().await.unwrap();

	let formulation = create_formulation(
		&CreateFormulation {
			name: "test formulation".into(),
			description: None,
		},
		&tx,
	)
	.await
	.unwrap();

	let create = CreateIngredient {
		formulation_name: "test formulation".to_string(),
		substance_name: "Caffeine".to_string(),
		dosage: Dosage::from_str("100 mg").unwrap(),
	};

	let ingredient = create_ingredient(&create, &tx).await.unwrap();

	let db_ingredient = formulation_ingredient::Entity::find()
		.filter(formulation_ingredient::Column::FormulationId.eq(formulation.id.unwrap()))
		.filter(formulation_ingredient::Column::SubstanceName.eq("caffeine"))
		.one(&tx)
		.await
		.unwrap()
		.unwrap();

	assert_eq!(db_ingredient.formulation_id, formulation.id.unwrap());
	assert_eq!(db_ingredient.substance_name, "caffeine");
	assert_eq!(db_ingredient.dosage.to_f64().unwrap(), 0.0001);
	assert_eq!(ingredient.substance_name.to_string(), "Caffeine");
	assert_eq!(ingredient.dosage, Dosage::from_str("100 mg").unwrap());

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

pub async fn list_ingredients(
	list_ingredients: &ListIngredients,
	database_transaction: &DatabaseTransaction,
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