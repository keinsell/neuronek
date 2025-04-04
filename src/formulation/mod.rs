pub mod ingredient;

use clap::{Args, Subcommand};
use hashbrown::HashSet;
use miette::{IntoDiagnostic, Result};
use nutype::nutype;
use sea_orm::{DatabaseTransaction, EntityTrait, TransactionTrait};
use serde::Serialize;
use tabled::Tabled;
use tracing::info;

use crate::database::DATABASE_CONNECTION;
use crate::formulation::ingredient::Ingredient;

type ActiveModel = crate::database::entities::formulation::ActiveModel;
type Entity = crate::database::entities::formulation::Entity;
type Model = crate::database::entities::formulation::Model;

#[nutype(
	sanitize(trim, lowercase),
	validate(not_empty),
	derive(Debug, Clone, Serialize, TryFrom, Into, Hash, PartialEq, Eq, Display)
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
#[derive(Debug, Clone, Tabled, Serialize)]
#[tabled(display(Option, "tabled::derive::display::option", "---"))]
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
	#[tabled(format = "{:#?}")]
	pub ingredients: FormulationIngredients,
}

#[derive(Debug, Clone, Args)]
pub struct CreateFormulation
{
	#[arg(short, long)]
	name: String,
	#[arg(short, long)]
	description: Option<String>,
}

pub async fn create_formulation(
	create_formulation: &CreateFormulation, database_transaction: &DatabaseTransaction,
) -> miette::Result<Formulation>
{
	let model = {
		let active_model = ActiveModel {
			id: sea_orm::ActiveValue::NotSet,
			name: sea_orm::ActiveValue::Set(create_formulation.name.clone().into()),
			summary: sea_orm::ActiveValue::Set(create_formulation.description.clone()),
			labeller: sea_orm::ActiveValue::NotSet,
			form: sea_orm::ActiveValue::NotSet,
			route: sea_orm::ActiveValue::Set("oral".into()),
		};

		Entity::insert(active_model)
			.exec_with_returning(database_transaction)
			.await
			.into_diagnostic()
	}?;

	let formulation = Formulation {
		id: Some(model.id),
		description: model.summary,
		ingredients: HashSet::new(),
		name: FormulationName::try_from(model.name).into_diagnostic()?,
	};

	info!("Formulation Created");

	Ok(formulation)
}

#[async_std::test]
async fn should_create_formulation()
{
	use sea_orm::EntityTrait;

	use super::*;
	let db_connection = &DATABASE_CONNECTION;
	let tx = db_connection.begin().await.unwrap();

	let result = create_formulation(
		&CreateFormulation {
			name: "test formulation".into(),
			description: Some("Test description".into()),
		},
		&tx,
	)
	.await
	.unwrap();

	tx.commit().await.unwrap();

	assert_eq!(result.id, Some(1));
	assert_eq!(result.name.to_string(), "test formulation");
	assert_eq!(result.description, Some("Test description".into()));
}

#[derive(Debug, Clone, Args)]
pub struct UpdateFormulation
{
	#[arg(index = 1, value_name = "FORMULATION_ID")]
	id: i32,
	#[arg(short, long)]
	name: Option<String>,
	#[arg(short, long)]
	description: Option<String>,
}

pub async fn update_formulation(
	update_formulation: &crate::formulation::UpdateFormulation,
	database_transaction: &DatabaseTransaction,
) -> miette::Result<Formulation>
{
	use sea_orm::{EntityTrait, ColumnTrait, QueryFilter, Set, ActiveValue};

	// First, check if the formulation exists
	let formulation = Entity::find()
		.filter(crate::database::entities::formulation::Column::Id.eq(update_formulation.id))
		.one(database_transaction)
		.await.into_diagnostic()?
		.ok_or_else(|| miette::miette!("Formulation not found"))?;

	// Create an active model for updating
	let mut active_model = ActiveModel {
		id: ActiveValue::Set(formulation.id),
		..Default::default()
	};

	// Set fields that need to be updated
	if let Some(name) = &update_formulation.name {
		active_model.name = Set(name.clone());
	}

	if let Some(description) = &update_formulation.description {
		active_model.summary = Set(Some(description.clone()));
	}

	// Update the formulation in the database
	// First update the model
	Entity::update(active_model)
		.filter(crate::database::entities::formulation::Column::Id.eq(update_formulation.id))
		.exec(database_transaction)
		.await
		.into_diagnostic()?;

	// Then fetch the updated model
	let updated_model = Entity::find()
		.filter(crate::database::entities::formulation::Column::Id.eq(update_formulation.id))
		.one(database_transaction)
		.await
		.into_diagnostic()?
		.ok_or_else(|| miette::miette!("Formulation not found after update"))?;

	// Create and return the updated formulation
	let updated_formulation = Formulation {
		id: Some(updated_model.id),
		name: FormulationName::try_from(updated_model.name).into_diagnostic()?,
		description: updated_model.summary,
		ingredients: HashSet::new(), // Note: We're not updating ingredients here
	};

	info!("Formulation Updated");

	Ok(updated_formulation)
}
#[async_std::test]
async fn should_update_formulation() {
	use sea_orm::EntityTrait;

	use super::*;
	let db_connection = &DATABASE_CONNECTION;
	let tx = db_connection.begin().await.unwrap();

	// First create a formulation
	let created_formulation = create_formulation(
		&CreateFormulation {
			name: "test formulation".into(),
			description: Some("Test description".into()),
		},
		&tx,
	)
	.await
	.unwrap();

	// Then update it
	let updated_formulation = update_formulation(
		&UpdateFormulation {
			id: created_formulation.id.unwrap(),
			name: Some("updated formulation".into()),
			description: Some("Updated description".into()),
		},
		&tx,
	)
	.await
	.unwrap();

	tx.commit().await.unwrap();

	// Verify the update was successful
	assert_eq!(updated_formulation.id, created_formulation.id);
	assert_eq!(updated_formulation.name.to_string(), "updated formulation");
	assert_eq!(updated_formulation.description, Some("Updated description".into()));
}

#[derive(Debug, Clone, Args)]
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
async fn should_delete_formulation() {}

#[derive(Debug, Clone, Args)]
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
async fn should_list_formulations() {}

#[derive(Debug, Clone, Args)]
pub struct GetFormulation {
    #[arg(index = 1, value_name = "FORMULATION_ID")]
    id: i32,
}

pub async fn get_formulation(
    get_formulation: &crate::formulation::GetFormulation,
    transaction: &DatabaseTransaction,
) -> miette::Result<Formulation> {
    use sea_orm::{EntityTrait, ColumnTrait, QueryFilter};

    let formulation = Entity::find()
        .filter(crate::database::entities::formulation::Column::Id.eq(get_formulation.id))
        .one(transaction)
        .await.into_diagnostic()?
        .ok_or_else(|| miette::miette!("Formulation not found"))?;

	Ok(Formulation {
		id: Some(formulation.id),
	    name: FormulationName::try_from(formulation.name).into_diagnostic()?,
		description: formulation.summary,
		ingredients: HashSet::new(),
	})
}

#[async_std::test]
async fn should_get_formulation() {
    use sea_orm::EntityTrait;

    use super::*;
    let db_connection = &DATABASE_CONNECTION;
    let tx = db_connection.begin().await.unwrap();

    let created_formulation = create_formulation(
        &CreateFormulation {
            name: "test formulation".into(),
            description: Some("Test description".into()),
        },
        &tx,
    )
    .await
    .unwrap();

    let result = get_formulation(
        &GetFormulation {
            id: created_formulation.id.unwrap(),
        },
        &tx,
    )
    .await
    .unwrap();

    tx.commit().await.unwrap();

    assert_eq!(result.id, created_formulation.id);
    assert_eq!(result.name.to_string(), "test formulation");
    assert_eq!(result.description, Some("Test description".into()));
}

#[derive(Debug, Subcommand, Clone)]
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
